"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer, SearchSection } from '../components';

// 계산기 데이터 정의
const calculators = [
  // 재무 계산기
  { name: "주택담보대출 계산기", url: "/mortgage-calculator", category: "재무" },
  { name: "대출 계산기", url: "/loan-calculator", category: "재무" },
  { name: "자동차 대출 계산기", url: "/car-loan-calculator", category: "재무" },
  { name: "이자 계산기", url: "/interest-calculator", category: "재무" },
  { name: "상환 계산기", url: "/repayment-calculator", category: "재무" },
  { name: "은퇴 계산기", url: "/retirement-calculator", category: "재무" },
  { name: "감가상각 계산기", url: "/depreciation-calculator", category: "재무" },
  { name: "투자 계산기", url: "/investment-calculator", category: "재무" },
  { name: "인플레이션 계산기", url: "/inflation-calculator", category: "재무" },
  { name: "소득세 계산기", url: "/income-tax-calculator", category: "재무" },
  { name: "복리 계산기", url: "/compound-interest-calculator", category: "재무" },
  { name: "급여 계산기", url: "/salary-calculator", category: "재무" },
  { name: "판매세 계산기", url: "/sales-tax-calculator", category: "재무" },
  { name: "해외직구 관세 계산기", url: "/customs-calculator", category: "재무" },
  
  // 건강 계산기
  { name: "BMI 계산기", url: "/bmi-calculator", category: "건강" },
  { name: "칼로리 계산기", url: "/calorie-calculator", category: "건강" },
  { name: "체지방 계산기", url: "/body-fat-calculator", category: "건강" },
  { name: "근육량 계산기", url: "/muscle-mass-calculator", category: "건강" },
  { name: "BMR 계산기", url: "/bmr-calculator", category: "건강" },
  { name: "이상체중 계산기", url: "/ideal-weight-calculator", category: "건강" },
  { name: "페이스 계산기", url: "/pace-calculator", category: "건강" },
  { name: "임신 계산기", url: "/pregnancy-calculator", category: "건강" },
  { name: "임신 수정 계산기", url: "/pregnancy-adjustment-calculator", category: "건강" },
  { name: "출산 예정일 계산기", url: "/due-date-calculator", category: "건강" },
  
  // 수학 계산기
  { name: "공학용 계산기", url: "/engineering-calculator", category: "수학" },
  { name: "분수 계산기", url: "/fraction-calculator", category: "수학" },
  { name: "백분율 계산기", url: "/percentage-calculator", category: "수학" },
  { name: "난수 생성기", url: "/random-number-generator", category: "수학" },
  { name: "삼각형 계산기", url: "/triangle-calculator", category: "수학" },
  { name: "표준편차 계산기", url: "/standard-deviation-calculator", category: "수학" },
  
  // 기타 계산기
  { name: "나이 계산기", url: "/age-calculator", category: "기타" },
  { name: "날짜 계산기", url: "/date-calculator", category: "기타" },
  { name: "시간 계산기", url: "/time-calculator", category: "기타" },
  { name: "GPA 계산기", url: "/gpa-calculator", category: "기타" },
  { name: "성적 계산기", url: "/grade-calculator", category: "기타" },
  
  // 사업자/프리랜서
  { name: "부가가치세 계산기", url: "/vat-calculator", category: "사업자" },
  { name: "사업소득세 계산기", url: "/income-tax-calculator", category: "사업자" },
  { name: "프리랜서 세금 계산기", url: "/salary-calculator", category: "사업자" },
  { name: "4대보험 계산기", url: "/social-insurance-calculator", category: "사업자" },
  { name: "퇴직금 계산기", url: "/severance-pay-calculator", category: "사업자" },
  { name: "프리랜서 원천징수세 계산기", url: "/freelancer-withholding-tax-calculator", category: "사업자" },
  { name: "상속세/증여세/재산세 계산기", url: "/inheritance-gift-property-tax-calculator", category: "사업자" },
  
  // 해외/국제/무역
  { name: "해외직구 관세 계산기", url: "/customs-calculator", category: "해외" },
  { name: "환율 계산기", url: "/exchange-rate-calculator", category: "해외" },
  { name: "국제송금 수수료 계산기", url: "/international-transfer-calculator", category: "해외" },
  
  // 건설/공사/인테리어
  { name: "콘크리트 계산기", url: "/concrete-calculator", category: "건설" },
  { name: "도배 계산기", url: "/wallpaper-calculator", category: "건설" },
  { name: "인테리어 견적 계산기", url: "/interior-estimate-calculator", category: "건설" },
  { name: "비계 견적서 계산기", url: "/scaffolding-estimate-calculator", category: "건설" },
  { name: "단위 변환기", url: "/unit-converter", category: "건설" },
  
  // 네트워크/IT/개발
  { name: "서브넷 계산기", url: "/subnet-calculator", category: "IT" },
  { name: "암호 생성기", url: "/password-generator", category: "IT" },
  { name: "데이터 변환 계산기", url: "/data-converter", category: "IT" },
  
  // 자동차/교통
  { name: "자동차세 계산기", url: "/automobile-tax-calculator", category: "자동차" },
  { name: "자동차 연비/유류비 계산기", url: "/automobile-fuel-calculator", category: "자동차" },
  { name: "자동차 취득세/등록세 계산기", url: "/acquisition-transfer-tax-calculator", category: "자동차" },
  { name: "자동차 대출 계산기", url: "/car-loan-calculator", category: "자동차" },
  
  // 가정법률/개인회생
  { name: "양육비 계산기", url: "/child-support-calculator", category: "법률" },
  { name: "위자료 계산기", url: "/alimony-calculator", category: "법률" },
  { name: "개인회생 변제금 계산기", url: "/personal-rehabilitation-calculator", category: "법률" },
  
  // 부동산/임대차
  { name: "전세/월세 전환 계산기", url: "/jeonse-monthly-converter", category: "부동산" },
  { name: "중도금 이자 계산기", url: "/interim-payment-interest-calculator", category: "부동산" },
  { name: "취득세/양도세 계산기", url: "/acquisition-transfer-tax-calculator", category: "부동산" },
  { name: "부동산 등기비용 계산기", url: "/real-estate-registration-cost-calculator", category: "부동산" },
  { name: "임대수익률 계산기", url: "/rental-yield-calculator", category: "부동산" },
  
  // 생활/요금
  { name: "전기요금 계산기", url: "/electricity-bill-calculator", category: "생활" },
  { name: "수도요금 계산기", url: "/water-bill-calculator", category: "생활" },
  { name: "가스요금 계산기", url: "/gas-bill-calculator", category: "생활" },
];

