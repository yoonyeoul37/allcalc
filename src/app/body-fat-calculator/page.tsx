"use client";

import { useState } from "react";
import { FaWeight, FaRuler, FaUserCheck, FaChartLine } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">체지방률 계산기</h1>
            <p className="text-lg text-gray-600">신체 둘레 측정으로 정확한 체지방률을 계산해보세요</p>
          </div>

          {/* 체지방률 계산기 */}
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

            {/* 둘레 측정 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">둘레 측정 (정확한 측정이 중요합니다)</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">허리둘레 (cm)</label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="85"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">배꼽 위 가장 가는 부분</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">목둘레 (cm)</label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    placeholder="38"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">목의 가장 가는 부분</p>
                </div>
                {gender === "female" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">엉덩이둘레 (cm)</label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      placeholder="95"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
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
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">체지방률 계산 결과</h3>
                
                {/* 선택 옵션 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      {gender === "male" ? "남성" : "여성"} • {age}세 • {height}cm • {weight}kg
                    </span>
                    <br />
                    <span className="text-xs">
                      허리 {waist}cm • 목 {neck}cm
                      {gender === "female" && ` • 엉덩이 ${hip}cm`}
                    </span>
                  </div>
                </div>

                {/* 계산 방법별 결과 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Navy Method</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.navyMethod}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      미군 공식 (둘레 기반)
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">YMCA Method</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {result.ymcaMethod}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      BMI + 나이 기반
                    </div>
                  </div>
                </div>

                {/* 평균 체지방률 및 평가 */}
                <div className={`text-center p-6 border rounded-lg ${getCategoryBg(result.category)}`}>
                  <div className="text-lg font-bold text-gray-700 mb-2">평균 체지방률</div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {result.averageBodyFat}%
                  </div>
                  <div className={`text-lg font-semibold mb-2 ${getCategoryColor(result.category)}`}>
                    {result.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>이상적인 범위:</strong> {result.idealRange}</p>
                    <p><strong>필수지방:</strong> {result.essentialFat}% 이상</p>
                  </div>
                </div>

                {/* 체지방률 해석 */}
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">체지방률 해석</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    {result.category.includes("위험") && (
                      <p className="text-red-600">⚠️ 필수지방이 부족합니다. 건강을 위해 체중을 늘리는 것을 고려해보세요.</p>
                    )}
                    {result.category.includes("운동선수") && (
                      <p className="text-blue-600">💪 운동선수 수준의 체지방률입니다. 매우 훌륭합니다!</p>
                    )}
                    {result.category.includes("건강한") && (
                      <p className="text-green-600">✅ 건강한 체지방률입니다. 현재 상태를 유지하세요.</p>
                    )}
                    {result.category.includes("평균") && (
                      <p className="text-yellow-600">📊 평균 수준입니다. 운동과 식단 관리를 통해 개선할 수 있습니다.</p>
                    )}
                    {result.category.includes("비만") && (
                      <p className="text-red-600">📈 체지방률이 높습니다. 운동과 식단 조절이 필요합니다.</p>
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
                    <h3 className="text-lg font-bold mb-2">⚖️ 스마트 체중계</h3>
                    <p className="text-sm mb-3">체지방률, 근육량, 내장지방까지 한번에 측정</p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      제품 보기 →
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
                  <h3 className="text-xl font-bold text-gray-800 mb-2">💪 퍼스널 트레이닝</h3>
                  <p className="text-gray-600 mb-3">체지방 감량 + 근육량 증가 맞춤 프로그램</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">1:1 관리</span>
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
              
              {/* 체지방률이란? */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">체지방률이란?</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    체지방률은 전체 체중에서 지방이 차지하는 비율을 백분율로 나타낸 수치입니다. 
                    체중계의 숫자보다 체지방률이 건강 상태를 더 정확하게 반영합니다.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    같은 체중이라도 근육량이 많으면 체지방률이 낮고, 지방이 많으면 체지방률이 높습니다. 
                    건강한 다이어트는 체중보다 체지방률 감소에 초점을 맞춰야 합니다.
                  </p>
                </div>
              </section>

              {/* 계산 방법 설명 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">체지방률 계산 방법</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Navy Method (미군 공식)</h3>
                    <p className="text-gray-700 mb-4">
                      미군에서 개발한 공식으로 둘레 측정을 통해 체지방률을 계산합니다. 
                      <strong className="text-orange-600">서구인 기준으로 개발</strong>되어 아시아인에게는 오차가 있을 수 있습니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>남성:</strong> 허리둘레, 목둘레, 키 사용</p>
                      <p><strong>여성:</strong> 허리둘레, 목둘레, 엉덩이둘레, 키 사용</p>
                      <p><strong>정확도:</strong> ±3-4% (서구인 기준)</p>
                      <p className="text-orange-600"><strong>주의:</strong> 한국인은 실제보다 낮게 측정될 수 있음</p>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">YMCA Method</h3>
                    <p className="text-gray-700 mb-4">
                      BMI와 나이를 기반으로 체지방률을 추정하는 방법입니다. 
                      간단하지만 개인차가 있을 수 있습니다.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p><strong>사용 데이터:</strong> BMI, 나이, 성별</p>
                      <p><strong>장점:</strong> 간편한 계산</p>
                      <p><strong>정확도:</strong> ±5-6%</p>
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
                        <div className="text-2xl mb-2">🏃‍♂️</div>
                        <h4 className="font-semibold text-gray-800 mb-1">운동용품</h4>
                        <p className="text-sm text-gray-600 mb-2">홈트레이닝 필수템</p>
                        <div className="text-blue-600 text-sm font-semibold">쇼핑하기</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🥤</div>
                        <h4 className="font-semibold text-gray-800 mb-1">단백질 보충제</h4>
                        <p className="text-sm text-gray-600 mb-2">근육량 증가 도움</p>
                        <div className="text-green-600 text-sm font-semibold">구매하기</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 성별/연령별 체지방률 기준 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">체지방률 기준 (한국인 적용)</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">남성 체지방률 기준</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left">분류</th>
                            <th className="border border-gray-300 px-3 py-2 text-center">한국인 기준</th>
                            <th className="border border-gray-300 px-3 py-2 text-center text-xs">서구인 기준</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">필수지방</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">3-5%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">3-5%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">운동선수</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">6-12%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">6-13%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">건강한 수준</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">13-18%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">14-17%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">평균</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">19-22%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">18-24%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">비만</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">23% 이상</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">25% 이상</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">여성 체지방률 기준</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left">분류</th>
                            <th className="border border-gray-300 px-3 py-2 text-center">한국인 기준</th>
                            <th className="border border-gray-300 px-3 py-2 text-center text-xs">서구인 기준</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">필수지방</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">12-15%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">12-15%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">운동선수</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">16-22%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">16-20%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">건강한 수준</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">23-27%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">21-24%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">평균</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold">28-32%</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">25-31%</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-3 py-2">비만</td>
                            <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-red-600">33% 이상</td>
                            <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-500">32% 이상</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * 한국인 기준은 대한비만학회와 국내 연구 결과를 바탕으로 조정된 수치입니다.
                </p>
              </section>

              {/* 체지방률 관리 방법 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">건강한 체지방률 관리 방법</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">식단 관리</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 균형 잡힌 영양소 섭취</li>
                      <li>• 적절한 칼로리 제한</li>
                      <li>• 단백질 섭취량 늘리기</li>
                      <li>• 가공식품 줄이기</li>
                      <li>• 충분한 수분 섭취</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">운동 관리</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 유산소 운동 (주 3-5회)</li>
                      <li>• 근력 운동 (주 2-3회)</li>
                      <li>• 일상 활동량 늘리기</li>
                      <li>• 규칙적인 운동 습관</li>
                      <li>• 점진적 강도 증가</li>
                    </ul>
                  </div>
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">생활 습관</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• 충분한 수면 (7-8시간)</li>
                      <li>• 스트레스 관리</li>
                      <li>• 금연 및 금주</li>
                      <li>• 규칙적인 생활 패턴</li>
                      <li>• 정기적인 건강 체크</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 한국인 체지방률 특성 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">한국인(아시아인) 체지방률 특성</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    한국인을 포함한 아시아인은 서구인과 체형 특성이 달라 기존 공식에 오차가 있을 수 있습니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">아시아인 특성</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• 같은 BMI라도 체지방률이 더 높음</li>
                        <li>• 내장지방이 더 쉽게 축적됨</li>
                        <li>• 상대적으로 근육량이 적음</li>
                        <li>• 복부 비만이 더 흔함</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">권장사항</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• 서구 기준보다 2-3% 낮은 목표 설정</li>
                        <li>• 인바디 등 정밀 검사 병행</li>
                        <li>• 복부둘레 함께 체크</li>
                        <li>• 정기적인 건강검진 필수</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 border border-gray-200 rounded">
                    <p className="text-sm text-gray-700">
                      💡 <strong>Tip:</strong> 한국인 남성은 23% 이상, 여성은 33% 이상부터 비만으로 보는 것이 적절합니다.
                    </p>
                  </div>
                </div>
              </section>

              {/* 주의사항 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">체지방률 측정 시 주의사항</h2>
                <div className="border border-gray-200 p-6 rounded-lg">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>측정 시간:</strong> 아침 공복 시 측정하는 것이 가장 정확합니다.</li>
                    <li>• <strong>측정 도구:</strong> 줄자를 사용할 때는 수평을 유지하고 적당한 압력으로 측정하세요.</li>
                    <li>• <strong>인종별 차이:</strong> 서구인 기준 공식이므로 한국인에게는 오차가 있을 수 있습니다.</li>
                    <li>• <strong>개인차:</strong> 근육량, 골밀도 등 개인차에 따라 오차가 있을 수 있습니다.</li>
                    <li>• <strong>의학적 상태:</strong> 임신, 부종 등이 있을 때는 정확도가 떨어질 수 있습니다.</li>
                    <li>• <strong>전문 상담:</strong> 정확한 체성분 분석을 위해서는 전문가와 상담하세요.</li>
                  </ul>
                </div>
              </section>

              {/* 관련 계산기 */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaWeight className="text-2xl text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">BMI 계산기</h3>
                    <p className="text-sm text-gray-600">체질량지수 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaRuler className="text-2xl text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">칼로리 계산기</h3>
                    <p className="text-sm text-gray-600">기초대사율 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaUserCheck className="text-2xl text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">이상체중 계산기</h3>
                    <p className="text-sm text-gray-600">목표 체중 계산</p>
                  </div>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaChartLine className="text-2xl text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">근육량 계산기</h3>
                    <p className="text-sm text-gray-600">근육량 추정</p>
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
                    <div className="bg-gradient-to-b from-gray-600 to-gray-700 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">📱 피트니스 앱</h4>
                      <p className="text-sm mb-3">체성분 추적 & 운동 기록</p>
                      <button className="bg-white text-gray-600 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        다운로드
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
                        <h5 className="font-semibold text-sm">인바디 검사</h5>
                        <p className="text-xs text-gray-600">정확한 체성분 분석</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🏋️‍♂️
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">헬스장 회원권</h5>
                        <p className="text-xs text-gray-600">전국 헬스장 할인</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        🥗
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">다이어트 식단</h5>
                        <p className="text-xs text-gray-600">체지방 감량 도시락</p>
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
            이 체지방률 계산기는 Navy Method와 YMCA Method를 기반으로 계산됩니다. 
            실제 체지방률은 개인의 근육량, 골밀도, 수분량 등에 따라 차이가 있을 수 있으므로 
            정확한 측정을 위해서는 인바디 검사나 전문가와 상의하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 