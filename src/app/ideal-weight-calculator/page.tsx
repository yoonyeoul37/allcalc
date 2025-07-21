"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWeight, FaBullseye, FaChartLine, FaHeart, FaHome, FaCalculator, FaUser, FaRuler, FaBalanceScale } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">이상체중 계산기</h1>
            <p className="text-lg text-gray-600">개인에게 가장 적합한 목표 체중을 찾아보세요</p>
          </div>

          {/* 이상체중 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-black" />
                기본 정보
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">키 (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">현재 체중 (kg)</label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateIdealWeight}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
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
              <div className="border border-gray-200 p-6 rounded-lg mt-6">
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
                    <div className="text-xl font-bold text-blue-600">{result.robinson} kg</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Miller 공식</div>
                    <div className="text-xl font-bold text-green-600">{result.miller} kg</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Devine 공식</div>
                    <div className="text-xl font-bold text-purple-600">{result.devine} kg</div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Hamwi 공식</div>
                    <div className="text-xl font-bold text-orange-600">{result.hamwi} kg</div>
                  </div>
                </div>

                {/* 평균 이상체중 */}
                <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                  <div className="text-sm text-gray-600 mb-2">평균 이상체중</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{result.averageIdealWeight} kg</div>
                  <div className="text-sm text-gray-600">
                    체중 차이: <span className={`font-semibold ${result.weightDifference > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {result.weightDifference > 0 ? '+' : ''}{result.weightDifference} kg
                    </span>
                  </div>
                </div>

                {/* 권장 체중 범위 */}
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">한국인 기준 권장 체중 범위</div>
                  <div className="text-lg font-bold text-gray-800">
                    {result.recommendedRange.min} ~ {result.recommendedRange.max} kg
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (BMI {result.idealBMIRange.min} ~ {result.idealBMIRange.max})
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">관련 계산기</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/bmi-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCalculator className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">BMI 계산기</h4>
                <p className="text-sm text-gray-600">체질량지수 계산</p>
              </Link>
              
              <Link href="/body-fat-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBalanceScale className="text-green-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">체지방률 계산기</h4>
                <p className="text-sm text-gray-600">체지방률 측정</p>
              </Link>
              
              <Link href="/calorie-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaChartLine className="text-orange-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">칼로리 계산기</h4>
                <p className="text-sm text-gray-600">일일 칼로리 계산</p>
              </Link>
              
              <Link href="/bmr-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHeart className="text-purple-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">기초대사량 계산기</h4>
                <p className="text-sm text-gray-600">BMR 계산</p>
              </Link>
            </div>
          </div>

          {/* 설명 및 주의사항 */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalculator className="text-black" />
                이상체중이란?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 개인의 키와 성별을 고려하여 가장 건강한 상태를 유지할 수 있는 체중입니다.</p>
                <p>• 여러 의학적 공식을 통해 계산되며, 체중 관리의 목표 설정에 도움이 됩니다.</p>
                <p>• 한국인 기준 BMI 18.5~23 범위가 가장 건강한 체중으로 권장됩니다.</p>
                <p>• 개인의 근육량, 체지방률, 연령 등을 고려하여 목표를 설정하세요.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeart className="text-black" />
                주의사항
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 이 계산기는 참고용이며, 전문의와 상담 후 목표를 설정하세요.</p>
                <p>• 급격한 체중 감량은 건강에 해로울 수 있습니다.</p>
                <p>• 운동과 균형 잡힌 식단을 병행하는 것이 중요합니다.</p>
                <p>• 개인의 건강 상태와 생활 패턴을 고려하여 목표를 조정하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
