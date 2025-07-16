'use client';

import { useState } from 'react';
import { FaCalculator, FaHome, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';

export default function JeonseMonthlyConverter() {
  const [conversionType, setConversionType] = useState<'jeonse-to-monthly' | 'monthly-to-jeonse'>('jeonse-to-monthly');
  const [jeonseAmount, setJeonseAmount] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0.05); // 5% 기본 이율

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateConversion = () => {
    if (conversionType === 'jeonse-to-monthly') {
      // 전세 → 월세 변환
      const jeonse = parseNumber(jeonseAmount);
      const monthly = parseNumber(monthlyRent);
      const depositAmount = parseNumber(deposit);
      
      // 전세금에서 보증금을 뺀 금액을 월세로 변환
      const remainingAmount = jeonse - depositAmount;
      const monthlyPayment = (remainingAmount * conversionRate) / 12;
      const totalMonthly = monthly + monthlyPayment;
      
      setConvertedAmount(totalMonthly);
    } else {
      // 월세 → 전세 변환
      const monthly = parseNumber(monthlyRent);
      const depositAmount = parseNumber(deposit);
      
      // 월세를 전세금으로 변환
      const annualRent = monthly * 12;
      const jeonseAmount = (annualRent / conversionRate) + depositAmount;
      
      setConvertedAmount(jeonseAmount);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHome className="mr-3 text-black" />
            전세/월세 전환 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            전세와 월세를 상호 변환해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setConversionType('jeonse-to-monthly')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                conversionType === 'jeonse-to-monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaExchangeAlt className="inline mr-2" />
              전세 → 월세
            </button>
            <button
              onClick={() => setConversionType('monthly-to-jeonse')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                conversionType === 'monthly-to-jeonse'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaExchangeAlt className="inline mr-2" />
              월세 → 전세
            </button>
          </div>

          {conversionType === 'jeonse-to-monthly' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전세금 (원)
                  </label>
                  <input
                    type="text"
                    value={jeonseAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setJeonseAmount(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 50,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    보증금 (원)
                  </label>
                  <input
                    type="text"
                    value={deposit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setDeposit(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 10,000,000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월세 (원)
                </label>
                <input
                  type="text"
                  value={monthlyRent}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMonthlyRent(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 500,000"
                />
              </div>
            </div>
          )}

          {conversionType === 'monthly-to-jeonse' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월세 (원)
                  </label>
                  <input
                    type="text"
                    value={monthlyRent}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setMonthlyRent(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 500,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    보증금 (원)
                  </label>
                  <input
                    type="text"
                    value={deposit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setDeposit(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 10,000,000"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이율 (%)
            </label>
            <input
              type="number"
              value={conversionRate * 100}
              onChange={(e) => setConversionRate(parseFloat(e.target.value) / 100)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5.0"
              step="0.1"
            />
            <p className="text-sm text-gray-500 mt-2">
              일반적으로 4~6% 이율을 사용합니다
            </p>
          </div>

          <button
            onClick={calculateConversion}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6"
          >
            변환 계산하기
          </button>

          {convertedAmount > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">변환 결과</h3>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {conversionType === 'jeonse-to-monthly' ? '변환된 월세' : '변환된 전세금'}
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {convertedAmount.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-black" />
            전세/월세 변환 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">전세 → 월세 변환</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 전세금에서 보증금을 뺀 금액</li>
                <li>• 이율을 적용하여 월세로 변환</li>
                <li>• 기존 월세와 합산</li>
                <li>• 일반적으로 4~6% 이율 사용</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">월세 → 전세 변환</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 월세를 연간 금액으로 계산</li>
                <li>• 이율로 나누어 전세금 계산</li>
                <li>• 보증금과 합산</li>
                <li>• 시장 상황에 따라 이율 조정</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">변환 공식</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>전세 → 월세:</strong> 월세 = 기존월세 + (전세금 - 보증금) × 이율 ÷ 12</p>
              <p><strong>월세 → 전세:</strong> 전세금 = (월세 × 12 ÷ 이율) + 보증금</p>
              <p><strong>이율:</strong> 일반적으로 4~6% 사용 (시장 상황에 따라 조정)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 