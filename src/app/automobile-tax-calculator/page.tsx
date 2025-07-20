"use client";

import { useState } from 'react';
import { FaCalculator, FaCar, FaMoneyBillWave, FaGasPump, FaShieldAlt, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function AutomobileTaxCalculator() {
  const [engineSize, setEngineSize] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState<number | null>(null);

  const calculateTax = () => {
    if (!engineSize || !year) {
      alert('배기량과 제조년도를 입력해주세요.');
      return;
    }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaCar className="mr-3 text-[#003366]" />
              자동차세 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배기량 (cc)
                </label>
                <input
                  type="number"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  placeholder="예: 1600"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연료 종류
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="gasoline">휘발유</option>
                  <option value="diesel">경유</option>
                  <option value="lpg">LPG</option>
                  <option value="electric">전기</option>
                </select>
              </div>
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                초기화
              </button>
            </div>

            {result !== null && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <p className="text-2xl font-bold text-[#003366]">
                  연간 자동차세: {result.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  * 실제 세금은 지역에 따라 차이가 있을 수 있습니다.
                </p>
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
              <a href="/automobile-fuel-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGasPump className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 연비/유류비</h4>
                <p className="text-xs text-gray-600">연비 계산</p>
              </a>
              
              <a href="/car-loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 대출 계산기</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </a>
              
              <a href="/acquisition-transfer-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/등록세</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
              
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
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