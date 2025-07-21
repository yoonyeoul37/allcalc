"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaHome, FaMoneyBillWave, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface RegistrationCost {
  type: string;
  rate: number;
  description: string;
}

const registrationCosts: RegistrationCost[] = [
  { type: '소유권이전등기', rate: 0.004, description: '소유권이전등기 수수료 0.4%' },
  { type: '저당권설정등기', rate: 0.001, description: '저당권설정등기 수수료 0.1%' },
  { type: '임차권설정등기', rate: 0.001, description: '임차권설정등기 수수료 0.1%' },
  { type: '지상권설정등기', rate: 0.002, description: '지상권설정등기 수수료 0.2%' },
  { type: '전세권설정등기', rate: 0.001, description: '전세권설정등기 수수료 0.1%' }
];

export default function RealEstateRegistrationCostCalculator() {
  const [registrationType, setRegistrationType] = useState('소유권이전등기');
  const [propertyValue, setPropertyValue] = useState('');
  const [additionalCosts, setAdditionalCosts] = useState({
    stampDuty: 0,
    certificateFee: 0,
    notaryFee: 0,
    agentFee: 0
  });
  const [totalCost, setTotalCost] = useState(0);
  const [registrationFee, setRegistrationFee] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateCosts = () => {
    if (!propertyValue) {
      alert('부동산 가액을 입력해주세요.');
      return;
    }

    const value = parseNumber(propertyValue);
    const costRate = registrationCosts.find(c => c.type === registrationType)?.rate || 0.004;
    
    // 등기 수수료 계산
    const fee = value * costRate;
    
    // 추가 비용들
    const stampDuty = additionalCosts.stampDuty;
    const certificateFee = additionalCosts.certificateFee;
    const notaryFee = additionalCosts.notaryFee;
    const agentFee = additionalCosts.agentFee;
    
    const total = fee + stampDuty + certificateFee + notaryFee + agentFee;
    
    setRegistrationFee(fee);
    setTotalCost(total);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHome className="mr-3 text-[#003366]" />
              부동산 등기비용 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등기 유형
                </label>
                <select
                  value={registrationType}
                  onChange={(e) => setRegistrationType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  {registrationCosts.map((cost) => (
                    <option key={cost.type} value={cost.type}>
                      {cost.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부동산 가액 (원)
                </label>
                <input
                  type="text"
                  value={propertyValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setPropertyValue(formatNumber(value));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                  placeholder="예: 500,000,000"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">추가 비용</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인지세 (원)
                  </label>
                  <input
                    type="text"
                    value={additionalCosts.stampDuty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setAdditionalCosts(prev => ({ ...prev, stampDuty: value }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                    placeholder="예: 35,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    등기필증 발급비 (원)
                  </label>
                  <input
                    type="text"
                    value={additionalCosts.certificateFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setAdditionalCosts(prev => ({ ...prev, certificateFee: value }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                    placeholder="예: 1,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공증비 (원)
                  </label>
                  <input
                    type="text"
                    value={additionalCosts.notaryFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setAdditionalCosts(prev => ({ ...prev, notaryFee: value }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                    placeholder="예: 50,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대리인 수수료 (원)
                  </label>
                  <input
                    type="text"
                    value={additionalCosts.agentFee}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setAdditionalCosts(prev => ({ ...prev, agentFee: value }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                    placeholder="예: 100,000"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateCosts}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {totalCost > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">부동산 가액</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {parseNumber(propertyValue).toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">등기 수수료</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {registrationFee.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 등기비용</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {totalCost.toLocaleString()}원
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
              <Link href="/jeonse-monthly-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">전세/월세 전환</h4>
                <p className="text-xs text-gray-600">전환 계산</p>
              </Link>
              
              <Link href="/interim-payment-interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">중도금 이자 계산기</h4>
                <p className="text-xs text-gray-600">이자 계산</p>
              </Link>
              
              <Link href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
              
              <Link href="/rental-yield-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임대수익률 계산기</h4>
                <p className="text-xs text-gray-600">수익률 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
