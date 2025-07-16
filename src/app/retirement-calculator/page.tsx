"use client";

import { useState } from "react";
import { FaUmbrellaBeach, FaCalculator, FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaPercent, FaPiggyBank } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface RetirementResult {
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  monthlyExpense: number;
  retirementMonthlyExpense: number;
  totalRetirementFund: number;
  monthlySavings: number;
  currentSavings: number;
  investmentReturn: number;
  inflationRate: number;
  yearlyBreakdown: Array<{
    year: number;
    age: number;
    savings: number;
    investmentGrowth: number;
    totalFund: number;
  }>;
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentMonthlyExpense, setCurrentMonthlyExpense] = useState("");
  const [retirementExpenseRatio, setRetirementExpenseRatio] = useState("70");
  const [currentSavings, setCurrentSavings] = useState("");
  const [investmentReturn, setInvestmentReturn] = useState("5");
  const [inflationRate, setInflationRate] = useState("2");
  const [result, setResult] = useState<RetirementResult | null>(null);
  
  // 입력 필드용 상태 (콤마 표시용)
  const [currentMonthlyExpenseDisplay, setCurrentMonthlyExpenseDisplay] = useState("");
  const [currentSavingsDisplay, setCurrentSavingsDisplay] = useState("");

  const calculateRetirement = () => {
    if (!currentAge || !retirementAge || !currentMonthlyExpense || !currentSavings) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const current = parseInt(currentAge);
    const retirement = parseInt(retirementAge);
    const monthlyExpense = parseFloat(currentMonthlyExpense);
    const expenseRatio = parseFloat(retirementExpenseRatio) / 100;
    const savings = parseFloat(currentSavings);
    const investment = parseFloat(investmentReturn);
    const inflation = parseFloat(inflationRate);

    if (isNaN(current) || isNaN(retirement) || isNaN(monthlyExpense) || 
        isNaN(expenseRatio) || isNaN(savings) || isNaN(investment) || isNaN(inflation)) {
      alert("올바른 숫자를 입력해주세요.");
      return;
    }

    if (current >= retirement) {
      alert("은퇴 나이는 현재 나이보다 커야 합니다.");
      return;
    }

    const yearsToRetirement = retirement - current;
    const retirementMonthlyExpense = monthlyExpense * expenseRatio;
    
    // 은퇴 후 30년간 생활한다고 가정
    const retirementYears = 30;
    
    // 인플레이션을 고려한 은퇴 시점의 월 생활비
    const inflatedMonthlyExpense = retirementMonthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    
    // 은퇴 후 총 필요 자금 (인플레이션 고려)
    let totalRetirementFund = 0;
    for (let year = 0; year < retirementYears; year++) {
      const yearlyExpense = inflatedMonthlyExpense * 12 * Math.pow(1 + inflation / 100, year);
      totalRetirementFund += yearlyExpense;
    }

    // 현재 저축액의 미래 가치
    const futureCurrentSavings = savings * Math.pow(1 + investment / 100, yearsToRetirement);
    
    // 추가로 필요한 자금
    const additionalFundsNeeded = totalRetirementFund - futureCurrentSavings;
    
    // 월 저축액 계산 (복리 효과 고려)
    const monthlySavings = additionalFundsNeeded > 0 ? 
      (additionalFundsNeeded * (investment / 100 / 12)) / 
      (Math.pow(1 + investment / 100 / 12, yearsToRetirement * 12) - 1) : 0;

    // 연도별 저축 내역
    const yearlyBreakdown = [];
    let currentFund = savings;
    
    for (let year = 1; year <= Math.min(yearsToRetirement, 10); year++) {
      const yearlySavings = monthlySavings * 12;
      const investmentGrowth = currentFund * (investment / 100);
      currentFund += yearlySavings + investmentGrowth;
      
      yearlyBreakdown.push({
        year,
        age: current + year,
        savings: yearlySavings,
        investmentGrowth,
        totalFund: currentFund
      });
    }

    setResult({
      currentAge: current,
      retirementAge: retirement,
      yearsToRetirement,
      monthlyExpense,
      retirementMonthlyExpense,
      totalRetirementFund,
      monthlySavings,
      currentSavings: savings,
      investmentReturn: investment,
      inflationRate: inflation,
      yearlyBreakdown
    });
  };

  const resetCalculator = () => {
    setCurrentAge("");
    setRetirementAge("");
    setCurrentMonthlyExpense("");
    setCurrentMonthlyExpenseDisplay("");
    setRetirementExpenseRatio("70");
    setCurrentSavings("");
    setCurrentSavingsDisplay("");
    setInvestmentReturn("5");
    setInflationRate("2");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(amount));
  };

  const formatPercentage = (rate: number) => {
    return rate.toFixed(1);
  };

  // 입력 필드 핸들러 함수
  const formatInputNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleCurrentMonthlyExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setCurrentMonthlyExpense(numericValue);
    setCurrentMonthlyExpenseDisplay(formatInputNumber(value));
  };

  const handleCurrentSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setCurrentSavings(numericValue);
    setCurrentSavingsDisplay(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaUmbrellaBeach className="text-4xl text-orange-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">은퇴 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">은퇴 후 필요 자금과 월 저축액 계산</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">은퇴 계획 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-blue-500" />
                  현재 나이
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-green-500" />
                  은퇴 희망 나이
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-purple-500" />
                  현재 월 생활비 (원)
                </label>
                <input
                  type="text"
                  value={currentMonthlyExpenseDisplay}
                  onChange={handleCurrentMonthlyExpenseChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 3,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-orange-500" />
                  은퇴 후 생활비 비율 (%)
                </label>
                <select
                  value={retirementExpenseRatio}
                  onChange={(e) => setRetirementExpenseRatio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="50">50% (절약형)</option>
                  <option value="60">60% (보수형)</option>
                  <option value="70">70% (일반형)</option>
                  <option value="80">80% (여유형)</option>
                  <option value="90">90% (고급형)</option>
                  <option value="100">100% (현재 수준)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPiggyBank className="inline mr-2 text-yellow-500" />
                  현재 저축액 (원)
                </label>
                <input
                  type="text"
                  value={currentSavingsDisplay}
                  onChange={handleCurrentSavingsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="예: 50,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-green-500" />
                  연 투자 수익률 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 5.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-red-500" />
                  연 인플레이션율 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="예: 2.0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateRetirement}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">은퇴 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-blue-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">은퇴까지</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.yearsToRetirement}년
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-green-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">필요 자금</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.totalRetirementFund)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <FaPiggyBank className="text-2xl text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">월 저축액</h4>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(result.monthlySavings)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-purple-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">은퇴 후 생활비</h4>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.retirementMonthlyExpense)}원
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">현재 상황</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">현재 나이:</span>
                      <span className="font-semibold">{result.currentAge}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">현재 저축액:</span>
                      <span className="font-semibold">{formatCurrency(result.currentSavings)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">현재 월 생활비:</span>
                      <span className="font-semibold">{formatCurrency(result.monthlyExpense)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">투자 수익률:</span>
                      <span className="font-semibold">{formatPercentage(result.investmentReturn)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">은퇴 목표</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">은퇴 나이:</span>
                      <span className="font-semibold">{result.retirementAge}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">필요 총 자금:</span>
                      <span className="font-semibold">{formatCurrency(result.totalRetirementFund)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">은퇴 후 월 생활비:</span>
                      <span className="font-semibold">{formatCurrency(result.retirementMonthlyExpense)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">인플레이션율:</span>
                      <span className="font-semibold">{formatPercentage(result.inflationRate)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 연도별 저축 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">연도별 저축 내역 (10년)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연도</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">나이</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연 저축액</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">투자 수익</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">총 자산</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((item) => (
                        <tr key={item.year} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.year}년차</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.age}세</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.savings)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.investmentGrowth)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.totalFund)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 은퇴 준비 가이드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">은퇴 준비 가이드</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">은퇴 자금의 구성</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>국민연금:</strong> 기본적인 노후 보장</li>
                  <li>• <strong>개인연금:</strong> 추가 노후 준비</li>
                  <li>• <strong>적립금:</strong> 은퇴 전 저축</li>
                  <li>• <strong>투자 수익:</strong> 자산 증식</li>
                  <li>• <strong>부동산:</strong> 임대 수익</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">은퇴 준비 전략</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>조기 시작:</strong> 복리 효과 활용</li>
                  <li>• <strong>다양화:</strong> 리스크 분산</li>
                  <li>• <strong>정기 검토:</strong> 목표 조정</li>
                  <li>• <strong>세금 혜택:</strong> 연금 상품 활용</li>
                  <li>• <strong>보험 가입:</strong> 의료비 대비</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 은퇴 계획은 전문가와 상담하세요.</p>
              <p>• <strong>인플레이션:</strong> 물가상승으로 인한 실질 구매력 감소를 고려했습니다.</p>
              <p>• <strong>투자 수익률:</strong> 과거 수익률이 미래를 보장하지 않습니다.</p>
              <p>• <strong>의료비:</strong> 노후 의료비는 별도로 준비해야 합니다.</p>
              <p>• <strong>국민연금:</strong> 국민연금 수령액은 별도로 계산해야 합니다.</p>
              <p>• <strong>정기 검토:</strong> 매년 은퇴 계획을 점검하고 조정하세요.</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPercent className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이자 계산기</h4>
                <p className="text-xs text-gray-600">복리 효과</p>
              </a>
              
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">부채 관리</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
              
              <a href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">통화 변환</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 