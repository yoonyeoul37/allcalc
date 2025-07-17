"use client";

import { useState } from "react";
import { FaCalculator, FaHeart, FaMoneyBillWave, FaTools, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaWeight, FaRuler, FaChartLine, FaUser, FaDumbbell, FaAppleAlt, FaBaby, FaCalendarAlt } from "react-icons/fa";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaCalculator className="mr-3 text-black" />
              BMI 계산기
            </h1>
            <p className="text-lg text-gray-600">체질량지수(Body Mass Index)를 계산하여 비만도를 확인하세요</p>
          </div>

          {/* BMI 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaRuler className="inline mr-2 text-black" />
                  신장 (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="예: 170"
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
                  placeholder="예: 65"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateBMI}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                <FaCalculator className="mr-2 inline" />
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
          </div>

          {/* 설명 및 주의사항 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-black" />
              BMI 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">📏 BMI 계산 공식</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-800 mb-2">
                      BMI = 체중(kg) ÷ [신장(m)]²
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>예시:</strong> 신장 170cm, 체중 65kg인 경우</p>
                      <p>BMI = 65 ÷ (1.7 × 1.7) = 65 ÷ 2.89 = 22.5</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏥 BMI 기준표 (아시아-태평양 기준)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-2 text-sm font-semibold">BMI 범위</th>
                        <th className="border border-gray-200 px-3 py-2 text-sm font-semibold">분류</th>
                        <th className="border border-gray-200 px-3 py-2 text-sm font-semibold">질병 위험도</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2">18.5 미만</td>
                        <td className="border border-gray-200 px-3 py-2 text-blue-600 font-semibold">저체중</td>
                        <td className="border border-gray-200 px-3 py-2">낮음</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border border-gray-200 px-3 py-2">18.5 - 22.9</td>
                        <td className="border border-gray-200 px-3 py-2 text-green-600 font-semibold">정상체중</td>
                        <td className="border border-gray-200 px-3 py-2">평균</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2">23.0 - 24.9</td>
                        <td className="border border-gray-200 px-3 py-2 text-yellow-600 font-semibold">과체중</td>
                        <td className="border border-gray-200 px-3 py-2">증가</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2">25.0 - 29.9</td>
                        <td className="border border-gray-200 px-3 py-2 text-orange-600 font-semibold">비만 1단계</td>
                        <td className="border border-gray-200 px-3 py-2">중등도 증가</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2">30.0 - 34.9</td>
                        <td className="border border-gray-200 px-3 py-2 text-red-600 font-semibold">비만 2단계</td>
                        <td className="border border-gray-200 px-3 py-2">심각한 증가</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-3 py-2">35.0 이상</td>
                        <td className="border border-gray-200 px-3 py-2 text-red-700 font-semibold">비만 3단계</td>
                        <td className="border border-gray-200 px-3 py-2">매우 심각한 증가</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                  <li>• BMI는 근육량이나 체지방률을 고려하지 않으므로 참고용으로만 사용하세요</li>
                  <li>• 정확한 건강 상태 판단을 위해서는 전문의와 상담하시기 바랍니다</li>
                  <li>• 운동선수나 임산부 등 특수한 경우에는 다른 기준이 적용될 수 있습니다</li>
                  <li>• BMI는 성인 기준이며, 아동과 청소년에게는 다른 기준이 적용됩니다</li>
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
              
              <a href="/body-fat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">체지방률 계산기</h4>
                <p className="text-xs text-gray-600">체지방 측정</p>
              </a>
              
              <a href="/calorie-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaAppleAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">칼로리 계산기</h4>
                <p className="text-xs text-gray-600">칼로리 계산</p>
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