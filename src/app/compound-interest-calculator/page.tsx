'use client';

import { useState } from 'react';
import { FaCalculator, FaChartLine, FaMoneyBillWave, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface CompoundResult {
  finalAmount: number;
  totalInterest: number;
  totalContribution: number;
  yearlyBreakdown: Array<{
    year: number;
    contribution: number;
    interest: number;
    balance: number;
  }>;
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [principalDisplay, setPrincipalDisplay] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [monthlyContributionDisplay, setMonthlyContributionDisplay] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');
  const [result, setResult] = useState<CompoundResult | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrincipal(value);
      setPrincipalDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMonthlyContribution(value);
      setMonthlyContributionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateCompoundInterest = () => {
    const initialPrincipal = parseFloat(principal.replace(/,/g, ''));
    const monthlyContributionAmount = parseFloat(monthlyContribution.replace(/,/g, ''));
    const annualInterestRate = parseFloat(annualRate);
    const investmentYears = parseInt(years);

    if (isNaN(initialPrincipal) || isNaN(annualInterestRate) || isNaN(investmentYears)) return;

    // 복리 빈도에 따른 연간 복리 횟수
    const compoundingPerYear = {
      'annually': 1,
      'semiannually': 2,
      'quarterly': 4,
      'monthly': 12,
      'daily': 365
    }[compoundingFrequency] || 12;

    const periodicRate = annualInterestRate / 100 / compoundingPerYear;
    const totalPeriods = investmentYears * compoundingPerYear;
    const periodicContribution = monthlyContributionAmount * 12 / compoundingPerYear;

    let balance = initialPrincipal;
    const yearlyBreakdown = [];

    for (let year = 1; year <= investmentYears; year++) {
      const yearStartBalance = balance;
      let yearContribution = 0;
      let yearInterest = 0;

      // 해당 연도의 복리 계산
      for (let period = 0; period < compoundingPerYear; period++) {
        const periodContribution = periodicContribution;
        yearContribution += periodContribution;
        
        balance = balance * (1 + periodicRate) + periodContribution;
      }

      yearInterest = balance - yearStartBalance - yearContribution;
      
      yearlyBreakdown.push({
        year,
        contribution: yearContribution,
        interest: yearInterest,
        balance
      });
    }

    const totalContribution = initialPrincipal + (monthlyContributionAmount * 12 * investmentYears);
    const totalInterest = balance - totalContribution;

    setResult({
      finalAmount: balance,
      totalInterest,
      totalContribution,
      yearlyBreakdown
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">복리계산기</h1>
            <p className="text-lg text-gray-600">복리 효과를 활용한 투자 수익을 계산해보세요</p>
          </div>

          {/* 복리계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">초기 투자금 (원)</label>
                <input
                  type="text"
                  value={principalDisplay}
                  onChange={handlePrincipalChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">월 투자금 (원)</label>
                <input
                  type="text"
                  value={monthlyContributionDisplay}
                  onChange={handleMonthlyContributionChange}
                  placeholder="100,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연 수익률 (%)</label>
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="7.0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">투자 기간 (년)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">복리 빈도</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="annually">연복리</option>
                  <option value="semiannually">반기복리</option>
                  <option value="quarterly">분기복리</option>
                  <option value="monthly">월복리</option>
                  <option value="daily">일복리</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateCompoundInterest}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                계산하기
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">복리 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">최종 금액</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.finalAmount.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {years}년 후 총 자산
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 투자금</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.totalContribution.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      원금 + 월 투자금 합계
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 수익</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.totalInterest.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      복리 효과로 얻은 수익
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 연도별 상세 내역 */}
          {result && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="mr-2 text-green-600" />
                연도별 상세 내역
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">연도</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">투자금</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">수익</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">총 자산</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyBreakdown.map((item, index) => (
                      <tr key={item.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-700">{item.year}년</td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          {item.contribution.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-600">
                          {item.interest.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {item.balance.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 설명 섹션 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPercentage className="mr-2 text-purple-600" />
              복리계산기 설명
            </h3>
            <div className="prose text-gray-600 space-y-3">
              <p>
                <strong>복리 효과:</strong> 이전 기간의 수익이 다음 기간의 원금에 포함되어 수익이 기하급수적으로 증가하는 현상입니다.
              </p>
              <p>
                <strong>복리 빈도:</strong> 연복리, 반기복리, 분기복리, 월복리, 일복리 등 수익이 원금에 합산되는 주기입니다.
              </p>
              <p>
                <strong>월 투자금:</strong> 매월 정기적으로 투자하는 금액으로, 복리 효과로 인해 장기적으로 큰 차이를 만듭니다.
              </p>
              <p>
                <strong>총 수익:</strong> 원금과 월 투자금을 제외한 순수한 수익으로, 복리 효과의 힘을 보여줍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 