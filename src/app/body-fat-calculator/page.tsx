"use client";

import { useState } from "react";
import { FaWeight, FaRuler, FaUserCheck, FaChartLine, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaUser, FaDumbbell, FaBaby, FaCalendarAlt, FaCalculator, FaHeart } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface BodyFatResult {
  navyMethod: number;
  ymcaMethod: number;
  averageBodyFat: number;
  category: string;
  idealRange: string;
  essentialFat: number;
}

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<string>("male");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [waist, setWaist] = useState<string>("");
  const [neck, setNeck] = useState<string>("");
  const [hip, setHip] = useState<string>(""); // 여성만 사용
  const [age, setAge] = useState<string>(""); // YMCA 방법용
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const calculateBodyFat = () => {
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(weight);
    const waistCm = parseFloat(waist);
    const neckCm = parseFloat(neck);
    const hipCm = parseFloat(hip);
    const ageNum = parseFloat(age);

    if (!heightCm || !weightKg || !waistCm || !neckCm || !ageNum) return;
    if (gender === "female" && !hipCm) return;

    // Navy Method (미군 공식)
    let navyBodyFat = 0;
    if (gender === "male") {
      navyBodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      navyBodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    // BMI 계산 (YMCA 방법용)
    const bmi = weightKg / Math.pow(heightCm / 100, 2);
    
    // YMCA Method (개선된 공식)
    let ymcaBodyFat = 0;
    if (gender === "male") {
      ymcaBodyFat = 1.20 * bmi + 0.23 * ageNum - 16.2;
    } else {
      ymcaBodyFat = 1.20 * bmi + 0.23 * ageNum - 5.4;
    }

    // 평균 체지방률
    const averageBodyFat = (navyBodyFat + ymcaBodyFat) / 2;

    // 체지방률 카테고리 분류
    let category = "";
    let idealRange = "";
    let essentialFat = 0;

    if (gender === "male") {
      essentialFat = 3;
      idealRange = "10-15%";
      if (averageBodyFat < 6) category = "필수지방 부족 (위험)";
      else if (averageBodyFat < 14) category = "운동선수 수준";
      else if (averageBodyFat < 18) category = "건강한 수준";
      else if (averageBodyFat < 25) category = "평균 수준";
      else category = "비만";
    } else {
      essentialFat = 12;
      idealRange = "16-24%";
      if (averageBodyFat < 14) category = "필수지방 부족 (위험)";
      else if (averageBodyFat < 21) category = "운동선수 수준";
      else if (averageBodyFat < 25) category = "건강한 수준";
      else if (averageBodyFat < 32) category = "평균 수준";
      else category = "비만";
    }

    setResult({
      navyMethod: Math.round(navyBodyFat * 10) / 10,
      ymcaMethod: Math.round(ymcaBodyFat * 10) / 10,
      averageBodyFat: Math.round(averageBodyFat * 10) / 10,
      category,
      idealRange,
      essentialFat
    });
  };

  const clear = () => {
    setGender("male");
    setHeight("");
    setWeight("");
    setWaist("");
    setNeck("");
    setHip("");
    setAge("");
    setResult(null);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes("위험")) return "text-red-600";
    if (category.includes("운동선수")) return "text-blue-600";
    if (category.includes("건강한")) return "text-green-600";
    if (category.includes("평균")) return "text-yellow-600";
    if (category.includes("비만")) return "text-red-600";
    return "text-gray-600";
  };

  const getCategoryBg = (category: string) => {
    if (category.includes("위험")) return "bg-red-50 border-red-200";
    if (category.includes("운동선수")) return "bg-blue-50 border-blue-200";
    if (category.includes("건강한")) return "bg-green-50 border-green-200";
    if (category.includes("평균")) return "bg-yellow-50 border-yellow-200";
    if (category.includes("비만")) return "bg-red-50 border-red-200";
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
              <FaWeight className="mr-3 text-black" />
              체지방률 계산기
            </h1>
            <p className="text-lg text-gray-600">신체 둘레 측정으로 정확한 체지방률을 계산해보세요</p>
          </div>

          {/* 체지방률 계산기 */}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 둘레 측정 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">둘레 측정 (정확한 측정이 중요합니다)</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRuler className="inline mr-2 text-black" />
                    허리둘레 (cm)
                  </label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="85"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">배꼽 위 가장 가는 부분</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRuler className="inline mr-2 text-black" />
                    목둘레 (cm)
                  </label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    placeholder="38"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">목의 가장 가는 부분</p>
                </div>
                {gender === "female" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaRuler className="inline mr-2 text-black" />
                      엉덩이둘레 (cm)
                    </label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      placeholder="95"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">엉덩이의 가장 넓은 부분</p>
                  </div>
                )}
              </div>
            </div>

            {/* 측정 가이드 */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">정확한 측정을 위한 가이드</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>허리:</strong> 숨을 내쉰 상태에서 배꼽 위 가장 가는 부분을 측정</p>
                <p>• <strong>목:</strong> 어깨 위 목의 가장 가는 부분을 측정</p>
                {gender === "female" && <p>• <strong>엉덩이:</strong> 엉덩이의 가장 넓은 부분을 측정</p>}
                <p>• 줄자는 수평으로 유지하고 너무 조이거나 느슨하지 않게 측정</p>
                <p>• 아침 공복 시 측정하는 것이 가장 정확합니다</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateBodyFat}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                <FaCalculator className="mr-2 inline" />
                체지방률 계산하기
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">체지방률 계산 결과</h3>
                
                {/* 카테고리 표시 */}
                <div className={`mb-6 p-4 rounded-lg border ${getCategoryBg(result.category)}`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">현재 체지방률</div>
                    <div className={`text-3xl font-bold ${getCategoryColor(result.category)}`}>
                      {result.averageBodyFat}%
                    </div>
                    <div className="text-lg font-semibold mt-2">{result.category}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      이상 범위: {result.idealRange}
                    </div>
                  </div>
                </div>

                {/* 상세 결과 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Navy Method</div>
                    <div className="text-2xl font-bold text-black">
                      {result.navyMethod}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      미군 공식
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">YMCA Method</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.ymcaMethod}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      YMCA 공식
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">평균</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.averageBodyFat}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      두 방법 평균
                    </div>
                  </div>
                </div>

                {/* 체지방률 가이드 */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-3">체지방률 가이드</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">남성 기준</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>필수지방:</span>
                          <span className="font-semibold">3%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>운동선수:</span>
                          <span className="font-semibold">6-13%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>건강한 수준:</span>
                          <span className="font-semibold">14-17%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>평균 수준:</span>
                          <span className="font-semibold">18-24%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>비만:</span>
                          <span className="font-semibold">25% 이상</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">여성 기준</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>필수지방:</span>
                          <span className="font-semibold">12%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>운동선수:</span>
                          <span className="font-semibold">14-20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>건강한 수준:</span>
                          <span className="font-semibold">21-24%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>평균 수준:</span>
                          <span className="font-semibold">25-31%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>비만:</span>
                          <span className="font-semibold">32% 이상</span>
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
              체지방률 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">📏 Navy Method (미군 공식)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>정의:</strong> 신체 둘레 측정을 통한 체지방률 계산</li>
                  <li><strong>측정 부위:</strong> 허리둘레, 목둘레 (여성은 엉덩이둘레 추가)</li>
                  <li><strong>장점:</strong> 비교적 정확하고 측정이 간편함</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📊 YMCA Method</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>정의:</strong> BMI와 나이를 고려한 체지방률 계산</li>
                  <li><strong>계산:</strong> BMI × 계수 + 나이 × 계수 - 상수</li>
                  <li><strong>장점:</strong> 측정이 간단하고 빠른 계산 가능</li>
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
                  <li>• 이 계산기는 참고용이며, 정확한 측정이 중요합니다</li>
                  <li>• 아침 공복 시 측정하는 것이 가장 정확합니다</li>
                  <li>• 줄자는 수평으로 유지하고 너무 조이거나 느슨하지 않게 측정하세요</li>
                  <li>• 정확한 체지방률 측정을 위해서는 전문가와 상담하시기 바랍니다</li>
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
              <a href="/bmi-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMI 계산기</h4>
                <p className="text-xs text-gray-600">체질량지수</p>
              </a>
              
              <a href="/calorie-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-red-300 cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">칼로리 계산기</h4>
                <p className="text-xs text-gray-600">일일 칼로리</p>
              </a>
              
              <a href="/bmr-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">기초대사량 계산기</h4>
                <p className="text-xs text-gray-600">BMR 계산</p>
              </a>
              
              <a href="/ideal-weight-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaWeight className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이상체중 계산기</h4>
                <p className="text-xs text-gray-600">표준체중</p>
              </a>
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
                <li><a href="/" className="hover:text-white">홈</a></li>
                <li><a href="/mortgage-calculator" className="hover:text-white">대출 계산기</a></li>
                <li><a href="/investment-calculator" className="hover:text-white">투자 계산기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">계산기 카테고리</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-white">금융 계산기</a></li>
                <li><a href="/" className="hover:text-white">건강 계산기</a></li>
                <li><a href="/" className="hover:text-white">학업 계산기</a></li>
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