/**
 * 홈페이지 메인 컴포넌트
 * 계산기 검색, 카테고리 표시, 기본/과학 계산기를 제공
 */

export default function Home() {
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCalculators, setFilteredCalculators] = useState(calculators);

  // 검색어에 따른 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCalculators(calculators);
    } else {
      const filtered = calculators.filter(calc => 
        calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCalculators(filtered);
    }
  }, [searchQuery]);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl + 1 또는 Cmd + 1 (Mac)으로 일반계산기로 이동
      if ((event.ctrlKey || event.metaKey) && event.key === '1') {
        event.preventDefault();
        window.location.href = '/basic-calculator';
      }
      
      // Ctrl + 2 또는 Cmd + 2로 공학용 계산기로 이동
      if ((event.ctrlKey || event.metaKey) && event.key === '2') {
        event.preventDefault();
        window.location.href = '/engineering-calculator';
      }
      
      // Ctrl + 3 또는 Cmd + 3으로 과학용 계산기로 이동
      if ((event.ctrlKey || event.metaKey) && event.key === '3') {
        event.preventDefault();
        window.location.href = '/scientific-calculator';
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  /**
   * 검색 처리 함수
   * @param query - 검색어
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen">
      <Header onSearch={handleSearch} />
      
      <SearchSection searchQuery={searchQuery} onSearch={handleSearch} />

      {/* 검색 결과 표시 */}
      {searchQuery.trim() && (
        <div className="w-full px-8 py-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              검색 결과: &quot;{searchQuery}&quot; ({filteredCalculators.length}개)
            </h2>
            {filteredCalculators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalculators.map((calc, index) => (
                  <Link
                    key={index}
                    href={calc.url}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <i className="fas fa-calculator text-blue-500 mr-3"></i>
                      <div>
                        <h3 className="font-semibold text-gray-800">{calc.name}</h3>
                        <p className="text-sm text-gray-500">{calc.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">다른 검색어를 시도해보세요.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 키보드 단축키 안내 */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-calculator h-5 w-5 text-blue-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>키보드 단축키:</strong> 
              <span className="ml-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl + 1</kbd> 일반계산기
              </span>
              <span className="ml-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl + 2</kbd> 공학용계산기
              </span>
              <span className="ml-2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">Ctrl + 3</kbd> 과학용계산기
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 기존 카테고리 섹션들 (검색어가 없을 때만 표시) */}
      {!searchQuery.trim() && (
        <>
          <div className="w-full py-12 bg-white mt-8">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-money-bill-wave text-3xl text-gray-600"></i>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">재무 계산기</h2>
                  <div className="space-y-1">
                    <div><Link href="/mortgage-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>주택담보대출 계산기</Link></div>
                    <div><Link href="/loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>대출 계산기</Link></div>
                    <div><Link href="/car-loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 대출 계산기</Link></div>
                    <div><Link href="/interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>이자 계산기</Link></div>
                    <div><Link href="/repayment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>상환 계산기</Link></div>
                    <div><Link href="/retirement-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>은퇴 계산기</Link></div>
                    <div><Link href="/depreciation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>감가상각 계산기</Link></div>
                    <div><Link href="/investment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>투자 계산기</Link></div>
                    <div><Link href="/inflation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>인플레이션 계산기</Link></div>
                    <div><Link href="/income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>소득세 계산기</Link></div>
                    <div><Link href="/compound-interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>복리 계산기</Link></div>
                    <div><Link href="/salary-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>급여 계산기</Link></div>
                    <div><Link href="/sales-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>판매세 계산기</Link></div>
                    <div><Link href="/customs-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>해외직구 관세 계산기</Link></div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="fas fa-heart text-3xl text-gray-600"></i>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4">피트니스 및 건강 계산기</h2>
                  <div className="space-y-1">
                    <div><Link href="/bmi-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>BMI 계산기</Link></div>
                    <div><Link href="/calorie-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>칼로리 계산기</Link></div>
                    <div><Link href="/body-fat-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>체지방 계산기</Link></div>
                    <div><Link href="/muscle-mass-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>근육량 계산기</Link></div>
                    <div><Link href="/bmr-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>BMR 계산기</Link></div>
                    <div><Link href="/ideal-weight-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>이상체중 계산기</Link></div>
                    <div><Link href="/pace-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>페이스 계산기</Link></div>
                    <div><Link href="/pregnancy-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임신 계산기</Link></div>
                    <div><Link href="/pregnancy-adjustment-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임신 수정 계산기</Link></div>
                    <div><Link href="/due-date-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>출산 예정일 계산기</Link></div>
                  </div>
                </div>

                                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="fas fa-calculator text-3xl text-gray-600"></i>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">수학 계산기</h2>
                  <div className="space-y-1">
                    <div><Link href="/engineering-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>공학용 계산기</Link></div>
                    <div><Link href="/fraction-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>분수 계산기</Link></div>
                    <div><Link href="/percentage-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>백분율 계산기</Link></div>
                    <div><Link href="/random-number-generator" className="hover:underline text-sm" style={{color: '#276699'}}>난수 생성기</Link></div>
                    <div><Link href="/triangle-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>삼각형 계산기</Link></div>
                    <div><Link href="/standard-deviation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>표준편차 계산기</Link></div>
                  </div>
                </div>

                                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <i className="fas fa-tools text-3xl text-gray-600"></i>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">기타 계산기</h2>
                  <div className="space-y-1">
                    <div><Link href="/age-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>나이 계산기</Link></div>
                    <div><Link href="/date-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>날짜 계산기</Link></div>
                    <div><Link href="/time-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>시간 계산기</Link></div>
                    <div><Link href="/gpa-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>GPA 계산기</Link></div>
                    <div><Link href="/grade-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>성적 계산기</Link></div>
                  </div>
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
                                     <i className="fas fa-file-invoice-dollar text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">사업자/프리랜서</h2>
                <div className="space-y-1">
                  <div><Link href="/vat-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>부가가치세 계산기</Link></div>
                  <div><Link href="/income-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>사업소득세 계산기</Link></div>
                  <div><Link href="/salary-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>프리랜서 세금 계산기</Link></div>
                  <div><Link href="/social-insurance-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>4대보험 계산기</Link></div>
                  <div><Link href="/severance-pay-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>퇴직금 계산기</Link></div>
                  <div><Link href="/freelancer-withholding-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>프리랜서 원천징수세 계산기</Link></div>
                  <div><Link href="/inheritance-gift-property-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>상속세/증여세/재산세 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-globe text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">해외/국제/무역</h2>
                <div className="space-y-1">
                  <div><Link href="/customs-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>해외직구 관세 계산기</Link></div>
                  <div><Link href="/exchange-rate-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>환율 계산기</Link></div>
                  <div><Link href="/international-transfer-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>국제송금 수수료 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-tools text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">건설/공사/인테리어</h2>
                <div className="space-y-1">
                  <div><Link href="/concrete-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>콘크리트 계산기</Link></div>
                  <div><Link href="/wallpaper-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>도배 계산기</Link></div>
                  <div><Link href="#" className="hover:underline text-sm" style={{color: '#276699'}}>타일 계산기</Link></div>
                  <div><Link href="/interior-estimate-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>인테리어 견적 계산기</Link></div>
                  <div><Link href="/scaffolding-estimate-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>비계 견적서 계산기</Link></div>
                  <div><Link href="/unit-converter" className="hover:underline text-sm" style={{color: '#276699'}}>단위 변환기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-search text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">네트워크/IT/개발</h2>
                <div className="space-y-1">
                  <div><Link href="/subnet-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>서브넷 계산기</Link></div>
                  <div><Link href="/password-generator" className="hover:underline text-sm" style={{color: '#276699'}}>암호 생성기</Link></div>
                  <div><Link href="/unit-converter" className="hover:underline text-sm" style={{color: '#276699'}}>단위 변환기</Link></div>
                  <div><Link href="/data-converter" className="hover:underline text-sm" style={{color: '#276699'}}>데이터 변환 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-calculator text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">자동차/교통</h2>
                <div className="space-y-1">
                  <div><Link href="/automobile-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차세 계산기</Link></div>
                  <div><Link href="/automobile-fuel-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 연비/유류비 계산기</Link></div>
                  <div><Link href="/acquisition-transfer-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 취득세/등록세 계산기</Link></div>
                  <div><Link href="/car-loan-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>자동차 대출 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-gavel text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">가정법률/개인회생</h2>
                <div className="space-y-1">
                  <div><Link href="/child-support-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>양육비 계산기</Link></div>
                  <div><Link href="/alimony-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>위자료 계산기</Link></div>
                  <div><Link href="/personal-rehabilitation-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>개인회생 변제금 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-home text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">부동산/임대차</h2>
                <div className="space-y-1">
                  <div><Link href="/jeonse-monthly-converter" className="hover:underline text-sm" style={{color: '#276699'}}>전세/월세 전환 계산기</Link></div>
                  <div><Link href="/interim-payment-interest-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>중도금 이자 계산기</Link></div>
                  <div><Link href="/acquisition-transfer-tax-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>취득세/양도세 계산기</Link></div>
                  <div><Link href="/real-estate-registration-cost-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>부동산 등기비용 계산기</Link></div>
                  <div><Link href="/rental-yield-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>임대수익률 계산기</Link></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                     <i className="fas fa-lightbulb text-3xl text-gray-600"></i>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">생활/요금</h2>
                <div className="space-y-1">
                  <div><Link href="/electricity-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>전기요금 계산기</Link></div>
                  <div><Link href="/water-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>수도요금 계산기</Link></div>
                  <div><Link href="/gas-bill-calculator" className="hover:underline text-sm" style={{color: '#276699'}}>가스요금 계산기</Link></div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </>
      )}
      
      <Footer />
    </div>
  );
}
