'use client';

import { useState } from 'react';
import { FaCalculator, FaFire, FaHome, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface GasRate {
  tier: string;
  minUsage: number;
  maxUsage: number;
  rate: number;
  description: string;
}

const gasRates: GasRate[] = [
  {
    tier: '1단계',
    minUsage: 0,
    maxUsage: 20,
    rate: 1200,
    description: '기본 사용량 (1~20㎥)'
  },
  {
    tier: '2단계',
    minUsage: 21,
    maxUsage: 50,
    rate: 1800,
    description: '일반 사용량 (21~50㎥)'
  },
  {
    tier: '3단계',
    minUsage: 51,
    maxUsage: 100,
    rate: 2400,
    description: '높은 사용량 (51~100㎥)'
  },
  {
    tier: '4단계',
    minUsage: 101,
    maxUsage: Infinity,
    rate: 3000,
    description: '최고 사용량 (101㎥ 이상)'
  }
];

export default function GasBillCalculator() {
  const [monthlyUsage, setMonthlyUsage] = useState('');
  const [billAmount, setBillAmount] = useState(0);
  const [baseCharge, setBaseCharge] = useState(0);
  const [usageBreakdown, setUsageBreakdown] = useState<{ tier: string; usage: number; charge: number }[]>([]);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateGasBill = () => {
    const usage = parseNumber(monthlyUsage);
    let totalCharge = 0;
    let baseCharge = 0;
    const breakdown: { tier: string; usage: number; charge: number }[] = [];

    // 기본요금 (고정)
    baseCharge = 1500;
    totalCharge += baseCharge;

    let remainingUsage = usage;

    for (const rate of gasRates) {
      if (remainingUsage <= 0) break;

      let tierUsage = 0;
      if (remainingUsage <= (rate.maxUsage - rate.minUsage + 1)) {
        tierUsage = remainingUsage;
      } else {
        tierUsage = rate.maxUsage - rate.minUsage + 1;
      }

      const tierCharge = tierUsage * rate.rate;
      totalCharge += tierCharge;

      if (tierUsage > 0) {
        breakdown.push({
          tier: rate.tier,
          usage: tierUsage,
          charge: tierCharge
        });
      }

      remainingUsage -= tierUsage;
    }

    // 부가가치세 (10%)
    const vat = totalCharge * 0.1;
    totalCharge += vat;

    setBaseCharge(baseCharge);
    setUsageBreakdown(breakdown);
    setBillAmount(totalCharge);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaFire className="mr-3 text-orange-600" />
            가스요금 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            월 사용량에 따른 도시가스 요금을 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 사용량 (㎥)
              </label>
              <input
                type="text"
                value={monthlyUsage}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setMonthlyUsage(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 25"
              />
              <p className="text-sm text-gray-500 mt-2">
                일반 가정 월 평균 사용량: 20~30㎥
              </p>
            </div>

            <button
              onClick={calculateGasBill}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors mt-6"
            >
              가스요금 계산하기
            </button>
          </div>

          {billAmount > 0 && (
            <div className="bg-orange-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">가스요금 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">기본요금</p>
                  <p className="text-xl font-bold text-orange-600">
                    {baseCharge.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">총 가스요금</p>
                  <p className="text-xl font-bold text-red-600">
                    {billAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">사용량별 요금 내역</h4>
                <div className="space-y-2">
                  {usageBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="font-medium text-gray-800">{item.tier}</span>
                        <span className="text-sm text-gray-600 ml-2">({item.usage}㎥)</span>
                      </div>
                      <span className="font-semibold text-orange-600">
                        {item.charge.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">요금 구성</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>기본요금:</span>
                    <span>{baseCharge.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>사용량 요금:</span>
                    <span>{(billAmount - baseCharge - (billAmount * 0.1)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>부가가치세 (10%):</span>
                    <span>{(billAmount * 0.1).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-orange-600" />
            가스요금 정보
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {gasRates.map((rate, index) => (
              <div key={index} className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
                  <FaHome className="mr-2" />
                  {rate.tier}
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {rate.minUsage}~{rate.maxUsage === Infinity ? '∞' : rate.maxUsage}㎥</li>
                  <li>• {rate.rate.toLocaleString()}원/㎥</li>
                  <li>• {rate.description}</li>
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">요금 계산 방법</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 기본요금: 월 1,500원 (고정)</p>
              <p>• 사용량 요금: 사용량별 단계별 요금 적용</p>
              <p>• 부가가치세: 총 요금의 10%</p>
              <p>• 총 요금 = 기본요금 + 사용량 요금 + 부가가치세</p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">절약 팁</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 보일러 온도를 1도 낮추면 약 5% 절약</p>
              <p>• 샤워 시간을 1분 줄이면 약 10% 절약</p>
              <p>• 보일러 필터 정기 청소로 효율 향상</p>
              <p>• 외출 시 보일러 온도 낮추기</p>
              <p>• 단열재 설치로 열 손실 방지</p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">월 평균 사용량 안내</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 1인 가구: 15~20㎥</p>
              <p>• 2인 가구: 20~25㎥</p>
              <p>• 3인 가구: 25~30㎥</p>
              <p>• 4인 가구: 30~35㎥</p>
              <p>• 5인 이상: 35㎥ 이상</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 