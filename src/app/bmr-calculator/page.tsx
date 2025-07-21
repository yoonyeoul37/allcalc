"use client";

import { useState } from "react";
import Link from "next/link";
import { FaFire, FaHeart, FaWeight, FaChartLine, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaUser, FaDumbbell, FaBaby, FaCalendarAlt, FaCalculator, FaRuler } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface BMRResult {
  harrisBenedict: number;
  mifflinStJeor: number;
  averageBMR: number;
  dailyCalories: {
    sedentary: number;
    light: number;
    moderate: number;
    active: number;
    veryActive: number;
  };
}

export default function BMRCalculator() {
  const [gender, setGender] = useState<string>("male");
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<BMRResult | null>(null);

  const calculateBMR = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum) return;

    // Harris-Benedict 공식 (개정판)
    let harrisBenedict = 0;
    if (gender === "male") {
      harrisBenedict = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
    } else {
      harrisBenedict = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
    }

    // Mifflin-St Jeor 공식 (더 정확하다고 알려짐)
    let mifflinStJeor = 0;
    if (gender === "male") {
      mifflinStJeor = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      mifflinStJeor = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    // 평균 BMR
    const averageBMR = (harrisBenedict + mifflinStJeor) / 2;

    // 활동량별 일일 칼로리
    const dailyCalories = {
      sedentary: averageBMR * 1.2,      // 거의 운동 안함
      light: averageBMR * 1.375,        // 가벼운 운동
      moderate: averageBMR * 1.55,      // 보통 운동
      active: averageBMR * 1.725,       // 적극적 운동
      veryActive: averageBMR * 1.9      // 매우 적극적
    };

    setResult({
      harrisBenedict: Math.round(harrisBenedict),
      mifflinStJeor: Math.round(mifflinStJeor),
      averageBMR: Math.round(averageBMR),
      dailyCalories: {
        sedentary: Math.round(dailyCalories.sedentary),
        light: Math.round(dailyCalories.light),
        moderate: Math.round(dailyCalories.moderate),
        active: Math.round(dailyCalories.active),
        veryActive: Math.round(dailyCalories.veryActive)
      }
    });
  };

  const clear = () => {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaFire className="mr-3 text-black" />
              기초대사율(BMR) 계산기
            </h1>
            <p className="text-lg text-gray-600">아무것도 하지 않아도 소모되는 하루 최소 칼로리를 계산해보세요</p>
          </div>

          {/* BMR 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 입력 */}
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

            {/* BMR 설명 */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">기초대사율(BMR)이란?</h4>
              <p className="text-sm text-gray-600">
                생명 유지를 위해 최소한으로 필요한 에너지량입니다. 심장 박동, 호흡, 체온 유지 등 
                기본적인 생명 활동에 하루 동안 소모되는 칼로리를 의미합니다.
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateBMR}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                <FaCalculator className="mr-2 inline" />
                BMR 계산하기
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">기초대사율 계산 결과</h3>
                
                {/* BMR 계산 방법별 결과 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Harris-Benedict 공식</div>
                    <div className="text-2xl font-bold text-black">
                      {result.harrisBenedict.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1919년 개발 (개정판)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">Mifflin-St Jeor 공식</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.mifflinStJeor.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1990년 개발 (더 정확)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-600 mb-1">권장 BMR</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.averageBMR.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      두 공식의 평균값
                    </div>
                  </div>
                </div>

                {/* 활동량별 일일 칼로리 */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">활동량별 일일 필요 칼로리</h4>
                  <div className="grid md:grid-cols-5 gap-3">
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">거의 운동 안함</div>
                      <div className="text-lg font-bold text-gray-800">
                        {result.dailyCalories.sedentary.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">사무직, 집안일</div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">가벼운 운동</div>
                      <div className="text-lg font-bold text-gray-800">
                        {result.dailyCalories.light.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">주 1-3회</div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">보통 운동</div>
                      <div className="text-lg font-bold text-gray-800">
                        {result.dailyCalories.moderate.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">주 3-5회</div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">적극적 운동</div>
                      <div className="text-lg font-bold text-gray-800">
                        {result.dailyCalories.active.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">주 6-7회</div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">매우 적극적</div>
                      <div className="text-lg font-bold text-gray-800">
                        {result.dailyCalories.veryActive.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">하루 2회 운동</div>
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
              기초대사율 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">🔥 Harris-Benedict 공식</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>개발:</strong> 1919년 개발된 전통적인 공식</li>
                  <li><strong>특징:</strong> 체중, 키, 나이, 성별을 고려</li>
                  <li><strong>정확도:</strong> 일반적으로 ±10% 오차</li>
                  <li><strong>적용:</strong> 대부분의 사람들에게 적합</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📊 Mifflin-St Jeor 공식</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>개발:</strong> 1990년 개발된 현대적인 공식</li>
                  <li><strong>특징:</strong> 더 정확한 계산 방법</li>
                  <li><strong>정확도:</strong> ±5% 오차로 더 정확</li>
                  <li><strong>적용:</strong> 현재 가장 널리 사용되는 공식</li>
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
                  <li>• 이 계산기는 참고용이며, 개인차이가 있을 수 있습니다</li>
                  <li>• 근육량, 체지방률, 활동량에 따라 실제 BMR이 달라질 수 있습니다</li>
                  <li>• 정확한 BMR 측정을 위해서는 전문가와 상담하시기 바랍니다</li>
                  <li>• 체중 관리 시에는 활동량을 포함한 총 소모 칼로리를 고려하세요</li>
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
              <Link href="/calorie-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-red-300 cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">칼로리 계산기</h4>
                <p className="text-xs text-gray-600">일일 칼로리</p>
              </Link>
              
              <Link href="/bmi-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMI 계산기</h4>
                <p className="text-xs text-gray-600">체질량지수</p>
              </Link>
              
              <Link href="/body-fat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaWeight className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">체지방률 계산기</h4>
                <p className="text-xs text-gray-600">체지방 측정</p>
              </Link>
              
              <Link href="/muscle-mass-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDumbbell className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근육량 계산기</h4>
                <p className="text-xs text-gray-600">근육량 측정</p>
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
