'use client';

import { useState } from 'react';
import { FaCalculator, FaChartLine, FaMoneyBillWave, FaPercentage, FaCalendarAlt, FaHome } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function InflationCalculator() {
  const [initialAmount, setInitialAmount] = useState('');
  const [initialAmountDisplay, setInitialAmountDisplay] = useState('');
  const [inflationRate, setInflationRate] = useState('');
  const [years, setYears] = useState('');
  const [results, setResults] = useState<any>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleInitialAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInitialAmount(value);
      setInitialAmountDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateInflation = () => {
    const amount = parseFloat(initialAmount.replace(/,/g, ''));
    const rate = parseFloat(inflationRate);
    const yearCount = parseInt(years);

    if (isNaN(amount) || isNaN(rate) || isNaN(yearCount)) return;

    const inflationFactor = Math.pow(1 + rate / 100, yearCount);
    const futureValue = amount * inflationFactor;
    const purchasingPower = amount / inflationFactor;
    const totalInflation = ((futureValue - amount) / amount) * 100;

    const yearlyBreakdown = [];
    for (let year = 1; year <= yearCount; year++) {
      const yearFactor = Math.pow(1 + rate / 100, year);
      const yearValue = amount * yearFactor;
      const yearPurchasingPower = amount / yearFactor;
      yearlyBreakdown.push({
        year,
        value: yearValue,
        purchasingPower: yearPurchasingPower,
        inflationAmount: yearValue - amount
      });
    }

    setResults({
      futureValue,
      purchasingPower,
      totalInflation,
      yearlyBreakdown
    });
  };

  const resetCalculator = () => {
    setInitialAmount('');
    setInitialAmountDisplay('');
    setInflationRate('');
    setYears('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaChartLine className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">인플레이션 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">인플레이션에 따른 화폐 가치 변화와 구매력 감소를 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">인플레이션 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  초기 금액 (원)
                </label>
                <input
                  type="text"
                  value={initialAmountDisplay}
                  onChange={handleInitialAmountChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercentage className="inline mr-2 text-black" />
                  연간 인플레이션율 (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  계산 기간 (년)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateInflation}
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
          {results && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">인플레이션 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">미래 가치</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {results.futureValue.toLocaleString()}원
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {years}년 후의 명목 가치
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">실질 구매력</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {results.purchasingPower.toLocaleString()}원
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    현재 가치 기준 구매력
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercentage className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 인플레이션</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {results.totalInflation.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    전체 기간 누적 인플레이션
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
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">명목 가치</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">실질 구매력</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">인플레이션 금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyBreakdown.map((item: any, index: number) => (
                        <tr key={item.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.year}년</td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.value.toLocaleString()}원
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.purchasingPower.toLocaleString()}원
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                            {item.inflationAmount.toLocaleString()}원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 인플레이션 계산 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">인플레이션 계산 공식</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>미래 가치:</strong> 초기금액 × (1 + 인플레이션율)^년수</p>
              <p>• <strong>실질 구매력:</strong> 초기금액 ÷ (1 + 인플레이션율)^년수</p>
              <p>• <strong>총 인플레이션:</strong> ((미래가치 - 초기금액) ÷ 초기금액) × 100</p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 인플레이션율은 변동될 수 있습니다.</p>
              <p>• <strong>명목 가치:</strong> 화폐의 표면적 가치를 의미합니다.</p>
              <p>• <strong>실질 구매력:</strong> 현재 가치 기준으로 측정된 구매력을 의미합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
