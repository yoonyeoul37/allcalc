import { 
  FaCalculator, 
  FaMoneyBillWave, 
  FaGavel, 
  FaHome, 
  FaChartLine,
  FaLightbulb,
  FaFileInvoiceDollar,
  FaTools,
  FaHeart,
  FaSearch,
  FaGlobe
} from "react-icons/fa";
import { Category } from "../types/calculator";

/**
 * 계산기 카테고리 데이터
 * 각 카테고리별 계산기 목록과 진행률 정보를 포함
 */
export const calculatorCategories: Category[] = [
  { 
    id: "basic", 
    title: "기본계산기", 
    icon: FaCalculator, 
    count: 1, 
    completed: 1,
    calculators: [
      { name: "일반 계산기", description: "기본적인 사칙연산 계산기", popular: true }
    ]
  },
  { 
    id: "finance", 
    title: "금융/대출/신용", 
    icon: FaMoneyBillWave, 
    count: 5, 
    completed: 5,
    calculators: [
      { name: "대출 계산기", description: "월 상환금액 및 이자 계산", popular: true },
      { name: "신용점수 계산기", description: "신용점수 예상 및 개선방법" },
      { name: "예적금 계산기", description: "예금/적금 만기금액 계산" },
      { name: "투자수익률 계산기", description: "투자 수익률 및 손익 계산" },
      { name: "연금 계산기", description: "국민연금/사적연금 수령액 계산" }
    ]
  },
  { 
    id: "legal", 
    title: "개인회생/파산/법률", 
    icon: FaGavel, 
    count: 3, 
    completed: 3,
    calculators: [
      { name: "개인회생 계산기", description: "개인회생 변제금 및 조건 계산", popular: true },
      { name: "개인파산 진단", description: "개인파산 가능 여부 진단" },
      { name: "법정이율 계산기", description: "법정이율 및 지연손해금 계산" }
    ]
  },
  { 
    id: "real_estate", 
    title: "부동산/주택담보대출", 
    icon: FaHome, 
    count: 4, 
    completed: 4,
    calculators: [
      { name: "주택담보대출 계산기", description: "주택담보대출 한도 및 금리 계산", popular: true },
      { name: "전세대출 계산기", description: "전세자금대출 한도 계산" },
      { name: "부동산 취득세 계산기", description: "부동산 취득 시 세금 계산" },
      { name: "양도소득세 계산기", description: "부동산 양도소득세 계산" }
    ]
  },
  { 
    id: "investment", 
    title: "투자/주식/펀드", 
    icon: FaChartLine, 
    count: 6, 
    completed: 6,
    calculators: [
      { name: "주식 수익률 계산기", description: "주식 투자 수익률 계산", popular: true },
      { name: "적립식 펀드 계산기", description: "펀드 적립식 투자 수익 계산" },
      { name: "복리 계산기", description: "복리 투자 수익 계산" },
      { name: "환율 계산기", description: "외환 투자 수익 계산" },
      { name: "가상화폐 계산기", description: "암호화폐 투자 수익 계산" },
      { name: "배당 계산기", description: "배당주 투자 수익 계산" }
    ]
  },
  { 
    id: "utility", 
    title: "공과금/세금/보험", 
    icon: FaLightbulb, 
    count: 7, 
    completed: 7,
    calculators: [
      { name: "전기요금 계산기", description: "월 전기요금 예상 계산", popular: true },
      { name: "가스요금 계산기", description: "도시가스 요금 계산" },
      { name: "상하수도 요금 계산기", description: "수도요금 계산" },
      { name: "종합소득세 계산기", description: "종합소득세 예상 세액" },
      { name: "건강보험료 계산기", description: "건강보험료 예상 금액" },
      { name: "자동차보험료 계산기", description: "자동차보험료 견적" },
      { name: "생명보험료 계산기", description: "생명보험료 계산" }
    ]
  },
  { 
    id: "business", 
    title: "사업자/프리랜서", 
    icon: FaFileInvoiceDollar, 
    count: 8, 
    completed: 8,
    calculators: [
      { name: "부가가치세 계산기", description: "부가세 신고액 계산", popular: true },
      { name: "사업소득세 계산기", description: "사업소득세 예상 계산" },
      { name: "프리랜서 세금 계산기", description: "프리랜서 세금 및 수익 계산" },
      { name: "4대보험 계산기", description: "사업자 4대보험료 계산" },
      { name: "퇴직금 계산기", description: "퇴직금 예상 금액 계산" },
      { name: "프리랜서 원천징수세 계산기", description: "프리랜서 원천징수세 계산" },
      { name: "상속세/증여세/재산세 계산기", description: "상속세, 증여세, 재산세 계산" }
    ]
  },
  { 
    id: "health", 
    title: "건강/운동/다이어트", 
    icon: FaTools, 
    count: 10, 
    completed: 10,
    calculators: [
      { name: "BMI 계산기", description: "체질량지수 및 비만도 계산", popular: true },
      { name: "기초대사율 계산기", description: "하루 기초대사량 계산" },
      { name: "칼로리 계산기", description: "음식별 칼로리 및 운동량 계산" },
      { name: "체지방률 계산기", description: "체지방률 측정 및 관리" },
      { name: "근육량 계산기", description: "근육량 추정 및 관리" },
      { name: "단백질 필요량 계산기", description: "일일 단백질 필요량" },
      { name: "물 섭취량 계산기", description: "하루 권장 수분 섭취량" },
      { name: "혈압 계산기", description: "혈압 수치 해석 및 관리" },
      { name: "임신 계산기", description: "임신 주수 및 출산 예정일" },
      { name: "생리주기 계산기", description: "생리주기 및 배란일 계산" }
    ]
  },
  { 
    id: "family", 
    title: "양육/이혼/가정법률", 
    icon: FaHeart, 
    count: 2, 
    completed: 2,
    calculators: [
      { name: "양육비 계산기", description: "법원 양육비 산정표 기준", popular: true },
      { name: "이혼 재산분할 계산기", description: "혼인 중 형성 재산 분할" }
    ]
  },
  { 
    id: "international", 
    title: "해외/국제/무역", 
    icon: FaGlobe, 
    count: 3, 
    completed: 3,
    calculators: [
      { name: "해외직구 관세 계산기", description: "해외직구 관세 및 부가세 계산", popular: true },
      { name: "환율 계산기", description: "실시간 환율 변환 계산" },
      { name: "국제송금 수수료 계산기", description: "해외송금 수수료 및 환율 손실" }
    ]
  },
  { 
    id: "construction", 
    title: "건설/공사/인테리어", 
    icon: FaTools, 
    count: 5, 
    completed: 5,
    calculators: [
      { name: "콘크리트 계산기", description: "콘크리트 부피 및 재료 계산", popular: true },
      { name: "도배 계산기", description: "도배 면적 및 재료 계산" },
      { name: "타일 계산기", description: "타일 개수 및 시공비 계산" },
      { name: "인테리어 견적 계산기", description: "인테리어 공사 견적 계산" },
      { name: "비계 견적서 계산기", description: "건설, 공사, 인테리어 비계 견적 계산", popular: true }
    ]
  },
  { 
    id: "network", 
    title: "네트워크/IT/개발", 
    icon: FaSearch, 
    count: 3, 
    completed: 3,
    calculators: [
      { name: "서브넷 계산기", description: "IP 주소 및 서브넷 계산", popular: true },
      { name: "암호 생성기", description: "안전한 비밀번호 생성" },
      { name: "데이터 변환 계산기", description: "바이트, KB, MB 변환" }
    ]
  },
  { 
    id: "automotive", 
    title: "자동차/교통", 
    icon: FaTools, 
    count: 3, 
    completed: 0,
    calculators: [
      { name: "자동차세 계산기", description: "자동차세 계산", popular: true },
      { name: "자동차 연비/유류비 계산기", description: "연비 및 유류비 계산" },
      { name: "자동차 취득세/등록세 계산기", description: "자동차 취득세 및 등록세 계산" }
    ]
  },
  { 
    id: "tax_simple", 
    title: "세금/연말정산", 
    icon: FaMoneyBillWave, 
    count: 2, 
    completed: 0,
    calculators: [
      { name: "종합소득세 간이 계산기", description: "간이 종합소득세 계산", popular: true },
      { name: "근로소득세/연말정산 환급액 계산기", description: "연말정산 환급액 계산" }
    ]
  },
  { 
    id: "work_schedule", 
    title: "근무/일정", 
    icon: FaCalculator, 
    count: 1, 
    completed: 0,
    calculators: [
      { name: "공휴일/근무일수 계산기", description: "공휴일 및 근무일수 계산", popular: true }
    ]
  },
  { 
    id: "family_law", 
    title: "가정법률", 
    icon: FaHeart, 
    count: 2, 
    completed: 0,
    calculators: [
      { name: "양육비 계산기", description: "부모 소득, 자녀 수/나이 기반 양육비 계산", popular: true },
      { name: "위자료 계산기", description: "혼인 기간, 귀책 사유 기반 위자료 계산" }
    ]
  },
  { 
    id: "bankruptcy", 
    title: "개인회생/파산/법률", 
    icon: FaGavel, 
    count: 2, 
    completed: 0,
    calculators: [
      { name: "개인회생 변제금 계산기", description: "최저생계비 자동적용 개인회생 변제금 계산", popular: true },
      { name: "법정이자/연체이자 계산기", description: "법정이자 및 연체이자 계산" }
    ]
  },
  { 
    id: "real_estate_rental", 
    title: "부동산/임대차", 
    icon: FaHome, 
    count: 5, 
    completed: 0,
    calculators: [
      { name: "전세/월세 전환 계산기", description: "전세와 월세 전환 계산", popular: true },
      { name: "중도금 이자 계산기", description: "중도금 이자 계산" },
      { name: "취득세/양도세 계산기", description: "부동산 취득세 및 양도세 계산" },
      { name: "부동산 등기비용 계산기", description: "부동산 등기비용 계산" },
      { name: "임대수익률 계산기", description: "임대수익률 계산" }
    ]
  },
  { 
    id: "utilities", 
    title: "공과금/요금", 
    icon: FaLightbulb, 
    count: 3, 
    completed: 0,
    calculators: [
      { name: "전기요금 계산기", description: "주거용, 비주거용, 전기차 전기요금 계산", popular: true },
      { name: "수도요금 계산기", description: "수도요금 계산" },
      { name: "가스요금 계산기", description: "가스요금 계산" }
    ]
  }
]; 