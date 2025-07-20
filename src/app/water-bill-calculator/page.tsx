"use client";

import { useState } from 'react';
import { FaCalculator, FaTint, FaHome, FaBuilding, FaInfoCircle, FaLightbulb, FaFire } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface WaterRate {
  tier: string;
  minUsage: number;
  maxUsage: number;
  rate: number;
  description: string;
}

const waterRates: WaterRate[] = [
  {
    tier: '1단계',
    minUsage: 0,
    maxUsage: 20,
    rate: 430,
    description: '기본 사용량 (1~20㎥)'
  },
  {
    tier: '2단계',
    minUsage: 21,
    maxUsage: 50,
    rate: 640,
    description: '일반 사용량 (21~50㎥)'
  },
  {
    tier: '3단계',
    minUsage: 51,
    maxUsage: 100,
    rate: 1050,
    description: '높은 사용량 (51~100㎥)'
  },
  {
    tier: '4단계',
    minUsage: 101,
    maxUsage: Infinity,
    rate: 1400,
    description: '최고 사용량 (101㎥ 이상)'
  }
];

export default function WaterBillCalculator() {
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

  const calculateWaterBill = () => {
    const usage = parseNumber(monthlyUsage);
    
    if (usage === 0) {
      alert('월 사용량을 입력해주세요.');
      return;
    }
    
    let totalCharge = 0;
    let baseCharge = 0;
    const breakdown: { tier: string; usage: number; charge: number }[] = [];

    // 기본요금 (고정)
    baseCharge = 1000;
    totalCharge += baseCharge;

    let remainingUsage = usage;

    for (const rate of waterRates) {
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

    // 하수도 요금 (상수도 요금의 90%)
    const sewageCharge = (totalCharge - baseCharge) * 0.9;
    totalCharge += sewageCharge;

    // 부가가치세 (10%)
    const vat = totalCharge * 0.1;
    totalCharge += vat;

    setBaseCharge(baseCharge);
    setUsageBreakdown(breakdown);
    setBillAmount(totalCharge);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaTint className="mr-3 text-[#003366]" />
              수도요금 계산기
            </h1>
            
            <div className="max-w-md mx-auto mb-6">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 30"
                />
                <p className="text-sm text-gray-500 mt-2">
                  1㎥ = 1,000리터 (1톤)
                </p>
              </div>
            </div>

            <button
              onClick={calculateWaterBill}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              수도요금 계산하기
            </button>

            {billAmount > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">수도요금 계산 결과</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">기본요금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {baseCharge.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 수도요금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {billAmount.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/electricity-bill-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaLightbulb className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">전기요금 계산기</h4>
                <p className="text-xs text-gray-600">전기요금 계산</p>
              </a>
              
              <a href="/gas-bill-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaFire className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">가스요금 계산기</h4>
                <p className="text-xs text-gray-600">가스요금 계산</p>
              </a>
              
              <a href="/comprehensive-income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">종합소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </a>
              
              <a href="/work-income-tax-refund-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근로소득세 환급액</h4>
                <p className="text-xs text-gray-600">연말정산 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 