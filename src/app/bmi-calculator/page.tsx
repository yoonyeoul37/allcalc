"use client";

import { useState } from "react";
import { FaCalculator, FaHeart, FaMoneyBillWave, FaTools } from "react-icons/fa";
import Header from '../../components/ui/Header';

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");

  const calculateBMI = () => {
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInM > 0 && weightInKg > 0) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBmi(bmiValue);
      
      if (bmiValue < 18.5) {
        setCategory("저체중");
      } else if (bmiValue >= 18.5 && bmiValue < 23) {
        setCategory("정상체중");
      } else if (bmiValue >= 23 && bmiValue < 25) {
        setCategory("과체중");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setCategory("비만 1단계");
      } else if (bmiValue >= 30 && bmiValue < 35) {
        setCategory("비만 2단계");
      } else {
        setCategory("비만 3단계 (고도비만)");
      }
    }
  };

  const clear = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  const getBMIColor = (bmiValue: number) => {
    if (bmiValue < 18.5) return "text-blue-600";
    if (bmiValue >= 18.5 && bmiValue < 23) return "text-green-600";
    if (bmiValue >= 23 && bmiValue < 25) return "text-yellow-600";
    if (bmiValue >= 25 && bmiValue < 30) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">BMI 계산기</h1>
            <p className="text-lg text-gray-600">체질량지수(Body Mass Index)를 계산하여 비만도를 확인하세요</p>
          </div>

          {/* BMI 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">신장 (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="예: 170"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">체중 (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="예: 65"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateBMI}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                BMI 계산하기
              </button>
              <button
                onClick={clear}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {bmi !== null && (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-800">BMI: </span>
                  <span className={`text-3xl font-bold ${getBMIColor(bmi)}`}>
                    {bmi.toFixed(1)}
                  </span>
                </div>
                <div className={`text-xl font-semibold ${getBMIColor(bmi)}`}>
                  {category}
                </div>
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 (구글 애드센스 스타일) */}
            {bmi !== null && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🏃‍♀️ 건강한 다이어트 프로그램</h3>
                    <p className="text-sm mb-3">전문 영양사가 설계한 맞춤형 식단 + 운동 플랜</p>
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      무료 체험하기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 (배너 광고) */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">💊 건강 보조제 할인 특가</h3>
                  <p className="text-gray-600 mb-3">비타민, 오메가3, 프로바이오틱스 최대 50% 할인</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">50% OFF</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">무료배송</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                    지금 쇼핑하기
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
          
          {/* BMI란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI(체질량지수)란?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                BMI(Body Mass Index, 체질량지수)는 키와 몸무게를 이용하여 지방의 양을 추정하는 비만 측정법입니다. 
                성인의 비만도를 나타내는 지수로, 체중(kg)을 신장(m)의 제곱으로 나눈 값입니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                BMI는 간단하고 빠르게 계산할 수 있어 널리 사용되지만, 근육량이나 체지방률을 고려하지 않으므로 
                정확한 건강 상태 판단을 위해서는 다른 지표들과 함께 종합적으로 평가해야 합니다.
              </p>
            </div>
          </section>

          {/* BMI 계산 공식 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI 계산 공식</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800 mb-4">
                  BMI = 체중(kg) ÷ [신장(m)]²
                </div>
                <div className="text-gray-700">
                  <p className="mb-2"><strong>예시:</strong> 신장 170cm, 체중 65kg인 경우</p>
                  <p>BMI = 65 ÷ (1.7 × 1.7) = 65 ÷ 2.89 = 22.5</p>
                </div>
              </div>
            </div>
          </section>

          {/* BMI 표준표 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI 기준표 (아시아-태평양 기준)</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">BMI 범위</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">분류</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">질병 위험도</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">18.5 미만</td>
                    <td className="border border-gray-300 px-4 py-3 text-blue-600 font-semibold">저체중</td>
                    <td className="border border-gray-300 px-4 py-3">낮음</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3">18.5 - 22.9</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">정상체중</td>
                    <td className="border border-gray-300 px-4 py-3">평균</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">23.0 - 24.9</td>
                    <td className="border border-gray-300 px-4 py-3 text-yellow-600 font-semibold">과체중</td>
                    <td className="border border-gray-300 px-4 py-3">증가</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">25.0 - 29.9</td>
                    <td className="border border-gray-300 px-4 py-3 text-orange-600 font-semibold">비만 1단계</td>
                    <td className="border border-gray-300 px-4 py-3">중등도 증가</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">30.0 - 34.9</td>
                    <td className="border border-gray-300 px-4 py-3 text-red-600 font-semibold">비만 2단계</td>
                    <td className="border border-gray-300 px-4 py-3">심각한 증가</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">35.0 이상</td>
                    <td className="border border-gray-300 px-4 py-3 text-red-700 font-semibold">비만 3단계 (고도비만)</td>
                    <td className="border border-gray-300 px-4 py-3">매우 심각한 증가</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 광고 3: 정보 섹션 중간 (구글 애드센스 스타일) */}
          <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-4">Google AdSense</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚖️</div>
                    <h4 className="font-semibold text-gray-800 mb-1">스마트 체중계</h4>
                    <p className="text-sm text-gray-600 mb-2">BMI, 체지방률 자동 측정</p>
                    <div className="text-blue-600 text-sm font-semibold">₩49,900</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏋️‍♀️</div>
                    <h4 className="font-semibold text-gray-800 mb-1">홈트레이닝 앱</h4>
                    <p className="text-sm text-gray-600 mb-2">AI 맞춤 운동 프로그램</p>
                    <div className="text-green-600 text-sm font-semibold">무료 체험</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 건강 정보 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI와 건강</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">정상 BMI 유지의 중요성</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 심혈관 질환 위험 감소</li>
                  <li>• 당뇨병 예방</li>
                  <li>• 고혈압 위험 감소</li>
                  <li>• 관절 건강 유지</li>
                                     <li>• 수면 무호흡증 예방</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">BMI 개선 방법</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 균형 잡힌 식단 유지</li>
                  <li>• 규칙적인 운동 (주 3-4회)</li>
                  <li>• 충분한 수면 (7-8시간)</li>
                  <li>• 스트레스 관리</li>
                  <li>• 금연 및 금주</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">BMI 계산기 사용 시 주의사항</h2>
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                <li>• <strong>근육량 고려 불가:</strong> 근육이 발달한 운동선수의 경우 실제보다 높은 BMI가 나올 수 있습니다.</li>
                <li>• <strong>연령 제한:</strong> 18세 이하 및 65세 이상에서는 다른 기준이 적용됩니다.</li>
                <li>• <strong>임신 중 사용 금지:</strong> 임신 중인 여성은 BMI 계산이 부정확할 수 있습니다.</li>
                <li>• <strong>체지방률 미고려:</strong> 같은 BMI라도 체지방률에 따라 건강 상태가 다를 수 있습니다.</li>
                <li>• <strong>의료진 상담:</strong> 정확한 건강 상태 판단을 위해서는 전문의와 상담하세요.</li>
              </ul>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaHeart className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">기초대사율 계산기</h3>
                <p className="text-sm text-gray-600">하루 필요 칼로리 계산</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">칼로리 계산기</h3>
                <p className="text-sm text-gray-600">음식별 칼로리 계산</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaTools className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">체지방률 계산기</h3>
                <p className="text-sm text-gray-600">체지방 비율 측정</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaHeart className="text-2xl text-orange-600" />
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
                    <div className="bg-gradient-to-b from-orange-400 to-pink-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🍎 건강식품</h4>
                      <p className="text-sm mb-3">프리미엄 유기농 건강식품 모음</p>
                      <button className="bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        구경하기
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
                        📱
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">칼로리 계산 앱</h5>
                        <p className="text-xs text-gray-600">음식 칼로리 자동 계산</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🏃
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">러닝 트래커</h5>
                        <p className="text-xs text-gray-600">운동량 자동 기록</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        💤
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">수면 분석기</h5>
                        <p className="text-xs text-gray-600">수면 패턴 분석</p>
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
            이 BMI 계산기는 일반적인 가이드라인을 제공하며, 개인의 건강 상태를 정확히 진단하지는 않습니다. 
            정확한 건강 평가를 위해서는 의료 전문가와 상담하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 