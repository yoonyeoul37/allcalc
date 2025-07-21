'use client';

import { useState } from 'react';
import { FaCalculator, FaChartLine, FaMoneyBillWave, FaPercentage, FaCalendarAlt, FaHome } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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

  const resetCalculator = () => {
    setPrincipal('');
    setPrincipalDisplay('');
    setMonthlyContribution('');
    setMonthlyContributionDisplay('');
    setAnnualRate('');
    setYears('');
    setCompoundingFrequency('monthly');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaChartLine className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">복리계산기</h1>
            </div>
            <p className="text-lg text-gray-600">복리 효과를 활용한 투자 수익을 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">투자 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  초기 투자금 (원)
                </label>
                <input
                  type="text"
                  value={principalDisplay}
                  onChange={handlePrincipalChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  월 투자금 (원)
                </label>
                <input
                  type="text"
                  value={monthlyContributionDisplay}
                  onChange={handleMonthlyContributionChange}
                  placeholder="100,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercentage className="inline mr-2 text-black" />
                  연 수익률 (%)
                </label>
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="7.0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  투자 기간 (년)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2 text-black" />
                  복리 빈도
                </label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="annually">연복리</option>
                  <option value="semiannually">반기복리</option>
                  <option value="quarterly">분기복리</option>
                  <option value="monthly">월복리</option>
                  <option value="daily">일복리</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateCompoundInterest}
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
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">복리 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">최종 금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.finalAmount.toLocaleString()}원
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 이자 수익</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalInterest.toLocaleString()}원
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalculator className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 투자금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalContribution.toLocaleString()}원
                  </div>
                </div>
              </div>

              {/* 연도별 상세 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">연도별 상세 내역</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연도</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">투자금액</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">이자 수익</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">누적 잔액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((item, index) => (
                        <tr key={item.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.year}년</td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.contribution.toLocaleString()}원
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.interest.toLocaleString()}원
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.balance.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 복리 계산 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">복리 계산 공식</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>복리 효과:</strong> 이자에 대한 이자가 추가로 발생하는 효과</p>
              <p>• <strong>최종 금액:</strong> 초기금액 × (1 + 이율)^기간 + 월투자금 × 복리계산</p>
              <p>• <strong>복리 빈도:</strong> 이자가 계산되는 주기 (월복리, 분기복리 등)</p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 투자 수익률은 변동될 수 있습니다.</p>
              <p>• <strong>복리 효과:</strong> 투자 기간이 길수록 복리 효과가 커집니다.</p>
              <p>• <strong>위험 요소:</strong> 투자에는 원금 손실의 위험이 따를 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
