"use client";

import { useState } from 'react';
import { FaCalculator, FaGasPump, FaCar, FaMoneyBillWave, FaShieldAlt, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function AutomobileFuelCalculator() {
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [fuelType, setFuelType] = useState('gasoline');
  const [result, setResult] = useState<{
    fuelConsumption: number;
    totalCost: number;
    costPerKm: number;
  } | null>(null);

  const calculateFuelCost = () => {
    if (!fuelEfficiency || !distance || !fuelPrice) {
      alert('연비, 주행거리, 연료 가격을 입력해주세요.');
      return;
    }

    const efficiency = parseFloat(fuelEfficiency); // km/L
    const dist = parseFloat(distance); // km
    const price = parseFloat(fuelPrice); // 원/L

    const fuelConsumption = dist / efficiency; // L
    const totalCost = fuelConsumption * price; // 원
    const costPerKm = totalCost / dist; // 원/km

    setResult({
      fuelConsumption: Math.round(fuelConsumption * 100) / 100,
      totalCost: Math.round(totalCost),
      costPerKm: Math.round(costPerKm * 100) / 100
    });
  };

  const resetCalculator = () => {
    setFuelEfficiency('');
    setDistance('');
    setFuelPrice('');
    setFuelType('gasoline');
    setResult(null);
  };

  const getDefaultFuelPrice = (type: string) => {
    switch (type) {
      case 'gasoline': return '1700';
      case 'diesel': return '1500';
      case 'lpg': return '900';
      default: return '1700';
    }
  };

  const handleFuelTypeChange = (type: string) => {
    setFuelType(type);
    setFuelPrice(getDefaultFuelPrice(type));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaGasPump className="mr-3 text-[#003366]" />
              자동차 연비/유류비 계산기
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연비 (km/L)
                </label>
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  placeholder="예: 12.5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주행거리 (km)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="예: 100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연료 종류
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => handleFuelTypeChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="gasoline">휘발유</option>
                  <option value="diesel">경유</option>
                  <option value="lpg">LPG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연료 가격 (원/L)
                </label>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="예: 1700"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateFuelCost}
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

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">연료 소비량</p>
                    <p className="text-xl font-bold text-[#003366]">{result.fuelConsumption}L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 유류비</p>
                    <p className="text-xl font-bold text-[#003366]">{result.totalCost.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">km당 비용</p>
                    <p className="text-xl font-bold text-[#003366]">{result.costPerKm}원</p>
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