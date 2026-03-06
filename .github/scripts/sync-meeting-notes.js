#!/usr/bin/env node
/**
 * Sync Meeting Notes to Google Calendar
 * 
 * 미팅 노트에서 일정 파싱 → Google Calendar 자동 추가
 * 
 * Usage: node sync-meeting-notes.js <file1.md> [file2.md] ...
 */

const fs = require('fs');
const https = require('https');

// === Config ===
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'c_43279675d25d4c2af7798ab2bf5a7924bf190e2b4926cfceafe2a436edd0368b@group.calendar.google.com'; // AIdol Team (default)

// 팀원 이름 → 이메일 매핑 (외부 JSON 파일에서 로드)
const path = require('path');
const TEAM_CONFIG_PATH = path.join(__dirname, '../config/team.json');
const TEAM = (() => {
  try {
    const config = JSON.parse(fs.readFileSync(TEAM_CONFIG_PATH, 'utf8'));
    return config.members || {};
  } catch (e) {
    console.warn('Warning: Could not load team.json, using empty team mapping');
    return {};
  }
})();

// 기본 참석자 (항상 초대) - 환경변수에서 로드
const DEFAULT_ATTENDEES = process.env.CALENDAR_ATTENDEES 
  ? process.env.CALENDAR_ATTENDEES.split(',').map(e => e.trim())
  : [];

// === Google OAuth ===
async function getAccessToken() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.access_token) {
            resolve(json.access_token);
          } else {
            reject(new Error(json.error_description || 'Failed to get token'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(params.toString());
    req.end();
  });
}

// === Google Calendar ===
async function createCalendarEvent(accessToken, event) {
  const attendees = event.attendees || DEFAULT_ATTENDEES;
  const body = JSON.stringify({
    summary: event.title,
    description: event.description || '',
    start: { dateTime: event.start, timeZone: 'Asia/Seoul' },
    end: { dateTime: event.end, timeZone: 'Asia/Seoul' },
    attendees: attendees.map(email => ({ email })),
    // Google Meet 자동 생성
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: `/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?sendUpdates=all&conferenceDataVersion=1`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.id) {
            resolve(json);
          } else {
            reject(new Error(json.error?.message || 'Failed to create event'));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// === Parse Attendees from Content ===
function parseAttendees(content) {
  const attendees = new Set(DEFAULT_ATTENDEES);
  
  // "참석자: 이소연, 미진, 제이" 패턴
  const attendeeMatch = content.match(/참석자[:\s]+([^\n]+)/);
  if (attendeeMatch) {
    const names = attendeeMatch[1].split(/[,、，\s]+/).map(n => n.trim());
    for (const name of names) {
      if (TEAM[name]) {
        attendees.add(TEAM[name]);
      }
    }
  }
  
  return Array.from(attendees);
}

// === Parse Duration from Content ===
function parseDuration(content) {
  // "약 N분" 또는 "N분 M초" 패턴
  let match = content.match(/약?\s*(\d+)\s*분/);
  if (match) {
    return parseInt(match[1]);
  }
  
  // "N시간 M분" 패턴
  match = content.match(/(\d+)\s*시간\s*(\d+)?\s*분?/);
  if (match) {
    const hours = parseInt(match[1]);
    const mins = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + mins;
  }
  
  return 60; // 기본값
}

// === Parse Year from Content ===
function parseYear(content, filenameYear) {
  // "일시: YYYY-MM-DD" 또는 "일시: YYYY.MM.DD" 패턴
  const match = content.match(/일시[:\s]+(\d{4})[-.\s]/);
  if (match) {
    return match[1];
  }
  return filenameYear; // fallback to filename
}

// === Parse Time from Title ===
function parseTime(title, duration = 60) {
  // 기본 시간: 10:00
  let startHour = 10;
  let startMin = 0;
  
  // "HH:MM" 또는 "HH시 MM분" 패턴
  let match = title.match(/(\d{1,2})[:\s시](\d{2})?분?\s*(am|pm|AM|PM)?/);
  if (match) {
    startHour = parseInt(match[1]);
    startMin = match[2] ? parseInt(match[2]) : 0;
    if (match[3] && match[3].toLowerCase() === 'pm' && startHour < 12) {
      startHour += 12;
    }
  }
  
  // "오전/오후 N시" 패턴
  match = title.match(/(오전|오후|저녁|아침)\s*(\d{1,2})시/);
  if (match) {
    startHour = parseInt(match[2]);
    if ((match[1] === '오후' || match[1] === '저녁') && startHour < 12) {
      startHour += 12;
    }
    if (match[1] === '아침' && startHour === 12) {
      startHour = 0;
    }
  }
  
  const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}:00`;
  const endHour = startHour + Math.floor((startMin + duration) / 60);
  const endMin = (startMin + duration) % 60;
  const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
  
  return { startTime, endTime };
}

// === Parse Meeting Notes ===
function parseMeetingNote(content, filename) {
  const events = [];
  
  // 파일명에서 날짜 추출 (YYMMDD format) - fallback용
  const dateMatch = filename.match(/(\d{6})/);
  if (!dateMatch) return events;
  
  const filenameYear = '20' + dateMatch[1].slice(0, 2);
  
  // 본문에서 연도 추출 (우선), 없으면 파일명 사용
  const year = parseYear(content, filenameYear);
  
  // 본문에서 미팅 시간 추출
  const duration = parseDuration(content);
  
  // 참석자 파싱
  const attendees = parseAttendees(content);
  
  // 일정 패턴 찾기
  // "월요일(3/2): 미팅 내용" or "3/2(월): 미팅 내용"
  const lines = content.split('\n');
  
  for (const line of lines) {
    let m, d, title;
    
    // Pattern: 요일(M/D): 내용
    let match = line.match(/([월화수목금토일])요일\s*\((\d{1,2})\/(\d{1,2})\)\s*[:\-]\s*(.+)/);
    if (match) {
      [, , m, d, title] = match;
    } else {
      // Pattern: M/D(요일): 내용
      match = line.match(/(\d{1,2})\/(\d{1,2})\s*\([월화수목금토일]\)\s*[:\-]\s*(.+)/);
      if (match) {
        [, m, d, title] = match;
      }
    }
    
    if (title) {
      const date = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      const { startTime, endTime } = parseTime(title, duration);
      events.push({
        title: title.trim(),
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        description: `From: ${filename}`,
        attendees: attendees
      });
    }
  }
  
  return events;
}

// === Main ===
async function main() {
  const files = process.argv.slice(2).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('No meeting note files to process');
    return;
  }
  
  console.log(`Processing ${files.length} file(s)...`);
  
  let accessToken;
  try {
    accessToken = await getAccessToken();
    console.log('✓ Got access token');
  } catch (err) {
    console.error('✗ Failed to get access token:', err.message);
    process.exit(1);
  }
  
  let totalEvents = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const events = parseMeetingNote(content, file);
      
      console.log(`\n📄 ${file}: found ${events.length} event(s)`);
      
      for (const event of events) {
        try {
          await createCalendarEvent(accessToken, event);
          console.log(`  ✓ Created: ${event.title} (${event.start.slice(0, 10)})`);
          totalEvents++;
        } catch (err) {
          console.error(`  ✗ Failed: ${event.title} - ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`✗ Error reading ${file}:`, err.message);
    }
  }
  
  console.log(`\n✅ Done! Created ${totalEvents} calendar event(s)`);
}

main().catch(console.error);
