'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

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

  const calculateTax = () => {
    if (!propertyValue || !acquisitionCost || !disposalPrice) return;

    const value = parseFloat(propertyValue);
    const acquisition = parseFloat(acquisitionCost);
    const disposal = parseFloat(disposalPrice);
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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">취득세/양도세 계산기</h1>
            <p className="text-lg text-gray-600">
              부동산 취득세와 양도소득세를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  부동산 유형
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  placeholder="예: 500000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  취득가액 (원)
                </label>
                <input
                  type="number"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value)}
                  placeholder="예: 400000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양도가액 (원)
                </label>
                <input
                  type="number"
                  value={disposalPrice}
                  onChange={(e) => setDisposalPrice(e.target.value)}
                  placeholder="예: 600000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFirstHouse" className="text-sm font-medium text-gray-700">
                      첫 주택 여부 (주택 양도소득세 감면 적용)
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateTax}
                className="flex-1 text-white"
                style={{backgroundColor: '#003366'}}
              >
                계산하기
              </Button>
              <Button
                onClick={resetCalculator}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                초기화
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">취득세</p>
                    <p className="text-xl font-bold text-blue-600">{result.acquisitionTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도소득세</p>
                    <p className="text-xl font-bold text-green-600">{result.capitalGainsTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도차익</p>
                    <p className="text-xl font-bold text-orange-600">{result.capitalGains.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양도세율</p>
                    <p className="text-xl font-bold text-purple-600">{result.taxRate}%</p>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-sm text-gray-600">총 세금</p>
                    <p className="text-2xl font-bold text-red-600">{result.totalTax.toLocaleString()}원</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">취득세/양도세란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                취득세는 부동산을 취득할 때 지급하는 지방세이고, 양도소득세는 부동산을 양도할 때 
                발생하는 소득에 대해 부과되는 세금입니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">취득세율 (2024년 기준)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>주택: 6천만원 이하 1%, 1억5천만원 이하 2%, 3억원 이하 3%, 초과 4%</li>
                <li>토지: 4%</li>
                <li>상가/사무실: 2.5%</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">양도소득세율</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>주택 (첫 주택): 3년 이상 보유 6%, 3년 미만 12%</li>
                <li>주택 (기타): 1년 이상 보유 6%, 1년 미만 12%</li>
                <li>토지/상가: 1년 이상 보유 6%, 1년 미만 12%</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 부동산 정보 입력</h3>
                <p className="text-gray-700">
                  부동산 유형과 가액을 입력하세요. 취득세 계산에 사용됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 거래 정보 입력</h3>
                <p className="text-gray-700">
                  취득일, 양도일, 취득가액, 양도가액을 입력하세요. 양도소득세 계산에 사용됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 첫 주택 여부</h3>
                <p className="text-gray-700">
                  주택인 경우 첫 주택 여부를 선택하세요. 양도소득세 감면이 적용됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/jeonse-monthly-converter"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">전세/월세 전환 계산기</h3>
                <p className="text-sm text-gray-600">전세 월세 변환</p>
              </a>
              <a
                href="/interim-payment-interest-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">중도금 이자 계산기</h3>
                <p className="text-sm text-gray-600">중도금 이자 계산</p>
              </a>
              <a
                href="/real-estate-registration-cost-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">부동산 등기비용 계산기</h3>
                <p className="text-sm text-gray-600">등기비용 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 