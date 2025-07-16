"use client";

import { useState } from "react";
import { FaWeight, FaBullseye, FaChartLine, FaHeart } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface IdealWeightResult {
  robinson: number;
  miller: number;
  devine: number;
  hamwi: number;
  averageIdealWeight: number;
  currentBMI: number;
  idealBMIRange: { min: number; max: number };
  weightDifference: number;
  bmiCategory: string;
  recommendedRange: { min: number; max: number };
}

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<string>("male");
  const [height, setHeight] = useState<string>("");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [result, setResult] = useState<IdealWeightResult | null>(null);

  const calculateIdealWeight = () => {
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(currentWeight);
    const ageNum = parseFloat(age);

    if (!heightCm || !weightKg || !ageNum) return;

    const heightInches = heightCm / 2.54;

    // Robinson 공식 (1983)
    let robinson = 0;
    if (gender === "male") {
      robinson = 52 + 1.9 * (heightInches - 60);
    } else {
      robinson = 49 + 1.7 * (heightInches - 60);
    }

    // Miller 공식 (1983)
    let miller = 0;
    if (gender === "male") {
      miller = 56.2 + 1.41 * (heightInches - 60);
    } else {
      miller = 53.1 + 1.36 * (heightInches - 60);
    }

    // Devine 공식 (1974)
    let devine = 0;
    if (gender === "male") {
      devine = 50 + 2.3 * (heightInches - 60);
    } else {
      devine = 45.5 + 2.3 * (heightInches - 60);
    }

    // Hamwi 공식 (1964)
    let hamwi = 0;
    if (gender === "male") {
      hamwi = 48 + 2.7 * (heightInches - 60);
    } else {
      hamwi = 45.5 + 2.2 * (heightInches - 60);
    }

    // 평균 이상체중
    const averageIdealWeight = (robinson + miller + devine + hamwi) / 4;

    // 현재 BMI
    const currentBMI = weightKg / Math.pow(heightCm / 100, 2);

    // 한국인 기준 BMI 범위 (18.5-23)
    const idealBMIRange = { min: 18.5, max: 23 };
    
    // 권장 체중 범위 (한국인 기준)
    const recommendedRange = {
      min: Math.pow(heightCm / 100, 2) * idealBMIRange.min,
      max: Math.pow(heightCm / 100, 2) * idealBMIRange.max
    };

    // 체중 차이
    const weightDifference = weightKg - averageIdealWeight;

    // BMI 카테고리 (한국인 기준)
    let bmiCategory = "";
    if (currentBMI < 18.5) bmiCategory = "저체중";
    else if (currentBMI < 23) bmiCategory = "정상";
    else if (currentBMI < 25) bmiCategory = "과체중";
    else if (currentBMI < 30) bmiCategory = "경도비만";
    else bmiCategory = "고도비만";

    setResult({
      robinson: Math.round(robinson * 10) / 10,
      miller: Math.round(miller * 10) / 10,
      devine: Math.round(devine * 10) / 10,
      hamwi: Math.round(hamwi * 10) / 10,
      averageIdealWeight: Math.round(averageIdealWeight * 10) / 10,
      currentBMI: Math.round(currentBMI * 10) / 10,
      idealBMIRange,
      weightDifference: Math.round(weightDifference * 10) / 10,
      bmiCategory,
      recommendedRange: {
        min: Math.round(recommendedRange.min * 10) / 10,
        max: Math.round(recommendedRange.max * 10) / 10
      }
    });
  };

  const clear = () => {
    setGender("male");
    setHeight("");
    setCurrentWeight("");
    setAge("");
    setResult(null);
  };

  const getCategoryColor = (category: string) => {
    if (category === "저체중") return "text-blue-600";
    if (category === "정상") return "text-green-600";
    if (category === "과체중") return "text-yellow-600";
    if (category === "경도비만" || category === "고도비만") return "text-red-600";
    return "text-gray-600";
  };

  const getCategoryBg = (category: string) => {
    if (category === "저체중") return "bg-blue-50 border-blue-200";
    if (category === "정상") return "bg-green-50 border-green-200";
    if (category === "과체중") return "bg-yellow-50 border-yellow-200";
    if (category === "경도비만" || category === "고도비만") return "bg-red-50 border-red-200";
    return "border-gray-200";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">이상체중 계산기</h1>
            <p className="text-lg text-gray-600">개인에게 가장 적합한 목표 체중을 찾아보세요</p>
          </div>

          {/* 이상체중 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">키 (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 이상체중 설명 */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">이상체중이란?</h4>
              <p className="text-sm text-gray-600">
                개인의 키와 성별을 고려하여 가장 건강한 상태를 유지할 수 있는 체중입니다. 
                여러 의학적 공식을 통해 계산되며, 체중 관리의 목표 설정에 도움이 됩니다.
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateIdealWeight}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                이상체중 계산하기
              </button>
              <button
                onClick={clear}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">이상체중 계산 결과</h3>
                
                {/* 선택 옵션 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      {gender === "male" ? "남성" : "여성"} • {age}세 • {height}cm • 현재 {currentWeight}kg
                    </span>
                  </div>
                </div>

                {/* 현재 상태 */}
                <div className={`text-center p-4 border rounded-lg mb-6 ${getCategoryBg(result.bmiCategory)}`}>
                  <div className="text-sm text-gray-600 mb-1">현재 상태</div>
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    BMI {result.currentBMI}
                  </div>
                  <div className={`text-lg font-semibold ${getCategoryColor(result.bmiCategory)}`}>
                    {result.bmiCategory}
                  </div>
                </div>

                {/* 공식별 이상체중 */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Robinson 공식</div>
                    <div className="text-xl font-bold text-gray-800">
                      {result.robinson}kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1983년</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Miller 공식</div>
                    <div className="text-xl font-bold text-gray-800">
                      {result.miller}kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1983년</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Devine 공식</div>
                    <div className="text-xl font-bold text-gray-800">
                      {result.devine}kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1974년</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Hamwi 공식</div>
                    <div className="text-xl font-bold text-gray-800">
                      {result.hamwi}kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">1964년</div>
                  </div>
                </div>

                {/* 권장 체중 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg bg-blue-50">
                    <div className="text-sm text-gray-600 mb-1">평균 이상체중</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result.averageIdealWeight}kg
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      4가지 공식의 평균
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg bg-green-50">
                    <div className="text-sm text-gray-600 mb-1">한국인 권장범위</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.recommendedRange.min} ~ {result.recommendedRange.max}kg
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      BMI 18.5-23 기준
                    </div>
                  </div>
                </div>

                {/* 체중 차이 분석 */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3 text-center">체중 변화 분석</h4>
                  <div className="text-center">
                    {result.weightDifference > 0 ? (
                      <div>
                        <p className="text-lg">
                          현재 체중이 이상체중보다 <span className="font-bold text-red-600">{Math.abs(result.weightDifference)}kg 많습니다</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          건강한 감량을 위해 균형 잡힌 식단과 규칙적인 운동을 권장합니다.
                        </p>
                      </div>
                    ) : result.weightDifference < 0 ? (
                      <div>
                        <p className="text-lg">
                          현재 체중이 이상체중보다 <span className="font-bold text-blue-600">{Math.abs(result.weightDifference)}kg 적습니다</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          건강한 증량을 위해 충분한 영양 섭취와 근력 운동을 권장합니다.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg">
                          <span className="font-bold text-green-600">이상적인 체중입니다!</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          현재 상태를 유지하기 위해 건강한 생활습관을 계속 유지하세요.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🎯 목표 체중 달성</h3>
                    <p className="text-sm mb-3">개인 맞춤 다이어트 + 운동 플랜으로 건강하게!</p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      프로그램 보기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-gray-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">⚖️ 체중 관리 솔루션</h3>
                  <p className="text-gray-600 mb-3">AI 분석 + 전문가 상담으로 목표 체중 달성</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">개인 맞춤</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">무료 상담</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                    상담 신청하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 max-w-4xl">
              
              {/* 이상체중이란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">이상체중이란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    이상체중은 개인의 키, 성별, 나이를 고려하여 가장 건강한 상태를 유지할 수 있는 체중을 의미합니다. 
                    단순히 '보기 좋은' 체중이 아니라 건강한 삶을 영위할 수 있는 최적의 체중을 말합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    이상체중은 심혈관 질환, 당뇨병 등의 위험을 최소화하고 전반적인 건강 상태를 최적화할 수 있는 
                    체중 범위로, 개인의 체중 관리 목표 설정에 중요한 기준이 됩니다.
                  </p>
                </div>
              </section>

              {/* 계산 공식 설명 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">이상체중 계산 공식</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Robinson 공식 (1983)</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>남성:</strong> 52 + 1.9 × (키(인치) - 60)</p>
                      <p><strong>여성:</strong> 49 + 1.7 × (키(인치) - 60)</p>
                    </div>
                    <p className="text-gray-700">가장 널리 사용되는 공식 중 하나로 임상에서 많이 활용됩니다.</p>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Miller 공식 (1983)</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>남성:</strong> 56.2 + 1.41 × (키(인치) - 60)</p>
                      <p><strong>여성:</strong> 53.1 + 1.36 × (키(인치) - 60)</p>
                    </div>
                    <p className="text-gray-700">Robinson 공식을 개선하여 더 정확한 계산을 목표로 개발되었습니다.</p>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Devine 공식 (1974)</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>남성:</strong> 50 + 2.3 × (키(인치) - 60)</p>
                      <p><strong>여성:</strong> 45.5 + 2.3 × (키(인치) - 60)</p>
                    </div>
                    <p className="text-gray-700">약물 용량 계산을 위해 개발되었으나 이상체중 계산에도 널리 사용됩니다.</p>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Hamwi 공식 (1964)</h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>남성:</strong> 48 + 2.7 × (키(인치) - 60)</p>
                      <p><strong>여성:</strong> 45.5 + 2.2 × (키(인치) - 60)</p>
                    </div>
                    <p className="text-gray-700">당뇨병 환자의 칼로리 계산을 위해 개발된 공식으로 간단하고 실용적입니다.</p>
                  </div>
                </div>
              </section>

              {/* 광고 3: 정보 섹션 중간 */}
              <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-4">Google AdSense</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-semibold text-gray-800 mb-1">체중 관리 앱</h4>
                        <p className="text-sm text-gray-600 mb-2">목표 체중까지 단계별 관리</p>
                        <div className="text-blue-600 text-sm font-semibold">다운로드</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🥗</div>
                        <h4 className="font-semibold text-gray-800 mb-1">맞춤 식단</h4>
                        <p className="text-sm text-gray-600 mb-2">목표 체중 달성 식단</p>
                        <div className="text-green-600 text-sm font-semibold">주문하기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 한국인 vs 서구인 기준 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">한국인 vs 서구인 이상체중 기준</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    위의 공식들은 모두 서구인을 기준으로 개발되어 한국인에게는 약간의 조정이 필요할 수 있습니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">서구 기준 특성</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• 상대적으로 근육량이 많음</li>
                        <li>• 골밀도가 높음</li>
                        <li>• 체격이 상대적으로 큼</li>
                        <li>• BMI 18.5-25 정상 범위</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">한국인 권장 기준</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• BMI 18.5-23을 정상 범위로 적용</li>
                        <li>• 서구 기준보다 약간 낮은 체중이 적절</li>
                        <li>• 내장지방 축적 경향 고려</li>
                        <li>• 대한비만학회 기준 적용</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 border border-gray-200 rounded">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Tip:</strong> 계산된 이상체중을 참고하되, 한국인 권장범위(BMI 18.5-23)를 함께 고려하는 것이 좋습니다.
                    </p>
                  </div>
                </div>
              </section>

              {/* 체중 관리 가이드 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">건강한 체중 관리 가이드</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 감량이 필요한 경우</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 주당 0.5-1kg씩 천천히 감량</li>
                      <li>• 균형 잡힌 저칼로리 식단</li>
                      <li>• 유산소 + 근력 운동 병행</li>
                      <li>• 충분한 단백질 섭취</li>
                      <li>• 수분 섭취량 늘리기</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 유지가 필요한 경우</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 현재 식단과 운동 패턴 유지</li>
                      <li>• 규칙적인 체중 체크</li>
                      <li>• 근육량 유지에 집중</li>
                      <li>• 스트레스 관리</li>
                      <li>• 충분한 수면</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 증량이 필요한 경우</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 주당 0.5kg씩 점진적 증량</li>
                      <li>• 칼로리 밀도 높은 건강 식품</li>
                      <li>• 근력 운동 중심</li>
                      <li>• 식사 횟수 늘리기</li>
                      <li>• 양질의 지방 섭취</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 주의사항 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">이상체중 계산 시 주의사항</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>개인차 고려:</strong> 근육량, 골밀도, 체형에 따라 적정 체중이 다를 수 있습니다.</li>
                    <li>• <strong>나이 고려:</strong> 나이가 들수록 약간의 체중 증가는 자연스러운 현상입니다.</li>
                    <li>• <strong>건강 상태:</strong> 만성질환이 있는 경우 의사와 상담하여 목표를 정하세요.</li>
                    <li>• <strong>체성분 중요:</strong> 단순 체중보다 근육량과 체지방률이 더 중요합니다.</li>
                    <li>• <strong>점진적 변화:</strong> 급격한 체중 변화는 건강에 해로울 수 있습니다.</li>
                  </ul>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <a href="/bmi-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaWeight className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMI 계산기</h3>
                    <p className="text-sm text-gray-600">체질량지수 계산</p>
                  </a>
                  <a href="/calorie-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaBullseye className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">칼로리 계산기</h3>
                    <p className="text-sm text-gray-600">목표별 칼로리 계산</p>
                  </a>
                  <a href="/body-fat-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaHeart className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">체지방 계산기</h3>
                    <p className="text-sm text-gray-600">체지방률 측정</p>
                  </a>
                  <a href="/bmr-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-gray-300 cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMR 계산기</h3>
                    <p className="text-sm text-gray-600">기초대사율 계산</p>
                  </a>
                </div>
              </section>
            </div>
            
            {/* 사이드바 광고 (데스크톱 전용) */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-8 space-y-6">
                {/* 광고 4: 사이드바 배너 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-3">추천 광고</div>
                    <div className="bg-gradient-to-b from-blue-400 to-green-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🎯 목표 달성</h4>
                      <p className="text-sm mb-3">체중 관리 전문 프로그램</p>
                      <button className="bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        시작하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 광고 5: 네이티브 광고 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-4">스폰서</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        ⚖️
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">체중계</h5>
                        <p className="text-xs text-gray-600">스마트 체성분 측정</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🥗
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">다이어트 식단</h5>
                        <p className="text-xs text-gray-600">개인 맞춤 배송</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        💊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">건강 보조제</h5>
                        <p className="text-xs text-gray-600">체중 관리 도움</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-6 text-sm text-gray-700 leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            이 이상체중 계산기는 Robinson, Miller, Devine, Hamwi 공식을 기반으로 계산됩니다. 
            이 공식들은 서구인을 기준으로 개발되었으므로 한국인에게는 BMI 18.5-23 범위를 함께 고려하는 것이 좋습니다. 
            정확한 체중 관리를 위해서는 전문가와 상담하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 