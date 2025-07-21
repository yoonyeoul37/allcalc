"use client";

import { useState } from "react";
import Link from "next/link";
import { FaExchangeAlt, FaRuler, FaWeight, FaThermometerHalf, FaClock, FaCalculator, FaDollarSign, FaIndustry, FaPaintBrush, FaHome, FaHammer } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface ConversionUnit {
  name: string;
  value: number;
  symbol: string;
}

interface ConversionType {
  id: string;
  name: string;
  icon: any;
  units: ConversionUnit[];
  convert: (value: number, fromUnit: ConversionUnit, toUnit: ConversionUnit) => number;
}

export default function UnitConverter() {
  const [activeTab, setActiveTab] = useState("length");
  const [fromValue, setFromValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<ConversionUnit | null>(null);
  const [toUnit, setToUnit] = useState<ConversionUnit | null>(null);
  const [result, setResult] = useState<number | null>(null);

  // 길이 변환
  const lengthUnits: ConversionUnit[] = [
    { name: "미터", value: 1, symbol: "m" },
    { name: "킬로미터", value: 1000, symbol: "km" },
    { name: "센티미터", value: 0.01, symbol: "cm" },
    { name: "밀리미터", value: 0.001, symbol: "mm" },
    { name: "마일", value: 1609.344, symbol: "mi" },
    { name: "야드", value: 0.9144, symbol: "yd" },
    { name: "피트", value: 0.3048, symbol: "ft" },
    { name: "인치", value: 0.0254, symbol: "in" }
  ];

  // 무게 변환
  const weightUnits: ConversionUnit[] = [
    { name: "킬로그램", value: 1, symbol: "kg" },
    { name: "그램", value: 0.001, symbol: "g" },
    { name: "밀리그램", value: 0.000001, symbol: "mg" },
    { name: "톤", value: 1000, symbol: "t" },
    { name: "파운드", value: 0.45359237, symbol: "lb" },
    { name: "온스", value: 0.028349523125, symbol: "oz" }
  ];

  // 온도 변환
  const temperatureUnits: ConversionUnit[] = [
    { name: "섭씨", value: 0, symbol: "°C" },
    { name: "화씨", value: 1, symbol: "°F" },
    { name: "켈빈", value: 2, symbol: "K" }
  ];

  // 시간 변환
  const timeUnits: ConversionUnit[] = [
    { name: "초", value: 1, symbol: "s" },
    { name: "분", value: 60, symbol: "min" },
    { name: "시간", value: 3600, symbol: "h" },
    { name: "일", value: 86400, symbol: "d" },
    { name: "주", value: 604800, symbol: "wk" },
    { name: "월", value: 2592000, symbol: "mo" },
    { name: "년", value: 31536000, symbol: "yr" }
  ];

  // 진수 변환
  const numberSystems = [
    { name: "2진수", base: 2, symbol: "bin" },
    { name: "8진수", base: 8, symbol: "oct" },
    { name: "10진수", base: 10, symbol: "dec" },
    { name: "16진수", base: 16, symbol: "hex" }
  ];

  // 통화 변환 (기본 환율)
  const currencyUnits: ConversionUnit[] = [
    { name: "원", value: 1, symbol: "KRW" },
    { name: "달러", value: 0.00075, symbol: "USD" },
    { name: "엔", value: 0.11, symbol: "JPY" },
    { name: "유로", value: 0.00069, symbol: "EUR" },
    { name: "위안", value: 0.0054, symbol: "CNY" }
  ];

  const conversionTypes: ConversionType[] = [
    {
      id: "length",
      name: "길이",
      icon: FaRuler,
      units: lengthUnits,
      convert: (value, from, to) => (value * from.value) / to.value
    },
    {
      id: "weight",
      name: "무게",
      icon: FaWeight,
      units: weightUnits,
      convert: (value, from, to) => (value * from.value) / to.value
    },
    {
      id: "temperature",
      name: "온도",
      icon: FaThermometerHalf,
      units: temperatureUnits,
      convert: (value, from, to) => {
        // 온도 변환은 특별한 공식 필요
        let celsius = value;
        if (from.symbol === "°F") {
          celsius = (value - 32) * 5/9;
        } else if (from.symbol === "K") {
          celsius = value - 273.15;
        }
        
        if (to.symbol === "°F") {
          return celsius * 9/5 + 32;
        } else if (to.symbol === "K") {
          return celsius + 273.15;
        }
        return celsius;
      }
    },
    {
      id: "time",
      name: "시간",
      icon: FaClock,
      units: timeUnits,
      convert: (value, from, to) => (value * from.value) / to.value
    },
    {
      id: "currency",
      name: "통화",
      icon: FaDollarSign,
      units: currencyUnits,
      convert: (value, from, to) => (value * from.value) / to.value
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setFromValue("1");
    setFromUnit(null);
    setToUnit(null);
    setResult(null);
  };

  const handleConversion = () => {
    if (!fromValue || !fromUnit || !toUnit) return;
    
    const value = parseFloat(fromValue);
    if (isNaN(value)) return;

    const currentType = conversionTypes.find(type => type.id === activeTab);
    if (!currentType) return;

    const convertedValue = currentType.convert(value, fromUnit, toUnit);
    setResult(convertedValue);
  };

  const handleFromUnitChange = (unit: ConversionUnit) => {
    setFromUnit(unit);
    if (toUnit) {
      handleConversion();
    }
  };

  const handleToUnitChange = (unit: ConversionUnit) => {
    setToUnit(unit);
    if (fromUnit) {
      handleConversion();
    }
  };

  const handleValueChange = (value: string) => {
    setFromValue(value);
    if (fromUnit && toUnit) {
      handleConversion();
    }
  };

  const currentType = conversionTypes.find(type => type.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaExchangeAlt className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">단위 변환기</h1>
            </div>
            <p className="text-lg text-gray-600">길이, 무게, 온도, 시간, 통화 등 다양한 단위 변환</p>
          </div>

          {/* 변환 타입 탭 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {conversionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTabChange(type.id)}
                  className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                    activeTab === type.id
                      ? "border-[#003366] bg-[#003366] text-white"
                      : "border-gray-200 hover:border-[#003366]"
                  }`}
                >
                  <type.icon className="mr-2" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* 변환 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {currentType?.name} 변환
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 입력 값 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">값</label>
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="변환할 값 입력"
                />
              </div>

              {/* 변환 버튼 */}
              <div className="flex justify-center">
                <div className="bg-[#003366] p-3 rounded-full">
                  <FaExchangeAlt className="text-2xl text-white" />
                </div>
              </div>

              {/* 결과 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">결과</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  {result !== null ? result.toFixed(6).replace(/\.?0+$/, '') : "변환 결과"}
                </div>
              </div>
            </div>

            {/* 단위 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">변환 전 단위</label>
                <select
                  value={fromUnit?.symbol || ""}
                  onChange={(e) => {
                    const unit = currentType?.units.find(u => u.symbol === e.target.value);
                    if (unit) handleFromUnitChange(unit);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="">단위 선택</option>
                  {currentType?.units.map((unit) => (
                    <option key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">변환 후 단위</label>
                <select
                  value={toUnit?.symbol || ""}
                  onChange={(e) => {
                    const unit = currentType?.units.find(u => u.symbol === e.target.value);
                    if (unit) handleToUnitChange(unit);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="">단위 선택</option>
                  {currentType?.units.map((unit) => (
                    <option key={unit.symbol} value={unit.symbol}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 변환 결과 상세 */}
            {result !== null && fromUnit && toUnit && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">
                    {fromValue} {fromUnit.symbol} = {result.toFixed(6).replace(/\.?0+$/, '')} {toUnit.symbol}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {fromUnit.name} → {toUnit.name} 변환
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 진수 변환기 (특별 섹션) */}
          {activeTab === "number" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">진수 변환</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">입력 진수</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    {numberSystems.map((sys) => (
                      <option key={sys.base} value={sys.base}>
                        {sys.name} ({sys.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">출력 진수</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    {numberSystems.map((sys) => (
                      <option key={sys.base} value={sys.base}>
                        {sys.name} ({sys.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 사용 가이드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">사용 방법</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>변환 종류 선택:</strong> 상단 탭에서 원하는 변환 종류를 선택하세요.</p>
              <p>• <strong>값 입력:</strong> 변환하고 싶은 값을 입력하세요.</p>
              <p>• <strong>단위 선택:</strong> 변환할 단위와 변환될 단위를 선택하세요.</p>
              <p>• <strong>자동 변환:</strong> 단위를 선택하면 자동으로 변환 결과가 표시됩니다.</p>
              <p>• <strong>정확도:</strong> 소수점 6자리까지 표시되며, 불필요한 0은 자동으로 제거됩니다.</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/concrete-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaIndustry className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">콘크리트 계산기</h4>
                <p className="text-xs text-gray-600">콘크리트 계산</p>
              </Link>
              
              <Link href="/wallpaper-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPaintBrush className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">도배 계산기</h4>
                <p className="text-xs text-gray-600">도배 계산</p>
              </Link>
              
              <Link href="/tile-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">타일 계산기</h4>
                <p className="text-xs text-gray-600">타일 계산</p>
              </Link>
              
              <Link href="/interior-estimate-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHammer className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">인테리어 견적</h4>
                <p className="text-xs text-gray-600">견적 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
