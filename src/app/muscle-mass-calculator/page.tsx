"use client";

import { useState } from "react";
import Link from "next/link";
import { FaDumbbell, FaUserCheck, FaChartLine, FaHeart, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaWeight, FaRuler, FaUser, FaBaby, FaCalendarAlt, FaCalculator } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface MuscleMassResult {
  muscleMass: number;
  muscleMassIndex: number;
  muscleMassPercentage: number;
  category: string;
  idealRange: string;
  leanBodyMass: number;
}

export default function MuscleMassCalculator() {
  const [gender, setGender] = useState<string>("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [result, setResult] = useState<MuscleMassResult | null>(null);

  const calculateMuscleMass = () => {
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(weight);
    const bodyFatPercent = parseFloat(bodyFatPercentage);
    const ageNum = parseFloat(age);

    if (!heightCm || !weightKg || !bodyFatPercent || !ageNum) return;

    // 체지방량 계산
    const bodyFatMass = (weightKg * bodyFatPercent) / 100;
    
    // 제지방량 (Lean Body Mass) 계산
    const leanBodyMass = weightKg - bodyFatMass;
    
    // 근육량 추정 (제지방량의 약 50-60%가 근육)
    const muscleMass = leanBodyMass * 0.55; // 평균값 사용
    
    // 근육량 지수 (키 대비 근육량)
    const muscleMassIndex = muscleMass / Math.pow(heightCm / 100, 2);
    
    // 근육량 비율
    const muscleMassPercentage = (muscleMass / weightKg) * 100;

    // 근육량 카테고리 분류
    let category = "";
    let idealRange = "";

    if (gender === "male") {
      idealRange = "40-50%";
      if (muscleMassPercentage < 35) category = "근육량 부족";
      else if (muscleMassPercentage < 42) category = "평균 수준";
      else if (muscleMassPercentage < 50) category = "좋은 수준";
      else if (muscleMassPercentage < 55) category = "운동선수 수준";
      else category = "매우 높음";
    } else {
      idealRange = "30-40%";
      if (muscleMassPercentage < 25) category = "근육량 부족";
      else if (muscleMassPercentage < 32) category = "평균 수준";
      else if (muscleMassPercentage < 40) category = "좋은 수준";
      else if (muscleMassPercentage < 45) category = "운동선수 수준";
      else category = "매우 높음";
    }

    setResult({
      muscleMass: Math.round(muscleMass * 10) / 10,
      muscleMassIndex: Math.round(muscleMassIndex * 10) / 10,
      muscleMassPercentage: Math.round(muscleMassPercentage * 10) / 10,
      category,
      idealRange,
      leanBodyMass: Math.round(leanBodyMass * 10) / 10
    });
  };

  const clear = () => {
    setGender("male");
    setHeight("");
    setWeight("");
    setBodyFatPercentage("");
    setAge("");
    setResult(null);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes("부족")) return "text-red-600";
    if (category.includes("평균")) return "text-yellow-600";
    if (category.includes("좋은")) return "text-green-600";
    if (category.includes("운동선수")) return "text-blue-600";
    if (category.includes("매우 높음")) return "text-purple-600";
    return "text-gray-600";
  };

  const getCategoryBg = (category: string) => {
    if (category.includes("부족")) return "bg-red-50 border-red-200";
    if (category.includes("평균")) return "bg-yellow-50 border-yellow-200";
    if (category.includes("좋은")) return "bg-green-50 border-green-200";
    if (category.includes("운동선수")) return "bg-blue-50 border-blue-200";
    if (category.includes("매우 높음")) return "bg-purple-50 border-purple-200";
    return "border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaDumbbell className="mr-3 text-black" />
              근육량 계산기
            </h1>
            <p className="text-lg text-gray-600">체지방률을 이용한 근육량 추정 계산기</p>
          </div>

          {/* 근육량 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-black" />
                    성별
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-black" />
                    나이
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRuler className="inline mr-2 text-black" />
                    키 (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaWeight className="inline mr-2 text-black" />
                    체중 (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>
            </div>

            {/* 체지방률 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">체지방률</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaWeight className="inline mr-2 text-black" />
                    체지방률 (%)
                  </label>
                  <input
                    type="number"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">체지방률 계산기에서 측정한 값</p>
                </div>
                <div className="text-sm text-gray-600 pt-6">
                  <p><strong>체지방률 측정 방법:</strong></p>
                  <p>• 줄자 측정 (Navy Method)</p>
                  <p>• 인바디 검사</p>
                  <p>• 캘리퍼 측정</p>
                  <p>• 체지방률 계산기 사용</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateMuscleMass}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                <FaCalculator className="mr-2 inline" />
                근육량 계산하기
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
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">근육량 계산 결과</h3>
                
                {/* 카테고리 표시 */}
                <div className={`mb-6 p-4 rounded-lg border ${getCategoryBg(result.category)}`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">현재 근육량</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result.muscleMass}kg
                    </div>
                    <div className={`text-lg font-semibold mt-2 ${getCategoryColor(result.category)}`}>
                      {result.category}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      권장 범위: {result.idealRange}
                    </div>
                  </div>
                </div>

                {/* 상세 결과 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">근육량 비율</div>
                    <div className="text-2xl font-bold text-black">
                      {result.muscleMassPercentage}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      체중 대비 근육량
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">근육량 지수</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.muscleMassIndex}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      키 대비 근육량
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">제지방량</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.leanBodyMass}kg
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      체지방 제외 무게
                    </div>
                  </div>
                </div>

                {/* 근육량 가이드 */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-3">근육량 가이드</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">남성 기준</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>근육량 부족:</span>
                          <span className="font-semibold text-red-600">&lt;35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>평균 수준:</span>
                          <span className="font-semibold text-yellow-600">35-42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>좋은 수준:</span>
                          <span className="font-semibold text-green-600">42-50%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>운동선수 수준:</span>
                          <span className="font-semibold text-blue-600">50-55%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>매우 높음:</span>
                          <span className="font-semibold text-purple-600">&gt;55%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">여성 기준</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>근육량 부족:</span>
                          <span className="font-semibold text-red-600">&lt;25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>평균 수준:</span>
                          <span className="font-semibold text-yellow-600">25-32%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>좋은 수준:</span>
                          <span className="font-semibold text-green-600">32-40%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>운동선수 수준:</span>
                          <span className="font-semibold text-blue-600">40-45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>매우 높음:</span>
                          <span className="font-semibold text-purple-600">&gt;45%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 설명 및 주의사항 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-black" />
              근육량 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">💪 근육량 계산 방법</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>제지방량 계산:</strong> 체중 - 체지방량</li>
                  <li><strong>근육량 추정:</strong> 제지방량 × 0.55 (평균값)</li>
                  <li><strong>근육량 지수:</strong> 근육량 ÷ (키/100)²</li>
                  <li><strong>근육량 비율:</strong> (근육량 ÷ 체중) × 100</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📊 근육량의 중요성</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>기초대사율:</strong> 근육량이 많을수록 기초대사율이 높아집니다</li>
                  <li><strong>체중 관리:</strong> 근육량 증가로 체지방 감량 효과</li>
                  <li><strong>건강:</strong> 근육량은 전반적인 건강 상태를 반영합니다</li>
                  <li><strong>노화 방지:</strong> 근육량 유지가 노화 방지에 중요합니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">주의사항</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 이 계산기는 추정치이며, 정확한 측정을 위해서는 인바디 검사가 필요합니다</li>
                  <li>• 체지방률 측정의 정확도가 근육량 계산의 정확도를 좌우합니다</li>
                  <li>• 개인차이가 있을 수 있으므로 참고용으로만 사용하세요</li>
                  <li>• 정확한 근육량 측정을 위해서는 전문가와 상담하시기 바랍니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/body-fat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaWeight className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">체지방률 계산기</h4>
                <p className="text-xs text-gray-600">체지방 측정</p>
              </Link>
              
              <Link href="/bmi-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMI 계산기</h4>
                <p className="text-xs text-gray-600">체질량지수</p>
              </Link>
              
              <Link href="/calorie-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-red-300 cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">칼로리 계산기</h4>
                <p className="text-xs text-gray-600">일일 칼로리</p>
              </Link>
              
              <Link href="/bmr-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">기초대사량 계산기</h4>
                <p className="text-xs text-gray-600">BMR 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AllCalc</h3>
              <p className="text-gray-300 text-sm">
                다양한 계산기를 한 곳에서 편리하게 이용하세요.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">홈</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-white">대출 계산기</Link></li>
                <li><Link href="/investment-calculator" className="hover:text-white">투자 계산기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">계산기 카테고리</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">금융 계산기</Link></li>
                <li><Link href="/" className="hover:text-white">건강 계산기</Link></li>
                <li><Link href="/" className="hover:text-white">학업 계산기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <p className="text-gray-300 text-sm">
                문의사항이 있으시면 언제든 연락주세요.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 AllCalc. All rights reserved. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
