"use client";

import { useState } from "react";
import { FaFire, FaRunning, FaAppleAlt, FaChartLine, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaWeight, FaRuler, FaUser, FaDumbbell, FaBaby, FaCalendarAlt, FaCalculator, FaHeart } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface CalorieResult {
  bmr: number;
  tdee: number;
  weightLoss: number;
  weightMaintain: number;
  weightGain: number;
  dailyDeficit?: number;
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<string>("male");
  const [age, setAge] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [weightDisplay, setWeightDisplay] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("sedentary");
  const [goal, setGoal] = useState<string>("maintain");
  const [timeframe, setTimeframe] = useState<string>("1month");
  const [result, setResult] = useState<CalorieResult | null>(null);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (!numericValue) return '';
    return numericValue;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9.]/g, '');
    setWeight(numericValue);
    setWeightDisplay(numericValue);
  };

  const calculateCalories = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum) return;

    // 기초대사율 계산 (Harris-Benedict 공식 개정판)
    let bmr = 0;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
    }

    // 활동 계수
    const activityFactors: { [key: string]: number } = {
      sedentary: 1.2,      // 거의 운동 안함
      light: 1.375,        // 가벼운 운동 (주 1-3회)
      moderate: 1.55,      // 보통 운동 (주 3-5회)
      active: 1.725,       // 적극적 운동 (주 6-7회)
      very_active: 1.9     // 매우 적극적 (하루 2회 운동)
    };

    // 총 소비 칼로리 (TDEE)
    const tdee = bmr * activityFactors[activityLevel];

    // 목표별 권장 칼로리
    let weightLoss = tdee - 500;   // 주당 0.5kg 감량
    let weightMaintain = tdee;
    let weightGain = tdee + 500;   // 주당 0.5kg 증량

    // 목표 기간에 따른 조정
    if (goal === "lose") {
      if (timeframe === "2weeks") {
        weightLoss = tdee - 1000;  // 급속 감량
      } else if (timeframe === "2months") {
        weightLoss = tdee - 250;   // 천천히 감량
      }
    } else if (goal === "gain") {
      if (timeframe === "2weeks") {
        weightGain = tdee + 1000;  // 급속 증량
      } else if (timeframe === "2months") {
        weightGain = tdee + 250;   // 천천히 증량
      }
    }

    // 최소 칼로리 제한 (남성 1500, 여성 1200)
    const minCalorie = gender === "male" ? 1500 : 1200;
    if (weightLoss < minCalorie) {
      weightLoss = minCalorie;
    }

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(weightLoss),
      weightMaintain: Math.round(weightMaintain),
      weightGain: Math.round(weightGain),
      dailyDeficit: goal === "lose" ? Math.round(tdee - weightLoss) : undefined
    });
  };

  const clear = () => {
    setGender("male");
    setAge("");
    setHeight("");
    setWeight("");
    setWeightDisplay("");
    setActivityLevel("sedentary");
    setGoal("maintain");
    setTimeframe("1month");
    setResult(null);
  };

  const getActivityLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      sedentary: "거의 운동 안함 (사무직)",
      light: "가벼운 운동 (주 1-3회)",
      moderate: "보통 운동 (주 3-5회)", 
      active: "적극적 운동 (주 6-7회)",
      very_active: "매우 적극적 (하루 2회)"
    };
    return labels[level];
  };

  const getGoalLabel = (goalType: string) => {
    const labels: { [key: string]: string } = {
      lose: "체중 감량",
      maintain: "체중 유지", 
      gain: "체중 증량"
    };
    return labels[goalType];
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
              칼로리 계산기
            </h1>
            <p className="text-lg text-gray-600">기초대사율과 목표에 맞는 하루 칼로리를 계산해보세요</p>
          </div>

          {/* 칼로리 계산기 */}
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
                    type="text"
                    value={weightDisplay}
                    onChange={handleWeightChange}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 활동량 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">활동량</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRunning className="inline mr-2 text-black" />
                    일상 활동량
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  >
                    <option value="sedentary">거의 운동 안함 (사무직)</option>
                    <option value="light">가벼운 운동 (주 1-3회)</option>
                    <option value="moderate">보통 운동 (주 3-5회)</option>
                    <option value="active">적극적 운동 (주 6-7회)</option>
                    <option value="very_active">매우 적극적 (하루 2회)</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600 pt-6">
                  <p><strong>활동량 가이드:</strong></p>
                  <p>• 사무직: 하루 종일 앉아서 일하는 경우</p>
                  <p>• 가벼운 운동: 산책, 가벼운 요가 등</p>
                  <p>• 보통 운동: 헬스장, 조깅, 수영 등</p>
                  <p>• 적극적: 매일 운동하거나 육체 노동</p>
                </div>
              </div>
            </div>

            {/* 목표 설정 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">목표 설정</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaChartLine className="inline mr-2 text-black" />
                    목표
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  >
                    <option value="lose">체중 감량</option>
                    <option value="maintain">체중 유지</option>
                    <option value="gain">체중 증량</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-black" />
                    기간
                  </label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                  >
                    <option value="2weeks">빠르게 (2주)</option>
                    <option value="1month">적당히 (1개월)</option>
                    <option value="2months">천천히 (2개월)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateCalories}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                <FaCalculator className="mr-2 inline" />
                칼로리 계산하기
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">칼로리 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">기초대사율 (BMR)</div>
                    <div className="text-2xl font-bold text-black">
                      {result.bmr.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      안정 시 소모 칼로리
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 소모 칼로리 (TDEE)</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.tdee.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      활동 포함 일일 소모량
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">목표별 권장 칼로리</div>
                    <div className="text-2xl font-bold text-green-600">
                      {goal === "lose" ? result.weightLoss.toLocaleString() : 
                       goal === "gain" ? result.weightGain.toLocaleString() : 
                       result.weightMaintain.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getGoalLabel(goal)}
                    </div>
                  </div>
                </div>

                {/* 상세 내역 */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-3">상세 권장 칼로리</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="font-semibold text-red-600">체중 감량</div>
                      <div className="text-lg font-bold">{result.weightLoss.toLocaleString()} kcal</div>
                      <div className="text-xs text-gray-500">주당 0.5kg 감량</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-semibold text-green-600">체중 유지</div>
                      <div className="text-lg font-bold">{result.weightMaintain.toLocaleString()} kcal</div>
                      <div className="text-xs text-gray-500">현재 체중 유지</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-semibold text-blue-600">체중 증량</div>
                      <div className="text-lg font-bold">{result.weightGain.toLocaleString()} kcal</div>
                      <div className="text-xs text-gray-500">주당 0.5kg 증량</div>
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
              칼로리 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">🔥 기초대사율 (BMR)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>정의:</strong> 안정 상태에서 생명 유지에 필요한 최소 칼로리</li>
                  <li><strong>계산 공식:</strong> Harris-Benedict 공식 개정판 사용</li>
                  <li><strong>영향 요인:</strong> 나이, 성별, 키, 체중</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏃‍♂️ 총 소비 칼로리 (TDEE)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>정의:</strong> 일상 활동을 포함한 총 칼로리 소모량</li>
                  <li><strong>계산:</strong> BMR × 활동 계수</li>
                  <li><strong>활동 계수:</strong> 거의 운동 안함(1.2) ~ 매우 적극적(1.9)</li>
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
                  <li>• 급격한 칼로리 감소는 건강에 해로울 수 있습니다</li>
                  <li>• 체중 감량 시 최소 칼로리(남성 1500, 여성 1200)를 유지하세요</li>
                  <li>• 정확한 영양 상담을 위해서는 전문가와 상담하시기 바랍니다</li>
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
              <a href="/bmr-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">기초대사량 계산기</h4>
                <p className="text-xs text-gray-600">BMR 계산</p>
              </a>
              
              <a href="/bmi-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMI 계산기</h4>
                <p className="text-xs text-gray-600">체질량지수</p>
              </a>
              
              <a href="/body-fat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaWeight className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">체지방률 계산기</h4>
                <p className="text-xs text-gray-600">체지방 측정</p>
              </a>
              
              <a href="/ideal-weight-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-black" />
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