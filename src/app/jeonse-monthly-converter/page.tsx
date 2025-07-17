'use client';

import { useState } from 'react';
import { FaCalculator, FaHome, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHome className="mr-3 text-gray-600" />
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
                  ? 'bg-gray-600 text-white shadow-md'
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
                  ? 'bg-gray-600 text-white shadow-md'
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="5.0"
              step="0.1"
            />
            <p className="text-sm text-gray-500 mt-2">
              일반적으로 4~6% 이율을 사용합니다
            </p>
          </div>

          <button
            onClick={calculateConversion}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mt-6"
          >
            변환 계산하기
          </button>

          {convertedAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">변환 결과</h3>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {conversionType === 'jeonse-to-monthly' ? '월세 금액' : '전세금'}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {convertedAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">계산 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {conversionType === 'jeonse-to-monthly' && (
                    <>
                      <div className="flex justify-between">
                        <span>전세금:</span>
                        <span>{parseNumber(jeonseAmount).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>보증금:</span>
                        <span>{parseNumber(deposit).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>기존 월세:</span>
                        <span>{parseNumber(monthlyRent).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>이율:</span>
                        <span>{(conversionRate * 100).toFixed(1)}%</span>
                      </div>
                    </>
                  )}
                  {conversionType === 'monthly-to-jeonse' && (
                    <>
                      <div className="flex justify-between">
                        <span>월세:</span>
                        <span>{parseNumber(monthlyRent).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>보증금:</span>
                        <span>{parseNumber(deposit).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>이율:</span>
                        <span>{(conversionRate * 100).toFixed(1)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-gray-600" />
            전세/월세 변환 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">전세란?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 임대인이 임차인에게 일정 금액을 맡기고</li>
                <li>• 월세 없이 주택을 사용할 수 있는 제도</li>
                <li>• 임대차 기간 종료 시 전세금을 반환</li>
                <li>• 일반적으로 2년 계약</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">월세란?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 보증금과 월세를 함께 지급하는 제도</li>
                <li>• 매월 임대료를 지급</li>
                <li>• 보증금은 계약 종료 시 반환</li>
                <li>• 일반적으로 2년 계약</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">변환 공식</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>전세 → 월세:</strong> (전세금 - 보증금) × 이율 ÷ 12 + 기존 월세</p>
              <p><strong>월세 → 전세:</strong> (월세 × 12) ÷ 이율 + 보증금</p>
              <p>• 이율은 일반적으로 4~6% 사용</p>
              <p>• 시장 상황에 따라 변동 가능</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 