# AllCalc - 무료 온라인 계산기

다양한 계산기를 제공하는 Next.js 기반 웹 애플리케이션입니다.

## 🚀 주요 기능

- **다양한 계산기**: 금융, 건강, 수학, 세금 등 다양한 분야의 계산기
- **실시간 검색**: 계산기 검색 및 필터링
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **타입 안전성**: TypeScript로 작성된 안전한 코드

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 홈페이지
│   └── [calculator]/      # 각 계산기 페이지들
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BasicCalculator.tsx
│   │   └── ScientificCalculator.tsx
│   ├── SearchSection.tsx # 검색 섹션 컴포넌트
│   ├── CalculatorSection.tsx # 계산기 섹션 컴포넌트
│   └── index.ts          # 컴포넌트 중앙 export
├── data/                 # 정적 데이터
│   └── categories.ts     # 계산기 카테고리 데이터
├── types/                # TypeScript 타입 정의
│   └── calculator.ts     # 계산기 관련 타입
├── utils/                # 유틸리티 함수
│   └── searchUtils.ts    # 검색 관련 유틸리티
└── lib/                  # 라이브러리 설정
    └── utils.ts          # 공통 유틸리티
```

## 🏗️ 아키텍처 개선사항

### 1. 기능별 명확한 분리
- **데이터 분리**: `src/data/categories.ts`에서 카테고리 데이터 관리
- **컴포넌트 분리**: 각 기능별로 독립적인 컴포넌트 생성
- **유틸리티 분리**: 검색 로직을 `src/utils/searchUtils.ts`로 분리

### 2. 타입 안전성 강화
- **인터페이스 정의**: `src/types/calculator.ts`에서 타입 정의
- **타입 적용**: 모든 함수와 컴포넌트에 타입 적용

### 3. 재사용성 향상
- **컴포넌트 모듈화**: 각 기능을 독립적인 컴포넌트로 분리
- **중앙 export**: `src/components/index.ts`로 import 간소화
- **유틸리티 함수**: 재사용 가능한 함수들을 별도로 분리

### 4. 하드코딩 최소화
- **데이터 외부화**: 카테고리 데이터를 별도 파일로 분리
- **상수 관리**: 매직 넘버와 문자열을 상수로 관리
- **설정 분리**: 환경별 설정을 별도로 관리

### 5. 직관적인 네이밍
- **함수명**: `handleSearch`, `filterCategoriesBySearch` 등 명확한 함수명
- **변수명**: `searchQuery`, `filteredCategories` 등 의미있는 변수명
- **컴포넌트명**: `SearchSection`, `CalculatorSection` 등 기능별 컴포넌트명

### 6. 충분한 주석
- **JSDoc 주석**: 모든 함수와 컴포넌트에 JSDoc 주석 추가
- **인라인 주석**: 복잡한 로직에 인라인 주석 추가
- **파일 헤더**: 각 파일의 목적과 역할을 명시

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **아이콘**: React Icons
- **개발 도구**: Turbopack

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 📝 코드 품질

### 타입 안전성
- 모든 함수와 컴포넌트에 TypeScript 타입 적용
- 인터페이스를 통한 명확한 계약 정의

### 컴포넌트 구조
- 단일 책임 원칙에 따른 컴포넌트 분리
- Props를 통한 명확한 데이터 전달

### 유지보수성
- 모듈화된 구조로 쉬운 수정과 확장
- 명확한 네이밍과 주석으로 가독성 향상

## 🔧 개발 가이드라인

### 컴포넌트 작성
```typescript
/**
 * 컴포넌트 설명
 * @param props - Props 설명
 */
interface ComponentProps {
  // Props 타입 정의
}

export default function Component({ props }: ComponentProps) {
  // 컴포넌트 로직
}
```

### 유틸리티 함수 작성
```typescript
/**
 * 함수 설명
 * @param param - 매개변수 설명
 * @returns 반환값 설명
 */
export const utilityFunction = (param: ParamType): ReturnType => {
  // 함수 로직
};
```

### 데이터 관리
- 정적 데이터는 `src/data/` 디렉토리에 저장
- 타입 정의는 `src/types/` 디렉토리에 저장
- 유틸리티 함수는 `src/utils/` 디렉토리에 저장

## 📈 성능 최적화

- **컴포넌트 분리**: 불필요한 리렌더링 방지
- **메모이제이션**: React.memo, useMemo, useCallback 활용
- **코드 분할**: 동적 import를 통한 번들 크기 최적화

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

## 📄 라이선스

MIT License
