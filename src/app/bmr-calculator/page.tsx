"use client";

import { useState } from "react";
import { FaFire, FaHeart, FaWeight, FaChartLine } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">기초대사율(BMR) 계산기</h1>
            <p className="text-lg text-gray-600">아무것도 하지 않아도 소모되는 하루 최소 칼로리를 계산해보세요</p>
          </div>

          {/* BMR 계산기 */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
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
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">기초대사율 계산 결과</h3>
                
                {/* 선택 옵션 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      {gender === "male" ? "남성" : "여성"} • {age}세 • {height}cm • {weight}kg
                    </span>
                  </div>
                </div>

                {/* BMR 계산 방법별 결과 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Harris-Benedict 공식</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.harrisBenedict.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1919년 개발 (개정판)
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Mifflin-St Jeor 공식</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.mifflinStJeor.toLocaleString()} kcal
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1990년 개발 (더 정확)
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg bg-blue-50">
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
                <div className="mt-6">
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
                      <div className="text-xs text-gray-500">하루 2회</div>
                    </div>
                  </div>
                </div>

                {/* BMR 해석 */}
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">BMR 해석</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• <strong>BMR은 최소 칼로리:</strong> 이보다 적게 먹으면 건강에 위험할 수 있습니다.</p>
                    <p>• <strong>실제 소비 칼로리:</strong> 활동량을 고려한 일일 칼로리를 참고하세요.</p>
                    <p>• <strong>개인차 존재:</strong> 근육량, 유전적 요인에 따라 10-15% 차이가 있을 수 있습니다.</p>
                    <p>• <strong>나이에 따른 변화:</strong> 나이가 들수록 BMR은 점차 감소합니다.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">⚖️ 스마트 체성분 측정</h3>
                    <p className="text-sm mb-3">기초대사율 + 근육량 + 체지방률까지 정확한 측정</p>
                    <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      측정 받기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🔥 대사량 증가 프로그램</h3>
                  <p className="text-gray-600 mb-3">근력 운동 + 개인 맞춤 영양 상담으로 기초대사율 UP</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">1개월 무료</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">전문가 상담</span>
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
              
              {/* BMR이란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">기초대사율(BMR)이란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    기초대사율(Basal Metabolic Rate, BMR)은 생명 유지를 위해 최소한으로 필요한 에너지량입니다. 
                    심장 박동, 호흡, 체온 유지, 세포 재생 등 기본적인 생명 활동에 하루 동안 소모되는 칼로리를 의미합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    BMR은 하루 총 에너지 소비량의 60-70%를 차지하며, 다이어트나 체중 관리의 기본 지표가 됩니다. 
                    BMR보다 적게 먹으면 신체 기능이 저하될 수 있어 주의가 필요합니다.
                  </p>
                </div>
              </section>

              {/* BMR 계산 공식 비교 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">BMR 계산 공식 비교</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Harris-Benedict 공식</h3>
                    <p className="text-gray-700 mb-4">
                      1919년에 개발되어 가장 널리 알려진 공식입니다. 1984년에 개정되어 정확도가 향상되었습니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>남성:</strong> 88.362 + (13.397 × 체중) + (4.799 × 키) - (5.677 × 나이)</p>
                      <p><strong>여성:</strong> 447.593 + (9.247 × 체중) + (3.098 × 키) - (4.330 × 나이)</p>
                      <p className="mt-2"><strong>특징:</strong> 오랜 기간 검증된 공식</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Mifflin-St Jeor 공식</h3>
                    <p className="text-gray-700 mb-4">
                      1990년에 개발된 공식으로 현재 가장 정확하다고 인정받고 있습니다. 현대인의 체형을 더 잘 반영합니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>남성:</strong> (10 × 체중) + (6.25 × 키) - (5 × 나이) + 5</p>
                      <p><strong>여성:</strong> (10 × 체중) + (6.25 × 키) - (5 × 나이) - 161</p>
                      <p className="mt-2"><strong>특징:</strong> 더 정확하고 현대적인 공식</p>
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
                        <div className="text-2xl mb-2">💊</div>
                        <h4 className="font-semibold text-gray-800 mb-1">대사량 증가 보조제</h4>
                        <p className="text-sm text-gray-600 mb-2">자연 추출 성분</p>
                        <div className="text-green-600 text-sm font-semibold">구매하기</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏋️‍♀️</div>
                        <h4 className="font-semibold text-gray-800 mb-1">근력 운동 프로그램</h4>
                        <p className="text-sm text-gray-600 mb-2">기초대사율 향상</p>
                        <div className="text-blue-600 text-sm font-semibold">시작하기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BMR에 영향을 주는 요인 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">BMR에 영향을 주는 요인</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">BMR을 높이는 요인</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>근육량 증가:</strong> 근육은 지방보다 많은 에너지를 소모</li>
                      <li>• <strong>규칙적인 운동:</strong> 특히 근력 운동이 효과적</li>
                      <li>• <strong>충분한 수면:</strong> 7-8시간의 양질의 수면</li>
                      <li>• <strong>적절한 단백질 섭취:</strong> 근육량 유지에 필수</li>
                      <li>• <strong>충분한 수분 섭취:</strong> 신진대사 활성화</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">BMR을 낮추는 요인</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>나이 증가:</strong> 10년마다 약 2-3% 감소</li>
                      <li>• <strong>극단적 다이어트:</strong> 신체가 에너지 절약 모드로 전환</li>
                      <li>• <strong>근육량 감소:</strong> 잘못된 다이어트로 인한 근손실</li>
                      <li>• <strong>수면 부족:</strong> 호르몬 불균형 유발</li>
                      <li>• <strong>스트레스:</strong> 코르티솔 증가로 대사율 저하</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 한국인 BMR 특성 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">한국인 BMR 특성</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    한국인을 포함한 아시아인은 서구인과 비교해 몇 가지 특성이 있습니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">아시아인 특성</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• 상대적으로 근육량이 적어 BMR이 낮음</li>
                        <li>• 같은 체중이라도 BMR이 5-10% 낮을 수 있음</li>
                        <li>• 내장지방 축적 경향이 높음</li>
                        <li>• 탄수화물 대사가 상대적으로 효율적</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">관리 방법</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• 근력 운동을 통한 근육량 증가</li>
                        <li>• 단백질 섭취량 늘리기 (체중 1kg당 1.2-1.6g)</li>
                        <li>• 유산소와 근력 운동의 적절한 조합</li>
                        <li>• 정기적인 체성분 검사로 모니터링</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* BMR 활용법 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">BMR 활용법</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 감량</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• BMR보다 적게 먹지 말 것</li>
                      <li>• TDEE에서 300-500kcal 적게 섭취</li>
                      <li>• 근력 운동으로 근육량 유지</li>
                      <li>• 천천히 안전하게 감량</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 유지</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 활동량에 맞는 칼로리 섭취</li>
                      <li>• 규칙적인 운동 습관</li>
                      <li>• 체중 변화 주기적 체크</li>
                      <li>• 균형 잡힌 영양소 섭취</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">체중 증량</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• TDEE보다 300-500kcal 많이 섭취</li>
                      <li>• 근력 운동과 함께 진행</li>
                      <li>• 양질의 단백질 충분히 섭취</li>
                      <li>• 건강한 지방도 적절히 포함</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaFire className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">칼로리 계산기</h3>
                    <p className="text-sm text-gray-600">목표별 칼로리 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaWeight className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMI 계산기</h3>
                    <p className="text-sm text-gray-600">체질량지수 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaHeart className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">체지방 계산기</h3>
                    <p className="text-sm text-gray-600">체지방률 측정</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">이상체중 계산기</h3>
                    <p className="text-sm text-gray-600">목표 체중 계산</p>
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
                    <div className="bg-gradient-to-b from-green-400 to-green-600 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🔥 대사율 UP</h4>
                      <p className="text-sm mb-3">근력 + 유산소 프로그램</p>
                      <button className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-semibold w-full">
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
                        <h5 className="font-semibold text-sm">대사량 증가 앱</h5>
                        <p className="text-xs text-gray-600">일일 운동 + 식단 관리</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        💪
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">홈트레이닝</h5>
                        <p className="text-xs text-gray-600">근력 운동 프로그램</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        ⚖️
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">체성분 측정</h5>
                        <p className="text-xs text-gray-600">정확한 BMR 측정</p>
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
            이 BMR 계산기는 Harris-Benedict 공식과 Mifflin-St Jeor 공식을 기반으로 계산됩니다. 
            실제 기초대사율은 개인의 근육량, 유전적 요인, 건강 상태에 따라 차이가 있을 수 있으므로 
            정확한 측정을 위해서는 전문 기관에서 체성분 검사를 받으시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 