"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaHome, FaExchangeAlt, FaMoneyBillWave, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
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
    if (!jeonseAmount && !monthlyRent) {
      alert('전세금 또는 월세를 입력해주세요.');
      return;
    }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHome className="mr-3 text-[#003366]" />
              전세/월세 전환 계산기
            </h1>
            
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setConversionType('jeonse-to-monthly')}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                  conversionType === 'jeonse-to-monthly'
                    ? 'bg-[#003366] text-white shadow-md'
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
                    ? 'bg-[#003366] text-white shadow-md'
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                      style={{ color: '#000000 !important' }}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                      style={{ color: '#000000 !important' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                      style={{ color: '#000000 !important' }}
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                      style={{ color: '#000000 !important' }}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                style={{ color: '#000000 !important' }}
                placeholder="5.0"
                step="0.1"
              />
              <p className="text-sm text-gray-500 mt-2">
                일반적으로 4~6% 이율을 사용합니다
              </p>
            </div>

            <button
              onClick={calculateConversion}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {convertedAmount > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {conversionType === 'jeonse-to-monthly' ? '월세 금액' : '전세금'}
                  </p>
                  <p className="text-2xl font-bold text-[#003366]">
                    {convertedAmount.toLocaleString()}원
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
              <Link href="/interim-payment-interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">중도금 이자 계산기</h4>
                <p className="text-xs text-gray-600">이자 계산</p>
              </Link>
              
              <Link href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
              
              <Link href="/real-estate-registration-cost-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부동산 등기비용</h4>
                <p className="text-xs text-gray-600">등기비용 계산</p>
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
