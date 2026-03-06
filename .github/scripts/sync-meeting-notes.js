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
const CALENDAR_ID = 'c_43279675d25d4c2af7798ab2bf5a7924bf190e2b4926cfceafe2a436edd0368b@group.calendar.google.com'; // AIdol Team
const ATTENDEES = ['leesoyena@gmail.com', 'sylee@aioia.ai'];

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
        const json = JSON.parse(data);
        if (json.access_token) {
          resolve(json.access_token);
        } else {
          reject(new Error(json.error_description || 'Failed to get token'));
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
  const body = JSON.stringify({
    summary: event.title,
    description: event.description || '',
    start: { dateTime: event.start, timeZone: 'Asia/Seoul' },
    end: { dateTime: event.end, timeZone: 'Asia/Seoul' },
    attendees: ATTENDEES.map(email => ({ email })),
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
        const json = JSON.parse(data);
        if (json.id) {
          resolve(json);
        } else {
          reject(new Error(json.error?.message || 'Failed to create event'));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// === Parse Meeting Notes ===
function parseMeetingNote(content, filename) {
  const events = [];
  
  // 파일명에서 날짜 추출 (YYMMDD format)
  const dateMatch = filename.match(/(\d{6})/);
  if (!dateMatch) return events;
  
  const year = '20' + dateMatch[1].slice(0, 2);
  const month = dateMatch[1].slice(2, 4);
  
  // 일정 패턴 찾기
  // "월요일(3/2): 미팅 내용" or "3/2(월): 미팅 내용"
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Pattern: 요일(M/D): 내용
    let match = line.match(/([월화수목금토일])요일\s*\((\d{1,2})\/(\d{1,2})\)\s*[:\-]\s*(.+)/);
    if (match) {
      const [, , m, d, title] = match;
      const date = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      events.push({
        title: title.trim(),
        start: `${date}T10:00:00`,
        end: `${date}T11:00:00`,
        description: `From: ${filename}`
      });
      continue;
    }
    
    // Pattern: M/D(요일): 내용
    match = line.match(/(\d{1,2})\/(\d{1,2})\s*\([월화수목금토일]\)\s*[:\-]\s*(.+)/);
    if (match) {
      const [, m, d, title] = match;
      const date = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      events.push({
        title: title.trim(),
        start: `${date}T10:00:00`,
        end: `${date}T11:00:00`,
        description: `From: ${filename}`
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
          const result = await createCalendarEvent(accessToken, event);
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
