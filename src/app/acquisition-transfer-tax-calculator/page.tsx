"use client";

import { useState } from 'react';
import { FaCalculator, FaHome, FaMoneyBillWave, FaCar, FaGasPump, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface TaxRate {
  type: string;
  rate: number;
  description: string;
}

const acquisitionTaxRates: TaxRate[] = [
  { type: '주택', rate: 0.01, description: '주택 취득세율 1%' },
  { type: '토지', rate: 0.02, description: '토지 취득세율 2%' },
  { type: '건물', rate: 0.025, description: '건물 취득세율 2.5%' },
  { type: '상가', rate: 0.025, description: '상가 취득세율 2.5%' }
];

const transferTaxRates: TaxRate[] = [
  { type: '1세대 1주택', rate: 0.006, description: '1세대 1주택 양도세율 0.6%' },
  { type: '1세대 2주택', rate: 0.012, description: '1세대 2주택 양도세율 1.2%' },
  { type: '2세대 이상', rate: 0.018, description: '2세대 이상 양도세율 1.8%' },
  { type: '상가/토지', rate: 0.025, description: '상가/토지 양도세율 2.5%' }
];

export default function AcquisitionTransferTaxCalculator() {
  const [taxType, setTaxType] = useState<'acquisition' | 'transfer'>('acquisition');
  const [propertyType, setPropertyType] = useState('주택');
  const [propertyValue, setPropertyValue] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateTax = () => {
    if (!propertyValue.trim()) {
      alert('부동산 가액을 입력해주세요.');
      return;
    }

    const value = parseNumber(propertyValue);
    let rate = 0;

    if (taxType === 'acquisition') {
      const taxRate = acquisitionTaxRates.find(t => t.type === propertyType);
      rate = taxRate ? taxRate.rate : 0.01;
    } else {
      const taxRate = transferTaxRates.find(t => t.type === propertyType);
      rate = taxRate ? taxRate.rate : 0.006;
    }

    const tax = value * rate;
    const total = value + tax;

    setTaxAmount(tax);
    setTotalAmount(total);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHome className="mr-3 text-[#003366]" />
              취득세/양도세 계산기
            </h1>

            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTaxType('acquisition')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                  taxType === 'acquisition'
                    ? 'bg-[#003366] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaMoneyBillWave className="inline mr-2" />
                취득세
              </button>
              <button
                onClick={() => setTaxType('transfer')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                  taxType === 'transfer'
                    ? 'bg-[#003366] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaMoneyBillWave className="inline mr-2" />
                양도세
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부동산 유형
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {taxType === 'acquisition' ? (
                    <>
                      <option value="주택">주택</option>
                      <option value="토지">토지</option>
                      <option value="건물">건물</option>
                      <option value="상가">상가</option>
                    </>
                  ) : (
                    <>
                      <option value="1세대 1주택">1세대 1주택</option>
                      <option value="1세대 2주택">1세대 2주택</option>
                      <option value="2세대 이상">2세대 이상</option>
                      <option value="상가/토지">상가/토지</option>
                    </>
                  )}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 500,000,000"
                />
              </div>
            </div>

            <button
              onClick={calculateTax}
              className="w-full bg-[#003366] text-white py-3 rounded-lg font-medium hover:bg-[#002244] transition-colors mb-6"
            >
              세금 계산하기
            </button>

            {taxAmount > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">세금 계산 결과</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">부동산 가액</p>
                    <p className="text-xl font-bold text-gray-600">
                      {parseNumber(propertyValue).toLocaleString()}원
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {taxType === 'acquisition' ? '취득세' : '양도세'}
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      {taxAmount.toLocaleString()}원
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">총 금액 (가액 + 세금)</p>
                    <p className="text-2xl font-bold text-red-600">
                      {totalAmount.toLocaleString()}원
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
              <a href="/automobile-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
              
              <a href="/automobile-fuel-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGasPump className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 연비/유류비</h4>
                <p className="text-xs text-gray-600">연비 계산</p>
              </a>
              
              <a href="/car-loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 대출 계산기</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </a>
              
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 