"use client";

import { useState } from "react";
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
import Header from '../components/ui/Header';
import ScientificCalculator from '../components/ui/ScientificCalculator';
import BasicCalculator from '../components/ui/BasicCalculator';

// 카테고리 데이터와 각 카테고리별 계산기 리스트
const categoriesData = [
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
    count: 9, 
    completed: 9,
    calculators: [
      { name: "부가가치세 계산기", description: "부가세 신고액 계산", popular: true },
      { name: "사업소득세 계산기", description: "사업소득세 예상 계산" },
      { name: "프리랜서 세금 계산기", description: "프리랜서 세금 및 수익 계산" },
      { name: "4대보험 계산기", description: "사업자 4대보험료 계산" },
      { name: "퇴직금 계산기", description: "퇴직금 예상 금액 계산" },
      { name: "프리랜서 원천징수세 계산기", description: "프리랜서 원천징수세 계산" },
      { name: "상속세/증여세/재산세 계산기", description: "상속세, 증여세, 재산세 계산" },
      { name: "개인사업자 세무 계산기", description: "개인사업자 종합 세무 계산" }
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
    count: 4, 
    completed: 4,
    calculators: [
      { name: "콘크리트 계산기", description: "콘크리트 부피 및 재료 계산", popular: true },
      { name: "도배 계산기", description: "도배 면적 및 재료 계산" },
      { name: "타일 계산기", description: "타일 개수 및 시공비 계산" },
      { name: "인테리어 견적 계산기", description: "인테리어 공사 견적 계산" }
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categoriesData);
  
  const totalCalculators = categoriesData.reduce((sum, cat) => sum + cat.count, 0);

  // 검색 기능
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCategories(categoriesData);
      return;
    }

    const filtered = categoriesData.map(category => ({
      ...category,
      calculators: category.calculators.filter(calc => 
        calc.name.toLowerCase().includes(query.toLowerCase()) ||
        calc.description.toLowerCase().includes(query.toLowerCase()) ||
        category.title.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(category => category.calculators.length > 0);

    setFilteredCategories(filtered);
  };

  // 카테고리 클릭 시 해당 카테고리 표시
  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={handleSearch} />
      
      <div className="w-full px-8 py-6" style={{backgroundColor: '#d1dde9', minHeight: '600px'}}>
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">무료 온라인 계산기</h1>
            <div className="w-96 mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="대출 계산기, BMI 계산기, 과학 계산기..."
                  className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-full bg-white/90 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <button 
                    onClick={() => handleSearch(searchQuery)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-10 justify-center items-start">
            <BasicCalculator />
            <ScientificCalculator />
          </div>
        </div>
      </div>

      <div className="w-full py-12 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaMoneyBillWave className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">재무 계산기</h2>
              <div className="space-y-1">
                <div><a href="/mortgage-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>주택담보대출 계산기</a></div>
                <div><a href="/loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>대출 계산기</a></div>
                <div><a href="/car-loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 대출 계산기</a></div>
                <div><a href="/interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>이자 계산기</a></div>
                <div><a href="/repayment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>상환 계산기</a></div>
                <div><a href="/retirement-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>은퇴 계산기</a></div>
                <div><a href="/depreciation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>감가상각 계산기</a></div>
                <div><a href="/investment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>투자 계산기</a></div>
                <div><a href="/inflation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>인플레이션 계산기</a></div>
                <div><a href="/income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>소득세 계산기</a></div>
                <div><a href="/compound-interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>복리 계산기</a></div>
                <div><a href="/salary-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>급여 계산기</a></div>
                <div><a href="/sales-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>판매세 계산기</a></div>
                <div><a href="/customs-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>해외직구 관세 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">피트니스 및 건강 계산기</h2>
              <div className="space-y-1">
                <div><a href="/bmi-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>BMI 계산기</a></div>
                <div><a href="/calorie-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>칼로리 계산기</a></div>
                <div><a href="/body-fat-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>체지방 계산기</a></div>
                <div><a href="/muscle-mass-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>근육량 계산기</a></div>
                <div><a href="/bmr-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>BMR 계산기</a></div>
                <div><a href="/ideal-weight-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>이상체중 계산기</a></div>
                <div><a href="/pace-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>페이스 계산기</a></div>
                <div><a href="/pregnancy-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임신 계산기</a></div>
                <div><a href="/pregnancy-adjustment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임신 수정 계산기</a></div>
                <div><a href="/due-date-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>출산 예정일 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaCalculator className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">수학 계산기</h2>
              <div className="space-y-1">
                <div><a href="/engineering-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>공학용 계산기</a></div>
                <div><a href="/fraction-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>분수 계산기</a></div>
                <div><a href="/percentage-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>백분율 계산기</a></div>
                <div><a href="/random-number-generator" className="hover:underline text-sm" style={{color: '#276699'}}>난수 생성기</a></div>
                <div><a href="/triangle-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>삼각형 계산기</a></div>
                <div><a href="/standard-deviation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>표준편차 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaTools className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">기타 계산기</h2>
              <div className="space-y-1">
                <div><a href="/age-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>나이 계산기</a></div>
                <div><a href="/date-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>날짜 계산기</a></div>
                <div><a href="/time-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>시간 계산기</a></div>
                <div><a href="/gpa-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>GPA 계산기</a></div>
                <div><a href="/grade-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>성적 계산기</a></div>
              </div>
            </div>
            
          </div>


        </div>

        {/* 새로운 카테고리 섹션 - 다른 배경색 */}
        <div className="w-full py-12" style={{backgroundColor: '#f8f9fa'}}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaFileInvoiceDollar className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">사업자/프리랜서</h2>
              <div className="space-y-1">
                <div><a href="/vat-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>부가가치세 계산기</a></div>
                <div><a href="/income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>사업소득세 계산기</a></div>
                <div><a href="/salary-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>프리랜서 세금 계산기</a></div>
                <div><a href="/social-insurance-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>4대보험 계산기</a></div>
                <div><a href="/severance-pay-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>퇴직금 계산기</a></div>
                <div><a href="/freelancer-withholding-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>프리랜서 원천징수세 계산기</a></div>
                <div><a href="/inheritance-gift-property-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>상속세/증여세/재산세 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>개인사업자 세무 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaGlobe className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">해외/국제/무역</h2>
              <div className="space-y-1">
                <div><a href="/customs-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>해외직구 관세 계산기</a></div>
                <div><a href="/exchange-rate-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>환율 계산기</a></div>
                <div><a href="/international-transfer-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>국제송금 수수료 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaTools className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">건설/공사/인테리어</h2>
              <div className="space-y-1">
                <div><a href="/concrete-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>콘크리트 계산기</a></div>
                <div><a href="/wallpaper-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>도배 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>타일 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>인테리어 견적 계산기</a></div>
                <div><a href="/unit-converter" className="hover:underline text-sm" style={{color: '#276699'}}>단위 변환기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaSearch className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">네트워크/IT/개발</h2>
              <div className="space-y-1">
                <div><a href="/subnet-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>서브넷 계산기</a></div>
                <div><a href="/password-generator" className="hover:underline text-sm" style={{color: '#276699'}}>암호 생성기</a></div>
                <div><a href="/unit-converter" className="hover:underline text-sm" style={{color: '#276699'}}>단위 변환기</a></div>
                <div><a href="/data-converter" className="hover:underline text-sm" style={{color: '#276699'}}>데이터 변환 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaCalculator className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">자동차/교통</h2>
              <div className="space-y-1">
                <div><a href="/automobile-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차세 계산기</a></div>
                <div><a href="/automobile-fuel-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 연비/유류비 계산기</a></div>
                <div><a href="/acquisition-transfer-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 취득세/등록세 계산기</a></div>
                <div><a href="/car-loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 대출 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaFileInvoiceDollar className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">세금/연말정산</h2>
              <div className="space-y-1">
                <div><a href="/comprehensive-income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>종합소득세 간이 계산기</a></div>
                <div><a href="/work-income-tax-refund-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>근로소득세 연말정산 환급액 계산기</a></div>
                <div><a href="/income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>소득세 계산기</a></div>
                <div><a href="/vat-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>부가가치세 계산기</a></div>
                <div><a href="/sales-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>판매세 계산기</a></div>
              </div>
            </div>
            
          </div>
          </div>
        </div>

        {/* 추가 카테고리 섹션 */}
        <div className="w-full py-12" style={{backgroundColor: '#e8f4f8'}}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaTools className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">자동차/교통</h2>
              <div className="space-y-1">
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>자동차세 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 연비/유류비 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 취득세/등록세 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaMoneyBillWave className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">세금/연말정산</h2>
              <div className="space-y-1">
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>종합소득세 간이 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>근로소득세/연말정산 환급액 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaCalculator className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">근무/일정</h2>
              <div className="space-y-1">
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>공휴일/근무일수 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">가정법률</h2>
              <div className="space-y-1">
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>양육비 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>위자료 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaGavel className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">개인회생/파산/법률</h2>
              <div className="space-y-1">
                <div><a href="/personal-rehabilitation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>개인회생 변제금 계산기</a></div>
                <div><a href="#" className="hover:underline text-sm" style={{color: '#276699'}}>법정이자/연체이자 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHome className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">부동산/임대차</h2>
              <div className="space-y-1">
                <div><a href="/jeonse-monthly-converter" className="hover:underline text-sm" style={{color: '#276699'}}>전세/월세 전환 계산기</a></div>
                <div><a href="/interim-payment-interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>중도금 이자 계산기</a></div>
                <div><a href="/acquisition-transfer-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>취득세/양도세 계산기</a></div>
                <div><a href="/real-estate-registration-cost-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>부동산 등기비용 계산기</a></div>
                <div><a href="/rental-yield-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임대수익률 계산기</a></div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaLightbulb className="text-3xl text-gray-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">공과금/요금</h2>
              <div className="space-y-1">
                <div><a href="/electricity-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>전기요금 계산기</a></div>
                <div><a href="/water-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>수도요금 계산기</a></div>
                <div><a href="/gas-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>가스요금 계산기</a></div>
              </div>
            </div>
            
          </div>
          </div>
        </div>
        
        <div className="bg-gray-200 p-6 mt-8 text-sm text-gray-700 leading-relaxed">
          <p className="mb-4">
            Calculator.net의 유일한 초점은 다양한 분야에서 빠르고 포괄적이며 편리한 무료 온라인 계산기를 제공하는 것입니다. 
            현재 우리는 금융, 피트니스, 건강, 수학 등의 분야에서 "빠른 계산"을 도와주는 약 200개의 계산기를 보유하고 있으며, 
            계속해서 더 많은 계산기를 개발하고 있습니다. 우리의 목표는 빠른 계산이 필요한 사람들을 위한 원스톱, 최고의 사이트가 되는 것입니다. 
            또한 우리는 인터넷이 무료 정보의 원천이어야 한다고 믿습니다. 따라서 우리의 모든 도구와 서비스는 회원가입 없이 완전히 무료입니다.
          </p>
          <p className="mb-4">
            우리는 각 계산기를 개별적으로 코딩하고 개발했으며 각각을 엄격하고 포괄적인 테스트를 거쳤습니다. 
            그러나 아주 작은 오류라도 발견하시면 알려주시기 바랍니다 – 귀하의 의견은 우리에게 매우 소중합니다. 
            Calculator.net의 대부분의 계산기는 전 세계적으로 사용할 수 있도록 설계되었지만, 일부는 특정 국가 전용입니다. 
            예를 들어, 소득세 계산기는 미국 거주자만을 위한 것입니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            우리에 대해 | 사이트맵 | 이용 약관 | 개인정보 보호정책 © 2008 - 2025 calculator.net
          </div>
        </div>
      </div>
    </div>
  );
}