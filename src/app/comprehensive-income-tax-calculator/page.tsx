"use client";

import { useState } from 'react';
import { FaCalculator, FaShieldAlt, FaMoneyBillWave, FaFileInvoiceDollar, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function ComprehensiveIncomeTaxCalculator() {
  const [salary, setSalary] = useState('');
  const [businessIncome, setBusinessIncome] = useState('');
  const [interestIncome, setInterestIncome] = useState('');
  const [dividendIncome, setDividendIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState<{
    totalIncome: number;
    taxableIncome: number;
    taxAmount: number;
    effectiveRate: number;
  } | null>(null);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateTax = () => {
    if (!salary && !businessIncome && !interestIncome && !dividendIncome && !otherIncome) {
      alert('소득 정보를 입력해주세요.');
      return;
    }

    const salaryAmount = parseNumber(salary);
    const businessAmount = parseNumber(businessIncome);
    const interestAmount = parseNumber(interestIncome);
    const dividendAmount = parseNumber(dividendIncome);
    const otherAmount = parseNumber(otherIncome);
    const deductionAmount = parseNumber(deductions);

    const totalIncome = salaryAmount + businessAmount + interestAmount + dividendAmount + otherAmount;
    const taxableIncome = Math.max(0, totalIncome - deductionAmount);

    // 한국 종합소득세 세율 (2024년 기준)
    let taxAmount = 0;
    let effectiveRate = 0;

    if (taxableIncome <= 12000000) {
      taxAmount = taxableIncome * 0.06;
    } else if (taxableIncome <= 46000000) {
      taxAmount = 720000 + (taxableIncome - 12000000) * 0.15;
    } else if (taxableIncome <= 88000000) {
      taxAmount = 5820000 + (taxableIncome - 46000000) * 0.24;
    } else if (taxableIncome <= 150000000) {
      taxAmount = 15900000 + (taxableIncome - 88000000) * 0.35;
    } else if (taxableIncome <= 300000000) {
      taxAmount = 37600000 + (taxableIncome - 150000000) * 0.38;
    } else if (taxableIncome <= 500000000) {
      taxAmount = 94600000 + (taxableIncome - 300000000) * 0.40;
    } else {
      taxAmount = 174600000 + (taxableIncome - 500000000) * 0.42;
    }

    effectiveRate = (taxAmount / totalIncome) * 100;

    setResult({
      totalIncome: Math.round(totalIncome),
      taxableIncome: Math.round(taxableIncome),
      taxAmount: Math.round(taxAmount),
      effectiveRate: Math.round(effectiveRate * 100) / 100
    });
  };

  const resetCalculator = () => {
    setSalary('');
    setBusinessIncome('');
    setInterestIncome('');
    setDividendIncome('');
    setOtherIncome('');
    setDeductions('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaShieldAlt className="mr-3 text-[#003366]" />
              종합소득세 간이 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근로소득 (원)
                </label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setSalary(formatNumber(value));
                  }}
                  placeholder="예: 50,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업소득 (원)
                </label>
                <input
                  type="text"
                  value={businessIncome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setBusinessIncome(formatNumber(value));
                  }}
                  placeholder="예: 10,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이자소득 (원)
                </label>
                <input
                  type="text"
                  value={interestIncome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setInterestIncome(formatNumber(value));
                  }}
                  placeholder="예: 1,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배당소득 (원)
                </label>
                <input
                  type="text"
                  value={dividendIncome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setDividendIncome(formatNumber(value));
                  }}
                  placeholder="예: 500,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타소득 (원)
                </label>
                <input
                  type="text"
                  value={otherIncome}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setOtherIncome(formatNumber(value));
                  }}
                  placeholder="예: 2,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  공제액 (원)
                </label>
                <input
                  type="text"
                  value={deductions}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setDeductions(formatNumber(value));
                  }}
                  placeholder="예: 5,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateTax}
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
                    <p className="text-sm text-gray-600">총 소득금액</p>
                    <p className="text-xl font-bold text-[#003366]">{result.totalIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과세표준</p>
                    <p className="text-xl font-bold text-[#003366]">{result.taxableIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">종합소득세</p>
                    <p className="text-xl font-bold text-[#003366]">{result.taxAmount.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">실효세율</p>
                    <p className="text-xl font-bold text-[#003366]">{result.effectiveRate}%</p>
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
              <a href="/work-income-tax-refund-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근로소득세 환급액</h4>
                <p className="text-xs text-gray-600">연말정산 계산</p>
              </a>
              
              <a href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaFileInvoiceDollar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </a>
              
              <a href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부가가치세 계산기</h4>
                <p className="text-xs text-gray-600">부가세 계산</p>
              </a>
              
              <a href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">부동산 세금</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 