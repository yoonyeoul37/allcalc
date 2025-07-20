"use client";

import { useState } from "react";
import { 
  FaShieldAlt, 
  FaCalculator, 
  FaMoneyBillWave,
  FaInfoCircle,
  FaUserTie,
  FaDollarSign
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface InsuranceCalculation {
  healthInsurance: number; // 건강보험
  nationalPension: number; // 국민연금
  employmentInsurance: number; // 고용보험
  industrialAccident: number; // 산재보험
  totalInsurance: number; // 총 보험료
  employerShare: number; // 사업주 부담
  employeeShare: number; // 근로자 부담
}

interface InsuranceRate {
  healthInsurance: number; // 건강보험율
  nationalPension: number; // 국민연금율
  employmentInsurance: number; // 고용보험율
  industrialAccident: number; // 산재보험율
}

export default function SocialInsuranceCalculator() {
  const [monthlySalary, setMonthlySalary] = useState("");
  const [insuranceType, setInsuranceType] = useState<"employee" | "employer" | "freelancer">("employee");
  const [calculationType, setCalculationType] = useState<"monthly" | "annual">("monthly");
  
  // 2024년 기준 보험료율
  const rates: InsuranceRate = {
    healthInsurance: 3.545, // 건강보험 3.545%
    nationalPension: 9.0, // 국민연금 9.0%
    employmentInsurance: 1.05, // 고용보험 1.05%
    industrialAccident: 0.8 // 산재보험 0.8% (업종별 차등)
  };

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

  // 4대보험 계산
  const calculateInsurance = ((): InsuranceCalculation => {
    const salary = parseFloat(monthlySalary.replace(/[^\d.]/g, "")) || 0;
    const annualSalary = calculationType === "monthly" ? salary * 12 : salary;
    const monthlySalaryForCalc = calculationType === "monthly" ? salary : salary / 12;
    
    if (salary === 0) {
      return {
        healthInsurance: 0,
        nationalPension: 0,
        employmentInsurance: 0,
        industrialAccident: 0,
        totalInsurance: 0,
        employerShare: 0,
        employeeShare: 0
      };
    }

    // 보험료 계산
    const healthInsurance = Math.round(monthlySalaryForCalc * (rates.healthInsurance / 100));
    const nationalPension = Math.round(monthlySalaryForCalc * (rates.nationalPension / 100));
    const employmentInsurance = Math.round(monthlySalaryForCalc * (rates.employmentInsurance / 100));
    const industrialAccident = Math.round(monthlySalaryForCalc * (rates.industrialAccident / 100));

    let employerShare: number;
    let employeeShare: number;

    switch (insuranceType) {
      case "employee": // 근로자
        employerShare = healthInsurance + nationalPension + employmentInsurance + industrialAccident;
        employeeShare = healthInsurance + nationalPension + employmentInsurance;
        break;
      
      case "employer": // 사업주
        employerShare = healthInsurance + nationalPension + employmentInsurance + industrialAccident;
        employeeShare = 0;
        break;
      
      case "freelancer": // 프리랜서
        employerShare = 0;
        employeeShare = healthInsurance + nationalPension + employmentInsurance + industrialAccident;
        break;
      
      default:
        employerShare = healthInsurance + nationalPension + employmentInsurance + industrialAccident;
        employeeShare = healthInsurance + nationalPension + employmentInsurance;
    }

    const totalInsurance = employerShare + employeeShare;

    return {
      healthInsurance,
      nationalPension,
      employmentInsurance,
      industrialAccident,
      totalInsurance,
      employerShare,
      employeeShare
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaShieldAlt className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">4대보험 계산기</h1>
              <p className="text-gray-600">건강보험, 국민연금, 고용보험, 산재보험 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserTie className="inline mr-2" />
                  보험 가입자 유형
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value as "employee" | "employer" | "freelancer")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="employee">근로자</option>
                  <option value="employer">사업주</option>
                  <option value="freelancer">프리랜서</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2" />
                  계산 기준
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as "monthly" | "annual")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="monthly">월 급여 기준</option>
                  <option value="annual">연 급여 기준</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2" />
                  {calculationType === "monthly" ? "월 급여" : "연 급여"} (원)
                </label>
                <input
                  type="text"
                  value={monthlySalary}
                  onChange={(e) => handleInputChange(e.target.value, setMonthlySalary)}
                  placeholder={`${calculationType === "monthly" ? "월 급여" : "연 급여"}를 입력하세요`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">보험료 계산 결과</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>건강보험 ({rates.healthInsurance}%):</span>
                    <span className="font-semibold">{calculateInsurance.healthInsurance.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>국민연금 ({rates.nationalPension}%):</span>
                    <span className="font-semibold">{calculateInsurance.nationalPension.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>고용보험 ({rates.employmentInsurance}%):</span>
                    <span className="font-semibold">{calculateInsurance.employmentInsurance.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>산재보험 ({rates.industrialAccident}%):</span>
                    <span className="font-semibold">{calculateInsurance.industrialAccident.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>총 보험료:</span>
                      <span>{calculateInsurance.totalInsurance.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">부담 구분</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>사업주 부담:</span>
                    <span className="font-semibold text-blue-600">{calculateInsurance.employerShare.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>근로자 부담:</span>
                    <span className="font-semibold text-green-600">{calculateInsurance.employeeShare.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">4대보험 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">보험료율 (2024년 기준)</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>건강보험</strong>: 3.545% (사업주 3.545%, 근로자 3.545%)</div>
                <div>• <strong>국민연금</strong>: 9.0% (사업주 4.5%, 근로자 4.5%)</div>
                <div>• <strong>고용보험</strong>: 1.05% (사업주 0.8%, 근로자 0.25%)</div>
                <div>• <strong>산재보험</strong>: 0.8% (사업주 전액 부담)</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">가입자별 특징</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>근로자</strong>: 사업주와 분담, 4대보험 모두 가입</div>
                <div>• <strong>사업주</strong>: 전액 부담, 근로자 부담분 포함</div>
                <div>• <strong>프리랜서</strong>: 전액 개인 부담, 산재보험 제외</div>
                <div>• <strong>산재보험</strong>: 업종별 차등 적용 (0.5~27%)</div>
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
            
            <a href="/salary-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">프리랜서 세금</h4>
              <p className="text-xs text-gray-600">프리랜서 세금</p>
            </a>
            
            <a href="/severance-pay-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaMoneyBillWave className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">퇴직금 계산기</h4>
              <p className="text-xs text-gray-600">퇴직금 계산</p>
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