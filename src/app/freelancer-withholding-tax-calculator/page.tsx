"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaCalculator, 
  FaMoneyBillWave, 
  FaPercent,
  FaInfoCircle,
  FaUserTie,
  FaDollarSign,
  FaShieldAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface WithholdingTaxCalculation {
  annualIncome: number; // 연간 소득
  taxableIncome: number; // 과세표준
  taxRate: number; // 세율
  withholdingTax: number; // 원천징수세
  netIncome: number; // 실수령액
  monthlyWithholdingTax: number; // 월 원천징수세
  monthlyNetIncome: number; // 월 실수령액
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

export default function FreelancerWithholdingTaxCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [calculationType, setCalculationType] = useState<"monthly" | "annual">("monthly");
  
  // 2024년 프리랜서 원천징수세율
  const taxBrackets: TaxBracket[] = [
    { min: 0, max: 12000000, rate: 3, deduction: 0 },
    { min: 12000000, max: 46000000, rate: 15, deduction: 1440000 },
    { min: 46000000, max: 88000000, rate: 24, deduction: 5120000 },
    { min: 88000000, max: 150000000, rate: 35, deduction: 14960000 },
    { min: 150000000, max: 300000000, rate: 38, deduction: 19400000 },
    { min: 300000000, max: 500000000, rate: 40, deduction: 25400000 },
    { min: 500000000, max: Infinity, rate: 42, deduction: 35400000 }
  ];

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

  // 세율 계산 함수
  const calculateTaxRate = (income: number): { rate: number; deduction: number } => {
    for (const bracket of taxBrackets) {
      if (income >= bracket.min && income <= bracket.max) {
        return { rate: bracket.rate, deduction: bracket.deduction };
      }
    }
    return { rate: 42, deduction: 35400000 };
  };

  // 원천징수세 계산
  const calculateWithholdingTax = ((): WithholdingTaxCalculation => {
    const income = parseFloat(monthlyIncome.replace(/[^\d.]/g, "")) || 0;
    
    if (income === 0) {
      return {
        annualIncome: 0,
        taxableIncome: 0,
        taxRate: 0,
        withholdingTax: 0,
        netIncome: 0,
        monthlyWithholdingTax: 0,
        monthlyNetIncome: 0
      };
    }

    // 연간 소득 계산
    const annualIncome = calculationType === "monthly" ? income * 12 : income;
    
    // 과세표준 (기본공제 150만원 적용)
    const basicDeduction = 1500000; // 기본공제 150만원
    const taxableIncome = Math.max(0, annualIncome - basicDeduction);
    
    // 세율 및 세액 계산
    const { rate, deduction } = calculateTaxRate(taxableIncome);
    const withholdingTax = Math.round((taxableIncome * (rate / 100)) - deduction);
    
    // 실수령액 계산
    const netIncome = annualIncome - withholdingTax;
    const monthlyWithholdingTax = Math.round(withholdingTax / 12);
    const monthlyNetIncome = calculationType === "monthly" ? income - monthlyWithholdingTax : netIncome / 12;

    return {
      annualIncome,
      taxableIncome,
      taxRate: rate,
      withholdingTax,
      netIncome,
      monthlyWithholdingTax,
      monthlyNetIncome
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaUserTie className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">프리랜서 원천징수세 계산기</h1>
              <p className="text-gray-600">과세표준, 세율, 원천징수세 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2" />
                  계산 기준
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as "monthly" | "annual")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="monthly">월 소득 기준</option>
                  <option value="annual">연 소득 기준</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2" />
                  {calculationType === "monthly" ? "월 소득" : "연 소득"} (원)
                </label>
                <input
                  type="text"
                  value={monthlyIncome}
                  onChange={(e) => handleInputChange(e.target.value, setMonthlyIncome)}
                  placeholder={`${calculationType === "monthly" ? "월 소득" : "연 소득"}을 입력하세요`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">과세표준 계산</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>연간 소득:</span>
                    <span className="font-semibold">{calculateWithholdingTax.annualIncome.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>기본공제 (150만원):</span>
                    <span className="font-semibold text-green-600">-1,500,000원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>과세표준:</span>
                      <span>{calculateWithholdingTax.taxableIncome.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">원천징수세 계산</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>적용 세율:</span>
                    <span className="font-semibold">{calculateWithholdingTax.taxRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>연간 원천징수세:</span>
                    <span className="font-semibold text-red-600">{calculateWithholdingTax.withholdingTax.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>월 원천징수세:</span>
                    <span className="font-semibold text-red-600">{calculateWithholdingTax.monthlyWithholdingTax.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">실수령액 계산</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>연간 실수령액:</span>
                    <span className="font-semibold text-green-600">{calculateWithholdingTax.netIncome.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>월 실수령액:</span>
                    <span className="font-semibold text-green-600">{calculateWithholdingTax.monthlyNetIncome.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 세율표 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaPercent className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">프리랜서 원천징수세율표 (2024년)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border">과세표준</th>
                  <th className="p-3 text-center border">세율</th>
                  <th className="p-3 text-center border">누진공제</th>
                </tr>
              </thead>
              <tbody>
                {taxBrackets.map((bracket, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">
                      {bracket.min.toLocaleString()}원 ~ {bracket.max === Infinity ? "초과" : bracket.max.toLocaleString() + "원"}
                    </td>
                    <td className="p-3 text-center border font-semibold">{bracket.rate}%</td>
                    <td className="p-3 text-center border">{bracket.deduction.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">프리랜서 원천징수세 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">원천징수세란?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>의뢰인이 공제</strong>: 용역 대가 지급 시 세금 공제</div>
                <div>• <strong>원천징수영수증</strong>: 세금 공제 후 발급받아야 함</div>
                <div>• <strong>연말정산</strong>: 추가 납부 또는 환급 가능</div>
                <div>• <strong>기본공제</strong>: 연 150만원 기본공제 적용</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">주의사항</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>과세표준</strong>: 연간 소득 - 기본공제 150만원</div>
                <div>• <strong>누진세율</strong>: 과세표준에 따른 차등 세율</div>
                <div>• <strong>연말정산</strong>: 추가 공제사항 반영 가능</div>
                <div>• <strong>신고의무</strong>: 연간 소득 500만원 초과 시 신고</div>
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
            
            <Link href="/social-insurance-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaShieldAlt className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">4대보험 계산기</h4>
              <p className="text-xs text-gray-600">보험료 계산</p>
            </Link>
            
            <Link href="/severance-pay-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaMoneyBillWave className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">퇴직금 계산기</h4>
              <p className="text-xs text-gray-600">퇴직금 계산</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
