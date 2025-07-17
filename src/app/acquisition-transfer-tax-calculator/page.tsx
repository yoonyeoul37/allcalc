'use client';

import { useState } from 'react';
import { FaCalculator, FaHome, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHome className="mr-3 text-blue-600" />
            취득세/양도세 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            부동산 취득세와 양도소득세를 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTaxType('acquisition')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                taxType === 'acquisition'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FaMoneyBillWave className="inline mr-2" />
              취득세
            </button>
            <button
              onClick={() => setTaxType('transfer')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                taxType === 'transfer'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <FaMoneyBillWave className="inline mr-2" />
              양도세
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부동산 유형
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="예: 500,000,000"
              />
            </div>
          </div>

          <button
            onClick={calculateTax}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            세금 계산하기
          </button>

          {taxAmount > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">세금 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">부동산 가액</p>
                  <p className="text-xl font-bold text-blue-600">
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">세율 정보</h4>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>적용 세율:</strong> {
                      taxType === 'acquisition' 
                        ? (acquisitionTaxRates.find(t => t.type === propertyType)?.rate || 0.01) * 100
                        : (transferTaxRates.find(t => t.type === propertyType)?.rate || 0.006) * 100
                    }%
                  </p>
                  <p>
                    <strong>설명:</strong> {
                      taxType === 'acquisition'
                        ? acquisitionTaxRates.find(t => t.type === propertyType)?.description
                        : transferTaxRates.find(t => t.type === propertyType)?.description
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-purple-600" />
            세금 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">취득세</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 주택: 1%</li>
                <li>• 토지: 2%</li>
                <li>• 건물: 2.5%</li>
                <li>• 상가: 2.5%</li>
                <li>• 부동산 취득 시 납부</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 rounded-lg p-4">
              <h3 className="font-semibold text-pink-800 mb-2">양도소득세</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 1세대 1주택: 0.6%</li>
                <li>• 1세대 2주택: 1.2%</li>
                <li>• 2세대 이상: 1.8%</li>
                <li>• 상가/토지: 2.5%</li>
                <li>• 부동산 양도 시 납부</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">주의사항</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 실제 세율은 지역, 시기, 조건에 따라 다를 수 있습니다</p>
              <p>• 정확한 세금 계산은 세무사와 상담하시기 바랍니다</p>
              <p>• 취득세는 부동산 취득 시, 양도세는 양도 시 납부합니다</p>
              <p>• 1세대 1주택 양도 시 특별한 혜택이 있을 수 있습니다</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 