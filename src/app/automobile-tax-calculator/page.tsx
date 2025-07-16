'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function AutomobileTaxCalculator() {
  const [engineSize, setEngineSize] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState<number | null>(null);

  const calculateTax = () => {
    if (!engineSize || !year) return;

    const size = parseFloat(engineSize);
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(year);
    
    // 한국 자동차세 기준 (2024년 기준)
    let baseTax = 0;
    
    if (fuelType === 'gasoline') {
      if (size <= 1000) baseTax = 80000;
      else if (size <= 1600) baseTax = 140000;
      else if (size <= 2000) baseTax = 200000;
      else if (size <= 3000) baseTax = 350000;
      else baseTax = 460000;
    } else if (fuelType === 'diesel') {
      if (size <= 1000) baseTax = 100000;
      else if (size <= 1600) baseTax = 180000;
      else if (size <= 2000) baseTax = 260000;
      else if (size <= 3000) baseTax = 450000;
      else baseTax = 580000;
    } else if (fuelType === 'lpg') {
      if (size <= 1000) baseTax = 60000;
      else if (size <= 1600) baseTax = 100000;
      else if (size <= 2000) baseTax = 140000;
      else if (size <= 3000) baseTax = 240000;
      else baseTax = 320000;
    } else if (fuelType === 'electric') {
      baseTax = 50000; // 전기차는 세금 감면
    }

    // 연식에 따른 감면
    let ageDiscount = 1;
    if (age >= 10) ageDiscount = 0.5;
    else if (age >= 7) ageDiscount = 0.7;
    else if (age >= 5) ageDiscount = 0.8;
    else if (age >= 3) ageDiscount = 0.9;

    const finalTax = Math.round(baseTax * ageDiscount);
    setResult(finalTax);
  };

  const resetCalculator = () => {
    setEngineSize('');
    setYear('');
    setFuelType('gasoline');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">자동차세 계산기</h1>
            <p className="text-lg text-gray-600">
              배기량, 연식, 연료 종류에 따른 한국 자동차세를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배기량 (cc)
                </label>
                <input
                  type="number"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  placeholder="예: 1600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제조년도
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="예: 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연료 종류
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gasoline">휘발유</option>
                  <option value="diesel">경유</option>
                  <option value="lpg">LPG</option>
                  <option value="electric">전기</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateTax}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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

            {result !== null && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">계산 결과</h3>
                <p className="text-2xl font-bold text-blue-600">
                  연간 자동차세: {result.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  * 실제 세금은 지역에 따라 차이가 있을 수 있습니다.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">자동차세란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                자동차세는 자동차 소유자에게 부과되는 지방세입니다. 배기량, 연식, 연료 종류에 따라 
                세율이 달라지며, 전기차나 하이브리드차는 친환경 차량으로 분류되어 세금 감면을 받을 수 있습니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">세금 계산 기준</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>배기량이 클수록 세금이 높아집니다</li>
                <li>경유차는 휘발유차보다 세금이 높습니다</li>
                <li>전기차는 친환경 차량으로 세금 감면을 받습니다</li>
                <li>차량 연식이 오래될수록 세금이 감면됩니다</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 배기량 입력</h3>
                <p className="text-gray-700">
                  차량의 배기량을 cc 단위로 입력하세요. 예: 1600cc는 1600으로 입력
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 제조년도 입력</h3>
                <p className="text-gray-700">
                  차량의 제조년도를 입력하세요. 예: 2020년식은 2020으로 입력
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 연료 종류 선택</h3>
                <p className="text-gray-700">
                  차량의 연료 종류를 선택하세요. 전기차는 친환경 차량으로 분류됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/car-loan-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">자동차 대출 계산기</h3>
                <p className="text-sm text-gray-600">자동차 구매 대출 상환 계산</p>
              </a>
              <a
                href="/automobile-fuel-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">자동차 연비/유류비 계산기</h3>
                <p className="text-sm text-gray-600">연비 및 유류비 계산</p>
              </a>
              <a
                href="/acquisition-transfer-tax-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">자동차 취득세/등록세 계산기</h3>
                <p className="text-sm text-gray-600">차량 구매 시 부과되는 세금 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 