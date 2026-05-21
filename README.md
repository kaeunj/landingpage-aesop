# Aesop Fragrance Collection Landing Page

Aesop 브랜드 캠페인형 프래그런스 랜딩페이지입니다. PRD/TRD 기준으로 Vanilla HTML/CSS/JS, Supabase, Vercel 배포를 사용합니다.

## 기능

- 투명 헤더 + 스크롤 시 배경 블러 (`active` 클래스)
- `scroll-behavior: smooth` 부드러운 스크롤
- Intersection Observer 기반 스크롤 리빌 애니메이션
- Philosophy 섹션 패럴랙스
- 반응형 레이아웃 (Desktop / Tablet / Mobile)
- `srcset` / `loading="lazy"` 이미지 최적화
- Discovery Set 신청 폼 → Supabase `discovery_signups` 테이블

## 로컬 실행

정적 파일이므로 로컬 서버가 필요합니다 (ES module CORS).

```bash
npx serve .
```

브라우저에서 `http://localhost:3000` 접속.

## Supabase 설정

1. `js/config.example.js`를 참고해 `js/config.js`에 프로젝트 URL과 anon key 설정
2. 테이블 `discovery_signups` (name, phone, email, created_at)
3. anon 역할 INSERT RLS 정책 필요

마이그레이션은 Supabase MCP로 이미 적용되어 있습니다.

## Vercel 배포

1. [Vercel](https://vercel.com)에 저장소 연결
2. Framework Preset: **Other** (정적 사이트)
3. Build Command: **비워 두기** (또는 Override → None)
4. Output Directory: **비워 두기** (루트에 `index.html` 있음)
5. Deploy

Supabase anon key는 클라이언트 공개용 키이며 `js/config.js`에 포함됩니다. 키 변경 시 `js/config.example.js`를 참고해 수정하세요.

## 프로젝트 구조

```
├── index.html
├── css/styles.css
├── js/
│   ├── config.js          # Supabase credentials (gitignore 권장)
│   ├── config.example.js
│   └── main.js
├── vercel.json
└── README.md
```

## 이미지

Unsplash 라이선스 이미지를 placeholder로 사용합니다. 실제 Aesop 캠페인에서는 브랜드 에셋으로 교체하세요.
