"use client";

import { useState } from "react";
import { FaUmbrellaBeach, FaCalculator, FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaPercent, FaPiggyBank } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaUmbrellaBeach className="text-4xl text-black mr-3" />
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
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  현재 나이
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  은퇴 나이
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  현재 월 생활비 (원)
                </label>
                <input
                  type="text"
                  value={currentMonthlyExpenseDisplay}
                  onChange={handleCurrentMonthlyExpenseChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 2,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  은퇴 후 생활비 비율 (%)
                </label>
                <input
                  type="number"
                  value={retirementExpenseRatio}
                  onChange={(e) => setRetirementExpenseRatio(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPiggyBank className="inline mr-2 text-black" />
                  현재 저축액 (원)
                </label>
                <input
                  type="text"
                  value={currentSavingsDisplay}
                  onChange={handleCurrentSavingsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 10,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-black" />
                  연 투자수익률 (%)
                </label>
                <input
                  type="number"
                  value={investmentReturn}
                  onChange={(e) => setInvestmentReturn(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  연 인플레이션율 (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 2"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateRetirement}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
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

          {/* 계산 결과 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">월 저축액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.monthlySavings)}원
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">필요 은퇴자금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.totalRetirementFund)}원
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPiggyBank className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">현재 저축액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.currentSavings)}원
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">연 투자수익률</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatPercentage(result.investmentReturn)}%
                  </div>
                </div>
              </div>

              {/* 연도별 저축 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">연도별 저축 내역 (최대 10년)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연도</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">나이</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연간 저축액</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">투자수익</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">누적 자금</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((item) => (
                        <tr key={item.year} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.year}년</td>
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

          {/* 은퇴 계산 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">은퇴 계산 공식</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>은퇴 후 필요 자금:</strong> 은퇴 후 예상 생활비 × 12개월 × 30년 + 인플레이션 반영</p>
              <p>• <strong>월 저축액:</strong> 목표 자금에서 현재 저축액과 투자수익을 고려해 산출</p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 투자수익률, 인플레이션 등은 변동될 수 있습니다.</p>
              <p>• <strong>은퇴 후 기간:</strong> 30년 기준으로 계산됩니다.</p>
              <p>• <strong>세금:</strong> 투자수익에 대한 세금이 발생할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 