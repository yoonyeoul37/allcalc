"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaMoneyBillWave, FaFileInvoiceDollar, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function WorkIncomeTaxRefundCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [withheldTax, setWithheldTax] = useState('');
  const [basicDeduction, setBasicDeduction] = useState('1500000');
  const [additionalDeduction, setAdditionalDeduction] = useState('');
  const [specialDeduction, setSpecialDeduction] = useState('');
  const [insuranceDeduction, setInsuranceDeduction] = useState('');
  const [medicalDeduction, setMedicalDeduction] = useState('');
  const [educationDeduction, setEducationDeduction] = useState('');
  const [donationDeduction, setDonationDeduction] = useState('');
  const [result, setResult] = useState<{
    totalDeduction: number;
    taxableIncome: number;
    calculatedTax: number;
    refundAmount: number;
    additionalTax: number;
  } | null>(null);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateRefund = () => {
    if (!annualSalary || !withheldTax) {
      alert('연간 급여와 원천징수 세금을 입력해주세요.');
      return;
    }

    const salary = parseNumber(annualSalary);
    const withheld = parseNumber(withheldTax);
    const basic = parseNumber(basicDeduction) || 1500000;
    const additional = parseNumber(additionalDeduction) || 0;
    const special = parseNumber(specialDeduction) || 0;
    const insurance = parseNumber(insuranceDeduction) || 0;
    const medical = parseNumber(medicalDeduction) || 0;
    const education = parseNumber(educationDeduction) || 0;
    const donation = parseNumber(donationDeduction) || 0;

    const totalDeduction = basic + additional + special + insurance + medical + education + donation;
    const taxableIncome = Math.max(0, salary - totalDeduction);

    // 한국 근로소득세 세율 (2024년 기준)
    let calculatedTax = 0;

    if (taxableIncome <= 12000000) {
      calculatedTax = taxableIncome * 0.06;
    } else if (taxableIncome <= 46000000) {
      calculatedTax = 720000 + (taxableIncome - 12000000) * 0.15;
    } else if (taxableIncome <= 88000000) {
      calculatedTax = 5820000 + (taxableIncome - 46000000) * 0.24;
    } else if (taxableIncome <= 150000000) {
      calculatedTax = 15900000 + (taxableIncome - 88000000) * 0.35;
    } else if (taxableIncome <= 300000000) {
      calculatedTax = 37600000 + (taxableIncome - 150000000) * 0.38;
    } else if (taxableIncome <= 500000000) {
      calculatedTax = 94600000 + (taxableIncome - 300000000) * 0.40;
    } else {
      calculatedTax = 174600000 + (taxableIncome - 500000000) * 0.42;
    }

    const refundAmount = Math.max(0, withheld - calculatedTax);
    const additionalTax = Math.max(0, calculatedTax - withheld);

    setResult({
      totalDeduction: Math.round(totalDeduction),
      taxableIncome: Math.round(taxableIncome),
      calculatedTax: Math.round(calculatedTax),
      refundAmount: Math.round(refundAmount),
      additionalTax: Math.round(additionalTax)
    });
  };

  const resetCalculator = () => {
    setAnnualSalary('');
    setWithheldTax('');
    setBasicDeduction('1500000');
    setAdditionalDeduction('');
    setSpecialDeduction('');
    setInsuranceDeduction('');
    setMedicalDeduction('');
    setEducationDeduction('');
    setDonationDeduction('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaMoneyBillWave className="mr-3 text-[#003366]" />
              근로소득세 연말정산 환급액 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연간 급여 (원)
                </label>
                <input
                  type="text"
                  value={annualSalary}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setAnnualSalary(formatNumber(value));
                  }}
                  placeholder="예: 50,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  원천징수 세금 (원)
                </label>
                <input
                  type="text"
                  value={withheldTax}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setWithheldTax(formatNumber(value));
                  }}
                  placeholder="예: 3,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본공제 (원)
                </label>
                <input
                  type="text"
                  value={basicDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setBasicDeduction(formatNumber(value));
                  }}
                  placeholder="예: 1,500,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가공제 (원)
                </label>
                <input
                  type="text"
                  value={additionalDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setAdditionalDeduction(formatNumber(value));
                  }}
                  placeholder="예: 500,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  특별공제 (원)
                </label>
                <input
                  type="text"
                  value={specialDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setSpecialDeduction(formatNumber(value));
                  }}
                  placeholder="예: 1,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보험료공제 (원)
                </label>
                <input
                  type="text"
                  value={insuranceDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setInsuranceDeduction(formatNumber(value));
                  }}
                  placeholder="예: 300,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  의료비공제 (원)
                </label>
                <input
                  type="text"
                  value={medicalDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMedicalDeduction(formatNumber(value));
                  }}
                  placeholder="예: 200,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  교육비공제 (원)
                </label>
                <input
                  type="text"
                  value={educationDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setEducationDeduction(formatNumber(value));
                  }}
                  placeholder="예: 150,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기부금공제 (원)
                </label>
                <input
                  type="text"
                  value={donationDeduction}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setDonationDeduction(formatNumber(value));
                  }}
                  placeholder="예: 100,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateRefund}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
              >
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
              >
                초기화
              </button>
            </div>

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 공제액</p>
                    <p className="text-xl font-bold text-[#003366]">{result.totalDeduction.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과세표준</p>
                    <p className="text-xl font-bold text-[#003366]">{result.taxableIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">산출세액</p>
                    <p className="text-xl font-bold text-[#003366]">{result.calculatedTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">환급액</p>
                    <p className="text-xl font-bold text-[#003366]">{result.refundAmount.toLocaleString()}원</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/comprehensive-income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">종합소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </Link>
              
              <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaFileInvoiceDollar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </Link>
              
              <Link href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부가가치세 계산기</h4>
                <p className="text-xs text-gray-600">부가세 계산</p>
              </Link>
              
              <Link href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">부동산 세금</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
