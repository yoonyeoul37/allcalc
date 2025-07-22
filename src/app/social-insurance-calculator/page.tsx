"use client";

import { useState } from "react";
import Link from "next/link";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface InsuranceCalculation {
  nationalPension: number; // 국민연금
  healthInsurance: number; // 건강보험
  longTermCare: number; // 장기요양보험
  employmentInsurance: number; // 고용보험
  totalInsurance: number; // 총 보험료
  employeeShare: number; // 근로자 부담금
  employerShare: number; // 사업주 부담금
}

interface InsuranceRate {
  nationalPension: number; // 국민연금율
  healthInsurance: number; // 건강보험율
  longTermCare: number; // 장기요양보험율
  employmentInsurance: number; // 고용보험율
}

export default function SocialInsuranceCalculator() {
  const [activeTab, setActiveTab] = useState<'total' | 'national' | 'health' | 'employment' | 'industrial'>('total');
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employeeCount, setEmployeeCount] = useState<'under150' | 'over150' | 'over1000' | 'government'>('under150');
  
  // 2025년 기준 보험료율 (근로자수별 차등 적용)
  const getInsuranceRates = (employeeCount: string): InsuranceRate => {
    switch (employeeCount) {
      case 'under150': // 150인 미만 기업
        return {
          nationalPension: 9.0, // 국민연금 9.0%
          healthInsurance: 7.09, // 건강보험 7.09%
          longTermCare: 0.918, // 장기요양보험 0.918%
          employmentInsurance: 1.8 // 고용보험 1.8%
        };
      case 'over150': // 150인 이상(우선지원 대상기업)
        return {
          nationalPension: 9.0, // 국민연금 9.0%
          healthInsurance: 7.09, // 건강보험 7.09%
          longTermCare: 0.918, // 장기요양보험 0.918%
          employmentInsurance: 1.5 // 고용보험 1.5% (감면)
        };
      case 'over1000': // 150인 이상 1,000인 미만 기업
        return {
          nationalPension: 9.0, // 국민연금 9.0%
          healthInsurance: 7.09, // 건강보험 7.09%
          longTermCare: 0.918, // 장기요양보험 0.918%
          employmentInsurance: 1.8 // 고용보험 1.8%
        };
      case 'government': // 1,000인 이상 기업, 국가 지방자치단체
        return {
          nationalPension: 9.0, // 국민연금 9.0%
          healthInsurance: 7.09, // 건강보험 7.09%
          longTermCare: 0.918, // 장기요양보험 0.918%
          employmentInsurance: 2.0 // 고용보험 2.0% (대기업)
        };
      default:
        return {
          nationalPension: 9.0,
          healthInsurance: 7.09,
          longTermCare: 0.918,
          employmentInsurance: 1.8
        };
    }
  };

  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    // 이미 콤마가 있는 경우 제거 후 다시 포맷팅
    const cleanValue = value.replace(/,/g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  const calculateInsurance = (): InsuranceCalculation => {
    const salary = parseFloat(monthlySalary.replace(/[^\d.]/g, "")) || 0;
    const rates = getInsuranceRates(employeeCount);
    
    if (salary === 0) {
      return {
        nationalPension: 0,
        healthInsurance: 0,
        longTermCare: 0,
        employmentInsurance: 0,
        totalInsurance: 0,
        employeeShare: 0,
        employerShare: 0
      };
    }

    // 보험료 계산
    const nationalPension = Math.round(salary * (rates.nationalPension / 100));
    const healthInsurance = Math.round(salary * (rates.healthInsurance / 100));
    const longTermCare = Math.round(salary * (rates.longTermCare / 100));
    const employmentInsurance = Math.round(salary * (rates.employmentInsurance / 100));

    // 근로자 부담금 (국민연금 4.5%, 건강보험 3.545%, 장기요양 0.459%, 고용보험 비율은 규모별 차등)
    let employeeEmploymentRate = 0.009; // 기본 0.9%
    if (employeeCount === 'over150') {
      employeeEmploymentRate = 0.0075; // 0.75% (감면)
    } else if (employeeCount === 'government') {
      employeeEmploymentRate = 0.01; // 1.0% (대기업)
    }

    const employeeShare = Math.round(salary * 0.045) + Math.round(salary * 0.03545) + 
                         Math.round(salary * 0.00459) + Math.round(salary * employeeEmploymentRate);
    
    // 사업주 부담금 (나머지)
    const employerShare = nationalPension + healthInsurance + longTermCare + employmentInsurance - employeeShare;

    const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

    return {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      totalInsurance,
      employeeShare,
      employerShare
    };
  };

  const result = calculateInsurance();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">4대사회보험료 모의계산</h1>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('total')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'total'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveTab('national')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'national'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              국민연금
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'health'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              건강보험
            </button>
            <button
              onClick={() => setActiveTab('employment')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'employment'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              고용보험
            </button>
            <button
              onClick={() => setActiveTab('industrial')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'industrial'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              산재보험
            </button>
          </div>

          {/* 정보 메시지 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <FaExclamationTriangle className="text-yellow-600 mr-2" />
              <span className="text-gray-700">2025년 기준(계산내용은 모의계산이기 때문에 실제와 다를 수 있습니다.)</span>
            </div>
          </div>

          {/* 입력 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월급여
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={monthlySalary}
                  onChange={(e) => handleInputChange(e.target.value, setMonthlySalary)}
                  placeholder="2,000,000"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
                <span className="text-gray-600">원</span>
                <button
                  onClick={() => {}} // 계산 함수
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  계산
                </button>
                <button
                  onClick={() => setMonthlySalary("")}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                근로자수
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeCount"
                    value="under150"
                    checked={employeeCount === 'under150'}
                    onChange={(e) => setEmployeeCount(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">150인 미만 기업</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeCount"
                    value="over150"
                    checked={employeeCount === 'over150'}
                    onChange={(e) => setEmployeeCount(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">150인 이상(우선지원 대상기업)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeCount"
                    value="over1000"
                    checked={employeeCount === 'over1000'}
                    onChange={(e) => setEmployeeCount(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">150인 이상 1,000인 미만 기업</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="employeeCount"
                    value="government"
                    checked={employeeCount === 'government'}
                    onChange={(e) => setEmployeeCount(e.target.value as any)}
                    className="mr-2"
                  />
                  <span className="text-sm">1,000인 이상 기업, 국가 지방자치단체</span>
                </label>
              </div>
            </div>
          </div>

          {/* 계산 결과 테이블 */}
          {monthlySalary && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">구분</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">보험료 총액</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">근로자 부담금</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">사업주 부담금</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">국민연금</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{result.nationalPension.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.nationalPension / 2).toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.nationalPension / 2).toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">건강보험</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{result.healthInsurance.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.healthInsurance / 2).toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.healthInsurance / 2).toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">건강보험(장기요양)</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{result.longTermCare.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.longTermCare / 2).toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.longTermCare / 2).toLocaleString()}원</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-medium">고용보험</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{result.employmentInsurance.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.employmentInsurance * 0.4).toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{Math.round(result.employmentInsurance * 0.6).toLocaleString()}원</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-gray-300 px-4 py-3 font-bold">합계</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">{result.totalInsurance.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">{result.employeeShare.toLocaleString()}원</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-bold">{result.employerShare.toLocaleString()}원</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 하단 안내 */}
          <div className="mt-6 space-y-4">
            <p className="text-red-600 text-sm">※ 산재보험료는 별도로 확인하시기 바랍니다.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              산재보험료율 및 산재보험료 알아보기
            </button>
          </div>
        </div>

        {/* 관련 계산기 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalculator className="mr-2 text-black" />
            관련 계산기
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaDollarSign className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
              <p className="text-xs text-gray-600">소득세 계산</p>
            </Link>
            
            <Link href="/salary-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">프리랜서 세금</h4>
              <p className="text-xs text-gray-600">프리랜서 세금</p>
            </Link>
            
            <Link href="/severance-pay-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaMoneyBillWave className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">퇴직금 계산기</h4>
              <p className="text-xs text-gray-600">퇴직금 계산</p>
            </Link>
            
            <Link href="/freelancer-withholding-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">원천징수세 계산기</h4>
              <p className="text-xs text-gray-600">원천징수 계산</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
