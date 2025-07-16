'use client';

import { useState } from 'react';
import { FaCalculator, FaHome, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHome className="mr-3 text-blue-600" />
            부동산 등기비용 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            부동산 등기 시 필요한 비용을 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                등기 유형
              </label>
              <select
                value={registrationType}
                onChange={(e) => setRegistrationType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 500,000,000"
              />
            </div>
          </div>

          <div className="mt-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 100,000"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculateCosts}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            비용 계산하기
          </button>

          {totalCost > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">등기비용 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">부동산 가액</p>
                  <p className="text-xl font-bold text-blue-600">
                    {parseNumber(propertyValue).toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">등기 수수료</p>
                  <p className="text-xl font-bold text-red-600">
                    {registrationFee.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">상세 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>등기 수수료:</span>
                    <span>{registrationFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>인지세:</span>
                    <span>{additionalCosts.stampDuty.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>등기필증 발급비:</span>
                    <span>{additionalCosts.certificateFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>공증비:</span>
                    <span>{additionalCosts.notaryFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>대리인 수수료:</span>
                    <span>{additionalCosts.agentFee.toLocaleString()}원</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>총 비용:</span>
                    <span className="text-red-600">{totalCost.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">적용 세율</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(registrationCosts.find(c => c.type === registrationType)?.rate || 0.004) * 100}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-600" />
            등기비용 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">등기 수수료율</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 소유권이전등기: 0.4%</li>
                <li>• 저당권설정등기: 0.1%</li>
                <li>• 임차권설정등기: 0.1%</li>
                <li>• 지상권설정등기: 0.2%</li>
                <li>• 전세권설정등기: 0.1%</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-2">추가 비용</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 인지세: 계약서 가액에 따라 차등</li>
                <li>• 등기필증 발급비: 1,000원</li>
                <li>• 공증비: 50,000~100,000원</li>
                <li>• 대리인 수수료: 100,000~300,000원</li>
                <li>• 등기소 수수료: 별도</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">주의사항</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 실제 비용은 지역, 시기, 조건에 따라 다를 수 있습니다</p>
              <p>• 정확한 비용 계산은 등기소나 법무사와 상담하시기 바랍니다</p>
              <p>• 인지세는 계약서 가액에 따라 차등 적용됩니다</p>
              <p>• 대리인 수수료는 선택사항이며 직접 등기할 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 