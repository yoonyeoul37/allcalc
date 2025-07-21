"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaShieldAlt, FaHome, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function AcquisitionCapitalGainsTaxCalculator() {
  const [propertyType, setPropertyType] = useState('house');
  const [propertyValue, setPropertyValue] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [disposalDate, setDisposalDate] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [disposalPrice, setDisposalPrice] = useState('');
  const [isFirstHouse, setIsFirstHouse] = useState(false);
  const [result, setResult] = useState<{
    acquisitionTax: number;
    capitalGainsTax: number;
    totalTax: number;
    capitalGains: number;
    taxRate: number;
  } | null>(null);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateTax = () => {
    if (!propertyValue || !acquisitionCost || !disposalPrice || !acquisitionDate || !disposalDate) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    const value = parseNumber(propertyValue);
    const acquisition = parseNumber(acquisitionCost);
    const disposal = parseNumber(disposalPrice);
    const acquisitionDateObj = new Date(acquisitionDate);
    const disposalDateObj = new Date(disposalDate);

    // 취득세 계산
    let acquisitionTaxRate = 0;
    if (propertyType === 'house') {
      if (value <= 60000000) {
        acquisitionTaxRate = 0.01; // 1%
      } else if (value <= 150000000) {
        acquisitionTaxRate = 0.02; // 2%
      } else if (value <= 300000000) {
        acquisitionTaxRate = 0.03; // 3%
      } else {
        acquisitionTaxRate = 0.04; // 4%
      }
    } else if (propertyType === 'land') {
      acquisitionTaxRate = 0.04; // 4%
    } else {
      acquisitionTaxRate = 0.025; // 2.5%
    }

    const acquisitionTax = value * acquisitionTaxRate;

    // 양도소득세 계산
    const capitalGains = disposal - acquisition;
    const holdingPeriod = (disposalDateObj.getTime() - acquisitionDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365);

    let capitalGainsTaxRate = 0;
    if (capitalGains > 0) {
      if (propertyType === 'house' && isFirstHouse) {
        if (holdingPeriod >= 3) {
          capitalGainsTaxRate = 0.06; // 6% (3년 이상 보유)
        } else {
          capitalGainsTaxRate = 0.12; // 12% (3년 미만 보유)
        }
      } else {
        if (holdingPeriod >= 1) {
          capitalGainsTaxRate = 0.06; // 6% (1년 이상 보유)
        } else {
          capitalGainsTaxRate = 0.12; // 12% (1년 미만 보유)
        }
      }
    }

    const capitalGainsTax = capitalGains > 0 ? capitalGains * capitalGainsTaxRate : 0;
    const totalTax = acquisitionTax + capitalGainsTax;

    setResult({
      acquisitionTax: Math.round(acquisitionTax),
      capitalGainsTax: Math.round(capitalGainsTax),
      totalTax: Math.round(totalTax),
      capitalGains: Math.round(capitalGains),
      taxRate: Math.round(capitalGainsTaxRate * 100)
    });
  };

  const resetCalculator = () => {
    setPropertyType('house');
    setPropertyValue('');
    setAcquisitionDate('');
    setDisposalDate('');
    setAcquisitionCost('');
    setDisposalPrice('');
    setIsFirstHouse(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaShieldAlt className="mr-3 text-[#003366]" />
              취득세/양도세 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부동산 유형
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="house">주택</option>
                  <option value="land">토지</option>
                  <option value="commercial">상가/사무실</option>
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
                  placeholder="예: 500,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  취득일
                </label>
                <input
                  type="date"
                  value={acquisitionDate}
                  onChange={(e) => setAcquisitionDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양도일
                </label>
                <input
                  type="date"
                  value={disposalDate}
                  onChange={(e) => setDisposalDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  취득가액 (원)
                </label>
                <input
                  type="text"
                  value={acquisitionCost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setAcquisitionCost(formatNumber(value));
                  }}
                  placeholder="예: 400,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양도가액 (원)
                </label>
                <input
                  type="text"
                  value={disposalPrice}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setDisposalPrice(formatNumber(value));
                  }}
                  placeholder="예: 600,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              {propertyType === 'house' && (
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFirstHouse"
                      checked={isFirstHouse}
                      onChange={(e) => setIsFirstHouse(e.target.checked)}
                      className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
                    />
                    <label htmlFor="isFirstHouse" className="text-sm font-medium text-gray-700">
                      첫 주택 여부 (주택 양도소득세 감면 적용)
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateTax}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
              >
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
              >
                초기화
              </button>
            </div>

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">취득세</p>
                    <p className="text-xl font-bold text-[#003366]">{result.acquisitionTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도소득세</p>
                    <p className="text-xl font-bold text-[#003366]">{result.capitalGainsTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도차익</p>
                    <p className="text-xl font-bold text-[#003366]">{result.capitalGains.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도세율</p>
                    <p className="text-xl font-bold text-[#003366]">{result.taxRate}%</p>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-sm text-gray-600">총 세금</p>
                    <p className="text-2xl font-bold text-[#003366]">{result.totalTax.toLocaleString()}원</p>
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
              
              <Link href="/real-estate-registration-cost-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
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
