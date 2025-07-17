'use client';

import { useState } from 'react';
import { FaCalculator, FaLightbulb, FaHome, FaBuilding, FaCar, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface ElectricityRate {
  type: string;
  baseRate: number;
  unitRate: number;
  description: string;
}

const electricityRates: { [key: string]: ElectricityRate } = {
  residential: {
    type: '주거용',
    baseRate: 910,
    unitRate: 88.3,
    description: '일반 가정용 전기요금'
  },
  commercial: {
    type: '비주거용',
    baseRate: 910,
    unitRate: 105.7,
    description: '상업용, 업무용 전기요금'
  },
  electric_vehicle: {
    type: '전기차',
    baseRate: 910,
    unitRate: 88.3,
    description: '전기차 충전용 전기요금'
  }
};

export default function ElectricityBillCalculator() {
  const [electricityType, setElectricityType] = useState<'residential' | 'commercial' | 'electric_vehicle'>('residential');
  const [monthlyUsage, setMonthlyUsage] = useState('');
  const [billAmount, setBillAmount] = useState(0);
  const [baseCharge, setBaseCharge] = useState(0);
  const [usageCharge, setUsageCharge] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateElectricityBill = () => {
    const usage = parseNumber(monthlyUsage);
    const rate = electricityRates[electricityType];
    
    // 기본요금
    const base = rate.baseRate;
    
    // 사용량 요금 (kWh당)
    const usageCharge = usage * rate.unitRate;
    
    // 부가가치세 (10%)
    const vat = (base + usageCharge) * 0.1;
    
    // 전력산업기반기금 (3.7%)
    const fund = (base + usageCharge) * 0.037;
    
    // 총 요금
    const total = base + usageCharge + vat + fund;
    
    setBaseCharge(base);
    setUsageCharge(usageCharge);
    setBillAmount(total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaLightbulb className="mr-3 text-gray-600" />
            전기요금 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            주거용, 비주거용, 전기차 충전용 전기요금을 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전기 사용 유형
              </label>
              <select
                value={electricityType}
                onChange={(e) => setElectricityType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="residential">주거용 (일반 가정)</option>
                <option value="commercial">비주거용 (상업/업무)</option>
                <option value="electric_vehicle">전기차 충전</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {electricityRates[electricityType].description}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 사용량 (kWh)
              </label>
              <input
                type="text"
                value={monthlyUsage}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setMonthlyUsage(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="예: 300"
              />
            </div>
          </div>

          <button
            onClick={calculateElectricityBill}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mt-6"
          >
            전기요금 계산하기
          </button>

          {billAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">전기요금 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">기본요금</p>
                  <p className="text-xl font-bold text-gray-600">
                    {baseCharge.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">사용량 요금</p>
                  <p className="text-xl font-bold text-gray-600">
                    {usageCharge.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">총 전기요금</p>
                  <p className="text-2xl font-bold text-red-600">
                    {billAmount.toLocaleString()}원
                  </p>
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
                    <span>사용량 요금 ({parseNumber(monthlyUsage)}kWh × {electricityRates[electricityType].unitRate}원):</span>
                    <span>{usageCharge.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>부가가치세 (10%):</span>
                    <span>{((baseCharge + usageCharge) * 0.1).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>전력산업기반기금 (3.7%):</span>
                    <span>{((baseCharge + usageCharge) * 0.037).toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-gray-600" />
            전기요금 정보
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaHome className="mr-2" />
                주거용
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 기본요금: 910원</li>
                <li>• 단위요금: 88.3원/kWh</li>
                <li>• 일반 가정용</li>
                <li>• 가장 저렴한 요금</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaBuilding className="mr-2" />
                비주거용
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 기본요금: 910원</li>
                <li>• 단위요금: 105.7원/kWh</li>
                <li>• 상업용, 업무용</li>
                <li>• 주거용보다 높은 요금</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaCar className="mr-2" />
                전기차 충전
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 기본요금: 910원</li>
                <li>• 단위요금: 88.3원/kWh</li>
                <li>• 전기차 충전용</li>
                <li>• 주거용과 동일한 요금</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">요금 계산 방법</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 기본요금: 월 910원 (고정)</p>
              <p>• 사용량 요금: 사용량(kWh) × 단위요금(원/kWh)</p>
              <p>• 부가가치세: (기본요금 + 사용량 요금) × 10%</p>
              <p>• 전력산업기반기금: (기본요금 + 사용량 요금) × 3.7%</p>
              <p>• 총 요금 = 기본요금 + 사용량 요금 + 부가가치세 + 전력산업기반기금</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 