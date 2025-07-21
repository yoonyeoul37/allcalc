"use client";

import { useState } from "react";
import Link from "next/link";
import { FaIndustry, FaCalculator, FaRuler, FaDollarSign, FaCubes, FaTruck, FaTools, FaHome, FaPaintBrush, FaHammer, FaExchangeAlt } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface ConcreteShape {
  id: string;
  name: string;
  formula: string;
  fields: string[];
}

interface MixRatio {
  id: string;
  name: string;
  cement: number;
  sand: number;
  gravel: number;
  water: number;
  strength: string;
}

export default function ConcreteCalculator() {
  const [calculationType, setCalculationType] = useState("volume");
  const [selectedShape, setSelectedShape] = useState("rectangle");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    radius: "",
    base: "",
    depth: ""
  });
  const [selectedMix, setSelectedMix] = useState("standard");
  const [unitPrice, setUnitPrice] = useState("80000");
  const [result, setResult] = useState<any>(null);

  // 콘크리트 형태별 계산 공식
  const shapes: ConcreteShape[] = [
    {
      id: "rectangle",
      name: "직사각형",
      formula: "길이 × 너비 × 높이",
      fields: ["length", "width", "height"]
    },
    {
      id: "cylinder",
      name: "원통형",
      formula: "π × 반지름² × 높이",
      fields: ["radius", "height"]
    },
    {
      id: "triangle",
      name: "삼각형",
      formula: "½ × 밑변 × 높이 × 깊이",
      fields: ["base", "height", "depth"]
    },
    {
      id: "slab",
      name: "평면",
      formula: "길이 × 너비 × 두께",
      fields: ["length", "width", "height"]
    }
  ];

  // 콘크리트 배합비
  const mixRatios: MixRatio[] = [
    {
      id: "standard",
      name: "일반 콘크리트",
      cement: 1,
      sand: 2,
      gravel: 4,
      water: 0.5,
      strength: "21MPa"
    },
    {
      id: "high_strength",
      name: "고강도 콘크리트",
      cement: 1,
      sand: 1.5,
      gravel: 3,
      water: 0.4,
      strength: "35MPa"
    },
    {
      id: "lightweight",
      name: "경량 콘크리트",
      cement: 1,
      sand: 2.5,
      gravel: 5,
      water: 0.6,
      strength: "15MPa"
    }
  ];

  const calculateVolume = () => {
    const l = parseFloat(dimensions.length) || 0;
    const w = parseFloat(dimensions.width) || 0;
    const h = parseFloat(dimensions.height) || 0;
    const r = parseFloat(dimensions.radius) || 0;
    const b = parseFloat(dimensions.base) || 0;
    const d = parseFloat(dimensions.depth) || 0;

    let volume = 0;
    let formula = "";

    switch (selectedShape) {
      case "rectangle":
        volume = l * w * h;
        formula = `${l} × ${w} × ${h} = ${volume.toFixed(2)} m³`;
        break;
      case "cylinder":
        volume = Math.PI * r * r * h;
        formula = `π × ${r}² × ${h} = ${volume.toFixed(2)} m³`;
        break;
      case "triangle":
        volume = 0.5 * b * h * d;
        formula = `½ × ${b} × ${h} × ${d} = ${volume.toFixed(2)} m³`;
        break;
      case "slab":
        volume = l * w * h;
        formula = `${l} × ${w} × ${h} = ${volume.toFixed(2)} m³`;
        break;
    }

    return { volume, formula };
  };

  const calculateMaterials = (volume: number) => {
    const selectedMixRatio = mixRatios.find(mix => mix.id === selectedMix);
    if (!selectedMixRatio) return null;

    const totalRatio = selectedMixRatio.cement + selectedMixRatio.sand + selectedMixRatio.gravel;
    const cementRatio = selectedMixRatio.cement / totalRatio;
    const sandRatio = selectedMixRatio.sand / totalRatio;
    const gravelRatio = selectedMixRatio.gravel / totalRatio;

    // 콘크리트 밀도 (kg/m³)
    const concreteDensity = 2400;
    const totalWeight = volume * concreteDensity;

    return {
      cement: (totalWeight * cementRatio).toFixed(1),
      sand: (totalWeight * sandRatio).toFixed(1),
      gravel: (totalWeight * gravelRatio).toFixed(1),
      water: (totalWeight * selectedMixRatio.water).toFixed(1),
      totalWeight: totalWeight.toFixed(1),
      strength: selectedMixRatio.strength
    };
  };

  const calculateCost = (volume: number) => {
    const price = parseFloat(unitPrice) || 0;
    const totalCost = volume * price;
    const cementCost = volume * 50000; // 시멘트 1m³당 50,000원
    const sandCost = volume * 15000;   // 모래 1m³당 15,000원
    const gravelCost = volume * 25000; // 자갈 1m³당 25,000원

    return {
      totalCost: totalCost.toFixed(0),
      cementCost: cementCost.toFixed(0),
      sandCost: sandCost.toFixed(0),
      gravelCost: gravelCost.toFixed(0),
      materialCost: (cementCost + sandCost + gravelCost).toFixed(0)
    };
  };

  const handleCalculate = () => {
    const { volume, formula } = calculateVolume();
    
    if (volume <= 0) {
      alert("올바른 치수를 입력해주세요.");
      return;
    }

    const materials = calculateMaterials(volume);
    const costs = calculateCost(volume);

    setResult({
      volume: volume.toFixed(2),
      formula,
      materials,
      costs,
      shape: shapes.find(s => s.id === selectedShape)?.name,
      mix: mixRatios.find(m => m.id === selectedMix)?.name
    });
  };

  const resetCalculator = () => {
    setDimensions({
      length: "",
      width: "",
      height: "",
      radius: "",
      base: "",
      depth: ""
    });
    setResult(null);
  };

  const getCurrentShape = () => shapes.find(s => s.id === selectedShape);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaIndustry className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">콘크리트 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">건설 현장용 콘크리트 부피 및 재료 계산</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setCalculationType("volume")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "volume"
                    ? "border-[#003366] bg-[#003366] text-white"
                    : "border-gray-200 hover:border-[#003366]"
                }`}
              >
                <FaCubes className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">부피 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("materials")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "materials"
                    ? "border-[#003366] bg-[#003366] text-white"
                    : "border-gray-200 hover:border-[#003366]"
                }`}
              >
                <FaTools className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">재료 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("cost")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "cost"
                    ? "border-[#003366] bg-[#003366] text-white"
                    : "border-gray-200 hover:border-[#003366]"
                }`}
              >
                <FaDollarSign className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">비용 계산</span>
              </button>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">치수 입력</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaRuler className="inline mr-2 text-black" />
                  콘크리트 형태
                </label>
                <select
                  value={selectedShape}
                  onChange={(e) => setSelectedShape(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {shapes.map(shape => (
                    <option key={shape.id} value={shape.id}>
                      {shape.name} ({shape.formula})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2 text-black" />
                  콘크리트 배합
                </label>
                <select
                  value={selectedMix}
                  onChange={(e) => setSelectedMix(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {mixRatios.map(mix => (
                    <option key={mix.id} value={mix.id}>
                      {mix.name} ({mix.strength})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 치수 입력 필드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {getCurrentShape()?.fields.includes("length") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">길이 (m)</label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              {getCurrentShape()?.fields.includes("width") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">너비 (m)</label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              {getCurrentShape()?.fields.includes("height") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">높이 (m)</label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              {getCurrentShape()?.fields.includes("radius") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">반지름 (m)</label>
                  <input
                    type="number"
                    value={dimensions.radius}
                    onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              {getCurrentShape()?.fields.includes("base") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">밑변 (m)</label>
                  <input
                    type="number"
                    value={dimensions.base}
                    onChange={(e) => setDimensions({...dimensions, base: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}

              {getCurrentShape()?.fields.includes("depth") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">깊이 (m)</label>
                  <input
                    type="number"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {calculationType === "cost" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="inline mr-2 text-black" />
                  콘크리트 단가 (원/m³)
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="80000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleCalculate}
                className="flex-1 py-3 px-6 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors font-semibold"
              >
                <FaCalculator className="inline mr-2" />
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">계산 결과</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">기본 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>콘크리트 형태:</span>
                      <span className="font-semibold">{result.shape}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>배합:</span>
                      <span className="font-semibold">{result.mix}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>부피:</span>
                      <span className="font-semibold">{result.volume} m³</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      {result.formula}
                    </div>
                  </div>
                </div>

                {calculationType === "materials" && result.materials && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-3">재료 필요량</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>시멘트:</span>
                        <span className="font-semibold">{result.materials.cement} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>모래:</span>
                        <span className="font-semibold">{result.materials.sand} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>자갈:</span>
                        <span className="font-semibold">{result.materials.gravel} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>물:</span>
                        <span className="font-semibold">{result.materials.water} L</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold text-black">
                          <span>총 무게:</span>
                          <span>{result.materials.totalWeight} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {calculationType === "cost" && result.costs && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-3">비용 분석</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>콘크리트 비용:</span>
                        <span className="font-semibold">{parseInt(result.costs.totalCost).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>시멘트 비용:</span>
                        <span className="font-semibold">{parseInt(result.costs.cementCost).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>모래 비용:</span>
                        <span className="font-semibold">{parseInt(result.costs.sandCost).toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>자갈 비용:</span>
                        <span className="font-semibold">{parseInt(result.costs.gravelCost).toLocaleString()}원</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold text-black">
                          <span>총 재료비:</span>
                          <span>{parseInt(result.costs.materialCost).toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
            <Link href="/tile-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaHome className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">타일 계산기</h4>
              <p className="text-xs text-gray-600">타일 계산</p>
            </Link>
            
            <Link href="/wallpaper-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaPaintBrush className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">도배 계산기</h4>
              <p className="text-xs text-gray-600">도배 계산</p>
            </Link>
            
            <Link href="/interior-estimate-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaHammer className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">인테리어 견적</h4>
              <p className="text-xs text-gray-600">견적 계산</p>
            </Link>
            
            <Link href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaExchangeAlt className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
              <p className="text-xs text-gray-600">단위 변환</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
