"use client";

import { useState } from "react";
import { FaIndustry, FaCalculator, FaRuler, FaDollarSign, FaCubes, FaTruck, FaTools } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaIndustry className="text-4xl text-gray-600 mr-3" />
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
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaCubes className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">부피 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("materials")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "materials"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <FaTools className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">재료 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("cost")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "cost"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 hover:border-yellow-300"
                }`}
              >
                <FaDollarSign className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">비용 계산</span>
              </button>
            </div>
          </div>

          {/* 형태 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">콘크리트 형태 선택</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedShape === shape.id
                      ? "border-gray-600 bg-gray-100 text-gray-800"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold mb-1">{shape.name}</div>
                  <div className="text-xs text-gray-600">{shape.formula}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 치수 입력 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">치수 입력</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedShape === "rectangle" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">길이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">너비 (m)</label>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">높이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </>
              )}

              {selectedShape === "cylinder" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">반지름 (m)</label>
                    <input
                      type="number"
                      value={dimensions.radius}
                      onChange={(e) => setDimensions({...dimensions, radius: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">높이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </>
              )}

              {selectedShape === "triangle" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">밑변 (m)</label>
                    <input
                      type="number"
                      value={dimensions.base}
                      onChange={(e) => setDimensions({...dimensions, base: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">높이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">깊이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.depth}
                      onChange={(e) => setDimensions({...dimensions, depth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </>
              )}

              {selectedShape === "slab" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">길이 (m)</label>
                    <input
                      type="number"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">너비 (m)</label>
                    <input
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">두께 (m)</label>
                    <input
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCalculate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
            </div>
          </div>

          {/* 배합비 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">콘크리트 배합비 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mixRatios.map((mix) => (
                <button
                  key={mix.id}
                  onClick={() => setSelectedMix(mix.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMix === mix.id
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="font-semibold mb-1">{mix.name}</div>
                  <div className="text-sm text-gray-600">강도: {mix.strength}</div>
                  <div className="text-xs text-gray-500">
                    시멘트:모래:자갈 = {mix.cement}:{mix.sand}:{mix.gravel}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 단가 설정 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">콘크리트 단가 설정</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">1m³당 단가 (원)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">계산 결과</h3>
              
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{result.volume} m³</div>
                    <div className="text-sm text-gray-600">콘크리트 부피</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">{result.shape}</div>
                    <div className="text-sm text-gray-600">형태</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">{result.mix}</div>
                    <div className="text-sm text-gray-600">배합비</div>
                  </div>
                </div>

                {/* 계산 공식 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">계산 공식</h4>
                  <p className="text-gray-600">{result.formula}</p>
                </div>

                {/* 재료 계산 */}
                {result.materials && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">필요 재료 (kg)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-orange-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-orange-600">{result.materials.cement}</div>
                        <div className="text-sm text-gray-600">시멘트</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-yellow-600">{result.materials.sand}</div>
                        <div className="text-sm text-gray-600">모래</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-gray-600">{result.materials.gravel}</div>
                        <div className="text-sm text-gray-600">자갈</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <div className="text-lg font-bold text-blue-600">{result.materials.water}</div>
                        <div className="text-sm text-gray-600">물</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-sm text-gray-600">총 무게: {result.materials.totalWeight} kg</span>
                    </div>
                  </div>
                )}

                {/* 비용 계산 */}
                {result.costs && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">비용 계산 (원)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{Number(result.costs.totalCost).toLocaleString()}</div>
                        <div className="text-sm text-gray-600">총 콘크리트 비용</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{Number(result.costs.materialCost).toLocaleString()}</div>
                        <div className="text-sm text-gray-600">재료비 (시멘트+모래+자갈)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법 안내</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>부피 계산:</strong> 콘크리트 형태와 치수를 입력하여 필요한 콘크리트 양을 계산합니다.</p>
              <p>• <strong>재료 계산:</strong> 콘크리트 부피에 따른 시멘트, 모래, 자갈, 물의 필요량을 계산합니다.</p>
              <p>• <strong>비용 계산:</strong> 콘크리트 양과 단가를 바탕으로 총 비용을 계산합니다.</p>
              <p>• <strong>배합비:</strong> 일반 콘크리트(21MPa), 고강도 콘크리트(35MPa), 경량 콘크리트(15MPa) 중 선택</p>
              <p>• <strong>단가:</strong> 지역과 콘크리트 종류에 따라 1m³당 60,000~100,000원 정도</p>
            </div>
          </div>

          {/* 관련 계산기 링크 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/triangle-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">삼각형 계산기</h4>
                <p className="text-xs text-gray-600">면적 계산</p>
              </a>
              
              <a href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">고급 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 