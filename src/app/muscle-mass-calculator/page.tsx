"use client";

import { useState } from "react";
import { FaDumbbell, FaUserCheck, FaChartLine, FaHeart } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">근육량 계산기</h1>
            <p className="text-lg text-gray-600">체지방률을 이용한 근육량 추정 계산기</p>
          </div>

          {/* 근육량 계산기 */}
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
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 체지방률 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">체지방률</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">체지방률 (%)</label>
                  <input
                    type="number"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
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
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gray-800">근육량: </span>
                      <span className="text-3xl font-bold text-blue-600">
                        {result.muscleMass}kg
                      </span>
                    </div>
                    <div className={`text-xl font-semibold ${getCategoryColor(result.category)}`}>
                      {result.category}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">근육량 비율:</span>
                      <span className="font-semibold">{result.muscleMassPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">근육량 지수:</span>
                      <span className="font-semibold">{result.muscleMassIndex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">제지방량:</span>
                      <span className="font-semibold">{result.leanBodyMass}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">권장 범위:</span>
                      <span className="font-semibold text-blue-600">{result.idealRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">💪 맞춤형 근력 운동 프로그램</h3>
                    <p className="text-sm mb-3">전문 트레이너가 설계한 개인별 운동 플랜</p>
                    <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
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
      <div className="w-full px-8 py-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🏋️‍♂️ 헬스장 회원권 특가</h3>
                  <p className="text-gray-600 mb-3">전국 헬스장 할인 + 개인트레이닝 1회 무료</p>
                  <div className="flex gap-2">
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">30% OFF</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">PT 무료</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
                    지금 가입하기
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
              
              {/* 근육량이란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">근육량이란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    근육량은 신체의 모든 근육 조직의 총량을 의미합니다. 이는 골격근, 심장근, 평활근을 포함하며, 
                    주로 골격근이 전체 근육량의 대부분을 차지합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    근육량은 대사율, 체력, 신체 기능에 직접적인 영향을 미치며, 나이가 들면서 자연스럽게 감소하는 
                    경향이 있어 적절한 운동과 영양 관리가 중요합니다.
                  </p>
                </div>
              </section>

              {/* 근육량 계산 공식 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">근육량 계산 공식</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800 mb-4">
                      근육량 = 제지방량 × 0.55
                    </div>
                    <div className="text-gray-700">
                      <p className="mb-2"><strong>제지방량 = 체중 - 체지방량</strong></p>
                      <p className="mb-2"><strong>체지방량 = 체중 × (체지방률 ÷ 100)</strong></p>
                      <p><strong>근육량 지수 = 근육량 ÷ (키)²</strong></p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 근육량 기준표 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">근육량 기준표</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">분류</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">남성</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">여성</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">특징</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-red-600 font-semibold">근육량 부족</td>
                        <td className="border border-gray-300 px-4 py-3">35% 미만</td>
                        <td className="border border-gray-300 px-4 py-3">25% 미만</td>
                        <td className="border border-gray-300 px-4 py-3">기초체력 부족</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 px-4 py-3 text-yellow-600 font-semibold">평균 수준</td>
                        <td className="border border-gray-300 px-4 py-3">35-42%</td>
                        <td className="border border-gray-300 px-4 py-3">25-32%</td>
                        <td className="border border-gray-300 px-4 py-3">일반적인 수준</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">좋은 수준</td>
                        <td className="border border-gray-300 px-4 py-3">42-50%</td>
                        <td className="border border-gray-300 px-4 py-3">32-40%</td>
                        <td className="border border-gray-300 px-4 py-3">건강한 근육량</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-blue-600 font-semibold">운동선수 수준</td>
                        <td className="border border-gray-300 px-4 py-3">50-55%</td>
                        <td className="border border-gray-300 px-4 py-3">40-45%</td>
                        <td className="border border-gray-300 px-4 py-3">고도 훈련된 수준</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 text-purple-600 font-semibold">매우 높음</td>
                        <td className="border border-gray-300 px-4 py-3">55% 이상</td>
                        <td className="border border-gray-300 px-4 py-3">45% 이상</td>
                        <td className="border border-gray-300 px-4 py-3">엘리트 수준</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 광고 3: 정보 섹션 중간 */}
              <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-4">Google AdSense</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🥛</div>
                        <h4 className="font-semibold text-gray-800 mb-1">단백질 보충제</h4>
                        <p className="text-sm text-gray-600 mb-2">근육량 증가 도움</p>
                        <div className="text-blue-600 text-sm font-semibold">₩39,900</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <h4 className="font-semibold text-gray-800 mb-1">운동 앱</h4>
                        <p className="text-sm text-gray-600 mb-2">근력 운동 가이드</p>
                        <div className="text-green-600 text-sm font-semibold">무료 체험</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 근육량 증가 방법 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">근육량 증가 방법</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">운동</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 근력 운동 (주 3-4회)</li>
                      <li>• 복합 운동 위주</li>
                      <li>• 점진적 과부하</li>
                      <li>• 충분한 휴식</li>
                      <li>• 일관성 있는 운동</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">영양</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 충분한 단백질 섭취</li>
                      <li>• 탄수화물 섭취</li>
                      <li>• 적절한 칼로리</li>
                      <li>• 수분 섭취</li>
                      <li>• 타이밍 중요</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">생활</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 충분한 수면</li>
                      <li>• 스트레스 관리</li>
                      <li>• 규칙적인 생활</li>
                      <li>• 금연 및 금주</li>
                      <li>• 인내심</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 주의사항 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">근육량 계산 시 주의사항</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>추정값:</strong> 이 계산기는 추정값이며, 정확한 측정을 위해서는 인바디 검사가 필요합니다.</li>
                    <li>• <strong>개인차:</strong> 같은 조건이라도 개인마다 근육량 분포가 다를 수 있습니다.</li>
                    <li>• <strong>체지방률 정확도:</strong> 입력한 체지방률의 정확도가 결과에 큰 영향을 미칩니다.</li>
                    <li>• <strong>연령 고려:</strong> 나이가 들면서 근육량이 자연스럽게 감소하는 것을 고려해야 합니다.</li>
                    <li>• <strong>전문가 상담:</strong> 정확한 체성분 분석을 위해서는 전문가와 상담하세요.</li>
                  </ul>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <a href="/body-fat-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaDumbbell className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">체지방률 계산기</h3>
                    <p className="text-sm text-gray-600">체지방률 측정</p>
                  </a>
                  <a href="/bmi-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaUserCheck className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMI 계산기</h3>
                    <p className="text-sm text-gray-600">체질량지수 계산</p>
                  </a>
                  <a href="/calorie-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">칼로리 계산기</h3>
                    <p className="text-sm text-gray-600">기초대사율 계산</p>
                  </a>
                  <a href="/ideal-weight-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaHeart className="text-2xl text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">이상체중 계산기</h3>
                    <p className="text-sm text-gray-600">목표 체중 계산</p>
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
                    <div className="bg-gradient-to-b from-purple-400 to-blue-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">💪 근력 운동</h4>
                      <p className="text-sm mb-3">전문가 맞춤 운동 프로그램</p>
                      <button className="bg-white text-purple-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
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
                        🥛
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">단백질 보충제</h5>
                        <p className="text-xs text-gray-600">근육량 증가 도움</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🏋️‍♂️
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">개인 트레이닝</h5>
                        <p className="text-xs text-gray-600">1:1 맞춤 운동</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        📊
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">체성분 분석</h5>
                        <p className="text-xs text-gray-600">정확한 근육량 측정</p>
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
            이 근육량 계산기는 체지방률을 기반으로 한 추정값입니다. 
            정확한 근육량 측정을 위해서는 인바디 검사나 전문가와 상담하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 