# 배포 가이드

## 404 문제 해결

이 프로젝트는 정적 사이트 생성(SSG)을 사용하므로, 배포 시 404 오류가 발생할 수 있습니다. 이를 해결하기 위해 다음 방법들을 사용합니다:

### 1. GitHub Pages 배포

1. `out` 폴더의 내용을 GitHub Pages에 업로드
2. `_redirects` 파일이 자동으로 SPA 라우팅을 처리

### 2. Netlify 배포

1. `out` 폴더를 Netlify에 드래그 앤 드롭
2. `public/_redirects` 파일이 자동으로 SPA 라우팅을 처리

### 3. Vercel 배포

1. GitHub 저장소를 Vercel에 연결
2. 빌드 설정:
   - Build Command: `npm run build`
   - Output Directory: `out`
   - Install Command: `npm install`

## 빌드 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 정적 파일 생성 (out 폴더)
npm run export
```

## 환경별 설정

### 개발 환경
- `output: undefined`
- `basePath: undefined`
- 서버 사이드 라우팅 사용

### 배포 환경
- `output: 'export'`
- `basePath: '/allcalc'` (GitHub Pages의 경우)
- 정적 파일 생성

## 404 문제 해결 방법

1. **SPA 라우팅**: 모든 경로를 `index.html`로 리다이렉트
2. **클라이언트 사이드 라우팅**: React Router가 경로 처리
3. **정적 파일 생성**: 모든 페이지가 미리 빌드됨

## 배포 후 확인사항

1. 메인 페이지 접속 확인
2. 각 계산기 페이지 접속 확인
3. 직접 URL 접속 시 404 오류 없는지 확인
4. 브라우저 뒤로가기/앞으로가기 정상 작동 확인 