"use client";

import { useState } from "react";
import { 
  FaCalculator, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaInfoCircle,
  FaUserTie,
  FaDollarSign,
  FaShieldAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface SeveranceCalculation {
  yearsOfService: number; // 근속연수
  monthsOfService: number; // 근속개월수
  averageMonthlyWage: number; // 월 평균임금
  severancePay: number; // 퇴직금
  dailyWage: number; // 일당
  monthlyWage: number; // 월급
}

export default function SeverancePayCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyWage, setMonthlyWage] = useState("");
  const [calculationType, setCalculationType] = useState<"date" | "manual">("date");
  const [yearsOfService, setYearsOfService] = useState("");
  const [monthsOfService, setMonthsOfService] = useState("");
  
  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d.]/g, "");
  };

  // 입력 처리 함수
  const handleInputChange = (value: string, setter: (value: string) => void) => {
    const numericValue = extractNumber(value);
    const formattedValue = formatNumber(numericValue);
    setter(formattedValue);
  };

  // 퇴직금 계산
  const calculateSeverance = ((): SeveranceCalculation => {
    const wage = parseFloat(monthlyWage.replace(/[^\d.]/g, "")) || 0;
    
    let years: number;
    let months: number;

    if (calculationType === "date") {
      // 날짜로 계산
      if (!startDate || !endDate) {
        return {
          yearsOfService: 0,
          monthsOfService: 0,
          averageMonthlyWage: wage,
          severancePay: 0,
          dailyWage: Math.round(wage / 30),
          monthlyWage: wage
        };
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      years = Math.floor(diffDays / 365);
      months = Math.floor((diffDays % 365) / 30);
    } else {
      // 수동 입력
      years = parseFloat(yearsOfService.replace(/[^\d.]/g, "")) || 0;
      months = parseFloat(monthsOfService.replace(/[^\d.]/g, "")) || 0;
    }

    const totalMonths = years * 12 + months;
    const averageMonthlyWage = wage;
    
    // 퇴직금 계산: 월 평균임금 × 근속연수
    const severancePay = Math.round(averageMonthlyWage * (totalMonths / 12));
    const dailyWage = Math.round(averageMonthlyWage / 30);

    return {
      yearsOfService: years,
      monthsOfService: months,
      averageMonthlyWage,
      severancePay,
      dailyWage,
      monthlyWage: wage
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaMoneyBillWave className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">퇴직금 계산기</h1>
              <p className="text-gray-600">근속연수, 월 평균임금, 퇴직금 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2" />
                  계산 방식
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as "date" | "manual")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="date">입사일/퇴사일 기준</option>
                  <option value="manual">근속연수 수동 입력</option>
                </select>
              </div>

              {calculationType === "date" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      입사일
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      퇴사일
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      근속연수 (년)
                    </label>
                    <input
                      type="text"
                      value={yearsOfService}
                      onChange={(e) => handleInputChange(e.target.value, setYearsOfService)}
                      placeholder="근속연수를 입력하세요"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      근속개월수 (개월)
                    </label>
                    <input
                      type="text"
                      value={monthsOfService}
                      onChange={(e) => handleInputChange(e.target.value, setMonthsOfService)}
                      placeholder="근속개월수를 입력하세요"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2" />
                  월 평균임금 (원)
                </label>
                <input
                  type="text"
                  value={monthlyWage}
                  onChange={(e) => handleInputChange(e.target.value, setMonthlyWage)}
                  placeholder="월 평균임금을 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">퇴직금 계산 결과</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">근속연수:</span>
                    <span className="font-bold text-lg">{calculateSeverance.yearsOfService}년 {calculateSeverance.monthsOfService}개월</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">월 평균임금:</span>
                    <span className="font-bold text-lg">{calculateSeverance.averageMonthlyWage.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">퇴직금:</span>
                      <span className="font-bold text-xl text-black">{calculateSeverance.severancePay.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">계산 공식</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>• <strong>퇴직금</strong> = 월 평균임금 × 근속연수</div>
                  <div>• <strong>일당</strong> = 월 평균임금 ÷ 30일</div>
                  <div>• <strong>근속연수</strong> = (퇴사일 - 입사일) ÷ 365일</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">퇴직금 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">퇴직금 계산 기준</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>근속연수</strong>: 입사일부터 퇴사일까지</div>
                <div>• <strong>월 평균임금</strong>: 최근 3개월 평균임금</div>
                <div>• <strong>계산 공식</strong>: 월 평균임금 × 근속연수</div>
                <div>• <strong>최소 보장</strong>: 1년 미만 시 30일분</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">주의사항</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>근로기준법</strong>: 1년 이상 근무 시 퇴직금 지급</div>
                <div>• <strong>월 평균임금</strong>: 통상임금 기준 계산</div>
                <div>• <strong>소수점 처리</strong>: 반올림하여 계산</div>
                <div>• <strong>세금</strong>: 퇴직소득세 별도 계산 필요</div>
              </div>
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
            <a href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaDollarSign className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
              <p className="text-xs text-gray-600">소득세 계산</p>
            </a>
            
            <a href="/social-insurance-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaShieldAlt className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">4대보험 계산기</h4>
              <p className="text-xs text-gray-600">보험료 계산</p>
            </a>
            
            <a href="/salary-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">프리랜서 세금</h4>
              <p className="text-xs text-gray-600">프리랜서 세금</p>
            </a>
            
            <a href="/freelancer-withholding-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">원천징수세 계산기</h4>
              <p className="text-xs text-gray-600">원천징수 계산</p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 