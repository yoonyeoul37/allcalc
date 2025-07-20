"use client";

import { useState } from 'react';
import { FaCalculator, FaLightbulb, FaHome, FaBuilding, FaCar, FaInfoCircle, FaTint, FaFire } from 'react-icons/fa';
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
    
    if (usage === 0) {
      alert('월 사용량을 입력해주세요.');
      return;
    }
    
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaLightbulb className="mr-3 text-[#003366]" />
              전기요금 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전기 사용 유형
                </label>
                <select
                  value={electricityType}
                  onChange={(e) => setElectricityType(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 300"
                />
              </div>
            </div>

            <button
              onClick={calculateElectricityBill}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              전기요금 계산하기
            </button>

            {billAmount > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">전기요금 계산 결과</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">기본요금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {baseCharge.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">사용량 요금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {usageCharge.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">총 전기요금</p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {billAmount.toLocaleString()}원
                  </p>
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
              <a href="/water-bill-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaTint className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">수도요금 계산기</h4>
                <p className="text-xs text-gray-600">수도요금 계산</p>
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