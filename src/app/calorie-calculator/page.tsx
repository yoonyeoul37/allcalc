"use client";

import { useState } from "react";
import { FaFire, FaRunning, FaAppleAlt, FaChartLine } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">칼로리 계산기</h1>
            <p className="text-lg text-gray-600">기초대사율과 목표에 맞는 하루 칼로리를 계산해보세요</p>
          </div>

          {/* 칼로리 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                  <input
                    type="text"
                    value={weightDisplay}
                    onChange={handleWeightChange}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 활동량 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">활동량</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">일상 활동량</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">목표</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="lose">체중 감량</option>
                    <option value="maintain">체중 유지</option>
                    <option value="gain">체중 증량</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
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
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">칼로리 계산 결과</h3>
                
                {/* 선택 옵션 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      {gender === "male" ? "남성" : "여성"} • {age}세 • {height}cm • {weight}kg
                    </span>
                    {" • "}
                    <span className="font-semibold">{getActivityLabel(activityLevel)}</span>
                    {" • "}
                    <span className="font-semibold">{getGoalLabel(goal)}</span>
                  </div>
                </div>

                {/* 기초 정보 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">기초대사율 (BMR)</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.bmr.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      아무것도 안 해도 소모되는 칼로리
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">일일 소모 칼로리 (TDEE)</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.tdee.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      활동량 포함 하루 총 소모량
                    </div>
                  </div>
                </div>

                {/* 목표별 권장 칼로리 */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`text-center p-4 border rounded-lg ${goal === "lose" ? "bg-red-50 border-red-200" : "border-gray-200"}`}>
                    <div className="text-sm text-gray-600 mb-1">체중 감량</div>
                    <div className={`text-xl font-bold ${goal === "lose" ? "text-red-600" : "text-gray-700"}`}>
                      {result.weightLoss.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      주당 0.5kg 감량
                    </div>
                  </div>
                  <div className={`text-center p-4 border rounded-lg ${goal === "maintain" ? "bg-blue-50 border-blue-200" : "border-gray-200"}`}>
                    <div className="text-sm text-gray-600 mb-1">체중 유지</div>
                    <div className={`text-xl font-bold ${goal === "maintain" ? "text-blue-600" : "text-gray-700"}`}>
                      {result.weightMaintain.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      현재 체중 유지
                    </div>
                  </div>
                  <div className={`text-center p-4 border rounded-lg ${goal === "gain" ? "bg-green-50 border-green-200" : "border-gray-200"}`}>
                    <div className="text-sm text-gray-600 mb-1">체중 증량</div>
                    <div className={`text-xl font-bold ${goal === "gain" ? "text-green-600" : "text-gray-700"}`}>
                      {result.weightGain.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      주당 0.5kg 증량
                    </div>
                  </div>
                </div>

                {/* 감량 시 추가 정보 */}
                {goal === "lose" && result.dailyDeficit && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">하루 칼로리 적자</p>
                      <p className="text-lg font-bold text-red-600">{result.dailyDeficit} kcal</p>
                      <p className="text-xs text-gray-500 mt-1">
                        운동 또는 식단 조절로 이만큼 줄이세요
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🥗 다이어트 식단 관리</h3>
                    <p className="text-sm mb-3">개인 맞춤 식단 플랜 + 칼로리 추적 앱</p>
                    <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      무료 체험하기 →
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">💪 홈트레이닝 플랫폼</h3>
                  <p className="text-gray-600 mb-3">전문 트레이너 PT + 실시간 칼로리 소모량 체크</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">7일 무료</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">개인 맞춤</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                    무료 시작하기
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
              
              {/* 칼로리 계산기란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">칼로리 계산기란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    칼로리 계산기는 개인의 기초대사율(BMR)과 활동량을 고려하여 하루에 필요한 칼로리를 계산해주는 도구입니다. 
                    체중 감량, 유지, 증량 등 목표에 따른 적절한 칼로리 섭취량을 알려드립니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    정확한 칼로리 계산을 통해 건강한 체중 관리와 효과적인 다이어트 계획을 세워보세요.
                  </p>
                </div>
              </section>

              {/* 기초대사율과 칼로리 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">기초대사율(BMR)과 총 소비 칼로리(TDEE)</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">기초대사율 (BMR)</h3>
                    <p className="text-gray-700 mb-4">
                      생명 유지를 위해 최소한으로 필요한 에너지량입니다. 심장 박동, 호흡, 체온 유지 등 기본적인 생명 활동에 사용되는 칼로리입니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>Harris-Benedict 공식:</strong></p>
                      <p>남성: 88.362 + (13.397 × 체중) + (4.799 × 키) - (5.677 × 나이)</p>
                      <p>여성: 447.593 + (9.247 × 체중) + (3.098 × 키) - (4.330 × 나이)</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">총 소비 칼로리 (TDEE)</h3>
                    <p className="text-gray-700 mb-4">
                      기초대사율에 일상 활동량을 포함한 하루 총 소비 칼로리입니다. 체중 관리의 기준이 되는 중요한 수치입니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>활동 계수:</strong></p>
                      <p>• 거의 운동 안함: BMR × 1.2</p>
                      <p>• 가벼운 운동: BMR × 1.375</p>
                      <p>• 보통 운동: BMR × 1.55</p>
                      <p>• 적극적 운동: BMR × 1.725</p>
                      <p>• 매우 적극적: BMR × 1.9</p>
                    </div>
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
                        <div className="text-2xl mb-2">🍎</div>
                        <h4 className="font-semibold text-gray-800 mb-1">다이어트 도시락</h4>
                        <p className="text-sm text-gray-600 mb-2">칼로리 계산된 건강 도시락</p>
                        <div className="text-green-600 text-sm font-semibold">주문하기</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">⚖️</div>
                        <h4 className="font-semibold text-gray-800 mb-1">스마트 체중계</h4>
                        <p className="text-sm text-gray-600 mb-2">체지방률, 근육량 측정</p>
                        <div className="text-blue-600 text-sm font-semibold">구매하기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 목표별 칼로리 관리 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">목표별 칼로리 관리법</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 감량</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• TDEE보다 300-500kcal 적게 섭취</li>
                      <li>• 주당 0.5-1kg 감량이 건강한 속도</li>
                      <li>• 극단적인 칼로리 제한은 금물</li>
                      <li>• 운동과 식단 조절 병행</li>
                      <li>• 충분한 단백질 섭취 필수</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 유지</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• TDEE와 동일하게 섭취</li>
                      <li>• 균형 잡힌 영양소 비율</li>
                      <li>• 규칙적인 운동 습관</li>
                      <li>• 체중 변화 주기적 체크</li>
                      <li>• 스트레스 관리도 중요</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 증량</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• TDEE보다 300-500kcal 많이 섭취</li>
                      <li>• 근력 운동과 병행 필수</li>
                      <li>• 양질의 탄수화물과 단백질</li>
                      <li>• 건강한 지방도 적절히</li>
                      <li>• 무리한 폭식은 피하기</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 한국인 칼로리 가이드 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">한국인 평균 칼로리 섭취량</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">연령대</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">남성</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">여성</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">활동량</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">19-29세</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2,600kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2,000kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">보통 활동</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">30-49세</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2,500kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1,900kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">보통 활동</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">50-64세</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2,200kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1,700kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">보통 활동</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">65세 이상</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2,000kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1,600kcal</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">가벼운 활동</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  * 출처: 한국영양학회 권장 섭취량 (2020 개정판)
                </p>
              </section>

              {/* 주의사항 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">칼로리 관리 주의사항</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>최소 칼로리 준수:</strong> 남성 1,500kcal, 여성 1,200kcal 이하로 떨어뜨리지 마세요.</li>
                    <li>• <strong>영양소 균형:</strong> 칼로리만 맞추지 말고 탄수화물, 단백질, 지방의 균형을 맞추세요.</li>
                    <li>• <strong>개인차 고려:</strong> 같은 조건이라도 개인마다 대사율이 다를 수 있습니다.</li>
                    <li>• <strong>의학적 상태:</strong> 당뇨, 갑상선 질환 등이 있다면 의사와 상담하세요.</li>
                    <li>• <strong>단계적 변화:</strong> 급격한 칼로리 변화보다는 점진적인 조절이 효과적입니다.</li>
                  </ul>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaRunning className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMI 계산기</h3>
                    <p className="text-sm text-gray-600">체질량지수 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaAppleAlt className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">영양소 계산기</h3>
                    <p className="text-sm text-gray-600">탄단지 비율 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaFire className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">운동 칼로리 계산기</h3>
                    <p className="text-sm text-gray-600">운동별 소모 칼로리</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">체지방률 계산기</h3>
                    <p className="text-sm text-gray-600">체지방 비율 측정</p>
                  </div>
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
                    <div className="bg-gradient-to-b from-green-400 to-blue-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🥘 식단 관리</h4>
                      <p className="text-sm mb-3">AI 맞춤 식단 추천</p>
                      <button className="bg-white text-green-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
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
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        🔥
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">다이어트 앱</h5>
                        <p className="text-xs text-gray-600">칼로리 추적 & 식단 관리</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🥗
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">건강 도시락</h5>
                        <p className="text-xs text-gray-600">칼로리 계산된 식단</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        💊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">건강 보조제</h5>
                        <p className="text-xs text-gray-600">다이어트 & 근육 보조</p>
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
            이 칼로리 계산기는 Harris-Benedict 공식을 기반으로 계산됩니다. 
            개인의 건강 상태, 운동 능력, 의학적 조건에 따라 실제 필요 칼로리는 다를 수 있으므로 
            정확한 상담을 위해서는 영양사나 의사와 상의하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 