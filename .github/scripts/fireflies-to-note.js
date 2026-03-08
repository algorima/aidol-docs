#!/usr/bin/env node
/**
 * Fireflies Transcript → Meeting Note PR
 * 
 * 1. Fireflies API에서 트랜스크립트 가져오기
 * 2. 미팅 노트 형식으로 변환
 * 3. GitHub PR 생성
 */

const https = require('https');
const { execSync } = require('child_process');

const MEETING_ID = process.env.MEETING_ID;
const MEETING_TITLE = process.env.MEETING_TITLE;

// === Fireflies GraphQL ===
async function getTranscript(meetingId) {
  const query = `
    query Transcript($transcriptId: String!) {
      transcript(id: $transcriptId) {
        id
        title
        date
        duration
        participants
        summary {
          overview
          action_items
          keywords
        }
        sentences {
          speaker_name
          text
        }
      }
    }
  `;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      query,
      variables: { transcriptId: meetingId }
    });

    const req = https.request({
      hostname: 'api.fireflies.ai',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FIREFLIES_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) {
            reject(new Error(json.errors[0].message));
          } else {
            resolve(json.data.transcript);
          }
        } catch (e) {
          reject(new Error(`Failed to parse API response: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// === Generate Meeting Note ===
function generateMeetingNote(transcript) {
  const date = new Date(transcript.date);
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const dateFormatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  
  const durationMin = Math.round(transcript.duration / 60);
  const participants = transcript.participants?.join(', ') || 'Unknown';
  
  const overview = transcript.summary?.overview || '';
  const actionItems = transcript.summary?.action_items || [];
  const keywords = transcript.summary?.keywords || [];
  
  // 파일명: meeting-notes-YYMMDD-제목.md
  const titleSlug = transcript.title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  
  const filename = `meeting-notes-${dateStr.slice(2)}-${titleSlug}.md`;
  
  const content = `# ${transcript.title}

- 일시: ${dateFormatted} (${dayName}) 약 ${durationMin}분
- 참석자: ${participants}
- 회의 목적: (자동 생성)

---

> TL;DR: ${overview.slice(0, 200)}${overview.length > 200 ? '...' : ''}

## 1. 요약

${overview}

## 2. 액션 아이템

${actionItems.map(item => `- [ ] ${item}`).join('\n') || '- (없음)'}

## 3. 키워드

${keywords.map(k => `\`${k}\``).join(', ') || '(없음)'}

---

*이 미팅 노트는 Fireflies.ai 트랜스크립트를 기반으로 자동 생성되었습니다.*
`;

  return { filename, content };
}

// === Create PR ===
function createPR(filename, content) {
  const branchName = `meeting-notes/${filename.replace('.md', '')}`;
  const filePath = `02_planning/meeting-notes/${filename}`;
  
  // Git 설정
  execSync('git config user.name "github-actions[bot]"');
  execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
  
  // 브랜치 생성
  execSync(`git checkout -b ${branchName}`);
  
  // 파일 생성
  const fs = require('fs');
  fs.mkdirSync('02_planning/meeting-notes', { recursive: true });
  fs.writeFileSync(filePath, content);
  
  // 커밋 & 푸시
  execSync(`git add ${filePath}`);
  execSync(`git commit -m "docs: ${filename} (Fireflies 자동 생성)"`);
  execSync(`git push -u origin ${branchName}`);
  
  // PR 생성 (셸 인젝션 방지를 위해 stdin으로 body 전달)
  const prBody = `## 🎙️ Fireflies 자동 생성 미팅 노트

이 PR은 Fireflies 녹음 완료 후 자동으로 생성되었습니다.

### 체크리스트
- [ ] 내용 확인
- [ ] 액션 아이템 검토
- [ ] 필요시 수정 후 머지`;

  execSync(`gh pr create --title "docs: ${filename}" --body-file - --base main`, { input: prBody });
  
  console.log(`✅ PR created for ${filename}`);
}

// === Main ===
async function main() {
  if (!MEETING_ID) {
    console.error('Missing MEETING_ID');
    process.exit(1);
  }

  console.log(`Fetching transcript for meeting: ${MEETING_ID}`);
  
  try {
    const transcript = await getTranscript(MEETING_ID);
    console.log(`Got transcript: ${transcript.title}`);
    
    const { filename, content } = generateMeetingNote(transcript);
    console.log(`Generated note: ${filename}`);
    
    createPR(filename, content);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
