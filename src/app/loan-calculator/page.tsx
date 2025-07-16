"use client";

import { useState } from "react";
import { FaCalculator, FaMoneyBillWave, FaHome, FaChartLine } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanAmountDisplay, setLoanAmountDisplay] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [loanType, setLoanType] = useState<string>("mortgage");
  const [repaymentType, setRepaymentType] = useState<string>("equal_payment");
  const [graceMonth, setGraceMonth] = useState<string>("0");
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const totalMonths = parseFloat(loanTerm) * 12;
    const graceMonths = parseInt(graceMonth);

    if (principal > 0 && monthlyRate > 0 && totalMonths > 0) {
      let monthlyPayment = 0;
      let totalInterest = 0;
      let totalPayment = 0;

      if (repaymentType === "equal_payment") {
        // 원리금균등상환
        const paymentMonths = totalMonths - graceMonths;
        
        if (graceMonths > 0) {
          // 거치기간 동안의 이자
          const graceInterest = principal * monthlyRate * graceMonths;
          
          // 거치기간 후 상환
          monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, paymentMonths)) / 
                          (Math.pow(1 + monthlyRate, paymentMonths) - 1);
          
          totalPayment = (monthlyPayment * paymentMonths) + graceInterest;
          totalInterest = totalPayment - principal;
        } else {
          monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);
          totalPayment = monthlyPayment * totalMonths;
          totalInterest = totalPayment - principal;
        }
        
      } else if (repaymentType === "equal_principal") {
        // 원금균등상환
        const paymentMonths = totalMonths - graceMonths;
        const principalPayment = principal / paymentMonths;
        
        // 첫 달 상환금 (원금 + 이자)
        monthlyPayment = principalPayment + (principal * monthlyRate);
        
        // 총 이자 계산
        totalInterest = (principal * monthlyRate * (paymentMonths + 1)) / 2;
        
        if (graceMonths > 0) {
          totalInterest += principal * monthlyRate * graceMonths;
        }
        
        totalPayment = principal + totalInterest;
        
      } else if (repaymentType === "maturity") {
        // 만기일시상환
        monthlyPayment = principal * monthlyRate; // 매월 이자만
        totalInterest = monthlyPayment * totalMonths;
        totalPayment = principal + totalInterest;
      }

      setResult({
        monthlyPayment,
        totalInterest,
        totalPayment
      });
    }
  };

  const clear = () => {
    setLoanAmount("");
    setLoanAmountDisplay("");
    setInterestRate("");
    setLoanTerm("");
    setLoanType("mortgage");
    setRepaymentType("equal_payment");
    setGraceMonth("0");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatNumber = (value: string) => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (!numericValue) return '';
    
    // 콤마 추가
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setLoanAmount(numericValue);
    setLoanAmountDisplay(formatNumber(value));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">대출 계산기</h1>
            <p className="text-lg text-gray-600">월 상환금액과 총 이자를 계산하여 대출 계획을 세워보세요</p>
          </div>

          {/* 대출 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대출종류</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="mortgage">주택담보대출</option>
                  <option value="credit">신용대출</option>
                  <option value="auto">자동차대출</option>
                  <option value="jeonse">전세대출</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상환방식</label>
                <select
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="equal_payment">원리금균등상환</option>
                  <option value="equal_principal">원금균등상환</option>
                  <option value="maturity">만기일시상환</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">거치기간 (개월)</label>
                <select
                  value={graceMonth}
                  onChange={(e) => setGraceMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="0">없음</option>
                  <option value="6">6개월</option>
                  <option value="12">12개월</option>
                  <option value="24">24개월</option>
                  <option value="36">36개월</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대출금액 (원)</label>
                <input
                  type="text"
                  value={loanAmountDisplay}
                  onChange={handleLoanAmountChange}
                  placeholder="예: 300,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연이율 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="예: 3.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대출기간 (년)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="예: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateLoan}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                대출 계산하기
              </button>
              <button
                onClick={clear}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">대출 계산 결과</h3>
                
                {/* 선택된 옵션 표시 */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      {loanType === "mortgage" && "주택담보대출"}
                      {loanType === "credit" && "신용대출"}
                      {loanType === "auto" && "자동차대출"}
                      {loanType === "jeonse" && "전세대출"}
                    </span>
                    {" · "}
                    <span className="font-semibold">
                      {repaymentType === "equal_payment" && "원리금균등상환"}
                      {repaymentType === "equal_principal" && "원금균등상환"}
                      {repaymentType === "maturity" && "만기일시상환"}
                    </span>
                    {graceMonth !== "0" && (
                      <>
                        {" · "}
                        <span className="font-semibold text-orange-600">거치기간 {graceMonth}개월</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">
                      {repaymentType === "equal_principal" ? "첫 달 상환금액" : 
                       repaymentType === "maturity" ? "월 이자" : "월 상환금액"}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.monthlyPayment)}
                    </div>
                    {repaymentType === "equal_principal" && (
                      <div className="text-xs text-gray-500 mt-1">
                        (매월 감소)
                      </div>
                    )}
                    {repaymentType === "maturity" && (
                      <div className="text-xs text-gray-500 mt-1">
                        (원금은 만기에 일시상환)
                      </div>
                    )}
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 이자</div>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(result.totalInterest)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 상환금액</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.totalPayment)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🏦 저금리 대출 상담</h3>
                    <p className="text-sm mb-3">은행별 최저 금리 비교 및 무료 상담 서비스</p>
                    <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      무료 상담 신청 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🏠 주택담보대출 특별금리</h3>
                  <p className="text-gray-600 mb-3">신규 고객 한정 연 2.5% 특별금리 + 중도상환수수료 면제</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">연 2.5%</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">수수료 면제</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                    상담 신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 max-w-4xl">
              
              {/* 대출 계산기란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">대출 계산기란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    대출 계산기는 대출 원금, 이자율, 상환 기간을 입력하여 월 상환금액과 총 이자를 미리 계산해볼 수 있는 도구입니다. 
                    주택담보대출, 신용대출, 자동차대출 등 다양한 대출 상품의 상환 계획을 세우는 데 도움이 됩니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    대출을 받기 전에 미리 상환 능력을 검토하고, 여러 은행의 조건을 비교해보실 수 있습니다. 
                    정확한 계산을 통해 합리적인 대출 계획을 세우세요.
                  </p>
                </div>
              </section>

              {/* 대출 계산 공식 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">대출 상환금 계산 공식</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-800 mb-4">
                      월 상환금 = P × [r(1+r)ⁿ] / [(1+r)ⁿ-1]
                    </div>
                    <div className="text-gray-700 text-left">
                      <p className="mb-2"><strong>여기서:</strong></p>
                      <ul className="space-y-1">
                        <li>• P = 대출 원금</li>
                        <li>• r = 월 이자율 (연이율 ÷ 12)</li>
                        <li>• n = 총 상환 개월 수</li>
                      </ul>
                      <p className="mt-4"><strong>예시:</strong> 3억원, 연 3.5%, 30년 대출의 경우</p>
                      <p>월 상환금 = 1,347,041원</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 광고 3: 정보 섹션 중간 */}
              <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-4">Google AdSense</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏦</div>
                        <h4 className="font-semibold text-gray-800 mb-1">대출 비교 서비스</h4>
                        <p className="text-sm text-gray-600 mb-2">100여개 은행 금리 실시간 비교</p>
                        <div className="text-blue-600 text-sm font-semibold">무료 이용</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-semibold text-gray-800 mb-1">대출 관리 앱</h4>
                        <p className="text-sm text-gray-600 mb-2">상환 일정 알림 및 관리</p>
                        <div className="text-green-600 text-sm font-semibold">다운로드</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 대출 종류별 특징 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">대출 종류별 특징</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">주택담보대출</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 상대적으로 낮은 금리 (연 2.5~4.5%)</li>
                      <li>• 높은 대출 한도 (LTV 최대 70%)</li>
                      <li>• 긴 상환 기간 (최대 30~40년)</li>
                      <li>• 중도상환수수료 적용</li>
                      <li>• 담보 설정 필요</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">신용대출</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 담보 없이 신용도로 심사</li>
                      <li>• 상대적으로 높은 금리 (연 4~15%)</li>
                      <li>• 낮은 대출 한도 (최대 1억원)</li>
                      <li>• 짧은 상환 기간 (최대 10년)</li>
                      <li>• 빠른 승인 가능</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">자동차대출</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 자동차 담보로 낮은 금리</li>
                      <li>• 차량 가격의 80~90% 한도</li>
                      <li>• 5~7년 상환 기간</li>
                      <li>• 차량 소유권 이전</li>
                      <li>• 할부금융과 유사</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">전세대출</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 전세보증금 마련용</li>
                      <li>• 주택가격의 80% 이내</li>
                      <li>• 2년 단위 갱신</li>
                      <li>• 상대적으로 낮은 금리</li>
                      <li>• 임대차계약서 필요</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 상환 방식별 특징 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">상환 방식별 특징</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">원리금균등상환</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 매월 동일한 금액 상환</li>
                      <li>• 초기에는 이자 비중 높음</li>
                      <li>• 상환 계획 세우기 쉬움</li>
                      <li>• 가장 일반적인 방식</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-600 mb-3">원금균등상환</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 매월 원금은 동일, 이자는 감소</li>
                      <li>• 초기 상환 부담 큼</li>
                      <li>• 총 이자 부담 적음</li>
                      <li>• 소득이 안정적일 때 유리</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-600 mb-3">만기일시상환</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 매월 이자만 납부</li>
                      <li>• 만기에 원금 일시 상환</li>
                      <li>• 월 부담은 적지만 총 이자 많음</li>
                      <li>• 임대업자나 투자용에 적합</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 대출 시 주의사항 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">대출 시 주의사항</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>상환 능력 검토:</strong> 월 소득의 30% 이내에서 상환금을 설정하세요.</li>
                    <li>• <strong>금리 유형 확인:</strong> 고정금리와 변동금리의 차이를 이해하세요.</li>
                    <li>• <strong>부대 비용 고려:</strong> 중도상환수수료, 보증료 등을 포함해서 계산하세요.</li>
                    <li>• <strong>DSR 규제:</strong> 총부채원리금상환비율(DSR) 규제를 확인하세요.</li>
                    <li>• <strong>여러 은행 비교:</strong> 금리와 조건을 충분히 비교 검토하세요.</li>
                  </ul>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaHome className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">주택담보대출 계산기</h3>
                    <p className="text-sm text-gray-600">LTV, DTI 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">복리 계산기</h3>
                    <p className="text-sm text-gray-600">투자 수익률 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaCalculator className="text-2xl text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">이자 계산기</h3>
                    <p className="text-sm text-gray-600">단리/복리 이자 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaMoneyBillWave className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">상환 계산기</h3>
                    <p className="text-sm text-gray-600">원리금균등/원금균등</p>
                  </div>
                </div>
              </section>
            </div>
            
            {/* 사이드바 광고 (데스크톱 전용) */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-8 space-y-6">
                {/* 광고 4: 사이드바 배너 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-3">추천 광고</div>
                    <div className="bg-gradient-to-b from-blue-400 to-green-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🏛️ 금융상품</h4>
                      <p className="text-sm mb-3">예적금, 대출, 보험 비교</p>
                      <button className="bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        비교하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 광고 5: 네이티브 광고 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-4">스폰서</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        🏦
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">대출 상담 앱</h5>
                        <p className="text-xs text-gray-600">AI 맞춤 대출 추천</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        💳
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">신용점수 관리</h5>
                        <p className="text-xs text-gray-600">무료 신용점수 조회</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        📊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">가계부 앱</h5>
                        <p className="text-xs text-gray-600">자동 가계부 작성</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-6 text-sm text-gray-700 leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            이 대출 계산기는 일반적인 원리금균등상환 방식을 기준으로 계산됩니다. 
            실제 대출 조건은 은행별로 다를 수 있으므로, 정확한 상담을 위해서는 해당 금융기관에 문의하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 