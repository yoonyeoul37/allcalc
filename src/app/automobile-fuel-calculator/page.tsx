'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

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
    if (!fuelEfficiency || !distance || !fuelPrice) return;

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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">자동차 연비/유류비 계산기</h1>
            <p className="text-lg text-gray-600">
              연비, 주행거리, 연료 가격에 따른 유류비를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연비 (km/L)
                </label>
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  placeholder="예: 12.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연료 종류
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => handleFuelTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateFuelCost}
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

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">연료 소비량</p>
                    <p className="text-xl font-bold text-blue-600">{result.fuelConsumption}L</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 유류비</p>
                    <p className="text-xl font-bold text-blue-600">{result.totalCost.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">km당 비용</p>
                    <p className="text-xl font-bold text-blue-600">{result.costPerKm}원</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">연비란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                연비는 자동차가 1리터의 연료로 주행할 수 있는 거리를 의미합니다. 
                연비가 높을수록 연료 효율이 좋아 유류비를 절약할 수 있습니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">연비 개선 방법</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>적절한 공기압 유지</li>
                <li>불필요한 짐 제거</li>
                <li>급가속, 급제동 피하기</li>
                <li>적절한 속도 유지</li>
                <li>정기적인 엔진 오일 교체</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 연비 입력</h3>
                <p className="text-gray-700">
                  차량의 연비를 km/L 단위로 입력하세요. 예: 12.5km/L는 12.5로 입력
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 주행거리 입력</h3>
                <p className="text-gray-700">
                  계산하고자 하는 주행거리를 km 단위로 입력하세요. 예: 100km는 100으로 입력
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 연료 종류 및 가격</h3>
                <p className="text-gray-700">
                  사용하는 연료 종류를 선택하고, 현재 연료 가격을 입력하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/automobile-tax-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">자동차세 계산기</h3>
                <p className="text-sm text-gray-600">자동차세 계산</p>
              </a>
              <a
                href="/car-loan-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">자동차 대출 계산기</h3>
                <p className="text-sm text-gray-600">자동차 구매 대출 상환 계산</p>
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