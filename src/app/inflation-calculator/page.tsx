'use client';

import { useState } from 'react';
import { FaCalculator, FaChartLine, FaMoneyBillWave, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import Header from '../../components/ui/Header';

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

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">인플레이션 계산기</h1>
            <p className="text-lg text-gray-600">인플레이션에 따른 화폐 가치 변화와 구매력 감소를 계산해보세요</p>
          </div>

          {/* 인플레이션 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">초기 금액 (원)</label>
                <input
                  type="text"
                  value={initialAmountDisplay}
                  onChange={handleInitialAmountChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연간 인플레이션율 (%)</label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="2.5"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계산 기간 (년)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateInflation}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                계산하기
              </button>
            </div>

            {/* 결과 표시 */}
            {results && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">인플레이션 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">미래 가치</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.futureValue.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {years}년 후의 명목 가치
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">실질 구매력</div>
                    <div className="text-2xl font-bold text-red-600">
                      {results.purchasingPower.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      현재 가치 기준 구매력
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 인플레이션</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.totalInflation.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      전체 기간 누적 인플레이션
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 연도별 상세 내역 */}
          {results && (
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">명목 가치</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">실질 구매력</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">인플레이션 금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyBreakdown.map((item: any, index: number) => (
                      <tr key={item.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-700">{item.year}년</td>
                        <td className="px-4 py-3 font-semibold text-blue-600">
                          {item.value.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-600">
                          {item.purchasingPower.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3 font-semibold text-orange-600">
                          {item.inflationAmount.toLocaleString()}원
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
              인플레이션 계산기 설명
            </h3>
            <div className="prose text-gray-600 space-y-3">
              <p>
                <strong>명목 가치:</strong> 인플레이션을 반영한 미래의 명목적 금액입니다.
              </p>
              <p>
                <strong>실질 구매력:</strong> 현재 가치 기준으로 환산한 실제 구매력을 나타냅니다.
              </p>
              <p>
                <strong>총 인플레이션:</strong> 전체 기간 동안 누적된 인플레이션 비율입니다.
              </p>
              <p>
                <strong>인플레이션 금액:</strong> 원금 대비 인플레이션으로 인해 증가한 금액입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 