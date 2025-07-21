"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt, FaHome, FaCalendarAlt, FaDollarSign, FaUserTie, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface TaxResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  calculatedTax: number;
  effectiveTaxRate: number;
  monthlyTax: number;
  taxBreakdown: {
    basicDeduction: number;
    additionalDeduction: number;
    specialDeduction: number;
    otherDeductions: number;
  };
  taxRates: Array<{
    bracket: string;
    rate: number;
    amount: number;
    tax: number;
  }>;
}

export default function IncomeTaxCalculator() {
  const [incomeType, setIncomeType] = useState('salary');
  const [annualIncome, setAnnualIncome] = useState('');
  const [annualIncomeDisplay, setAnnualIncomeDisplay] = useState('');
  const [basicDeduction, setBasicDeduction] = useState('1500000');
  const [basicDeductionDisplay, setBasicDeductionDisplay] = useState('1,500,000');
  const [additionalDeduction, setAdditionalDeduction] = useState('1000000');
  const [additionalDeductionDisplay, setAdditionalDeductionDisplay] = useState('1,000,000');
  const [specialDeduction, setSpecialDeduction] = useState('0');
  const [specialDeductionDisplay, setSpecialDeductionDisplay] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [otherDeductionsDisplay, setOtherDeductionsDisplay] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleAnnualIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAnnualIncome(value);
      setAnnualIncomeDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleBasicDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBasicDeduction(value);
      setBasicDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleAdditionalDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAdditionalDeduction(value);
      setAdditionalDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleSpecialDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSpecialDeduction(value);
      setSpecialDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleOtherDeductionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setOtherDeductions(value);
      setOtherDeductionsDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateTax = () => {
    const income = parseFloat(annualIncome.replace(/,/g, ''));
    const basic = parseFloat(basicDeduction.replace(/,/g, ''));
    const additional = parseFloat(additionalDeduction.replace(/,/g, ''));
    const special = parseFloat(specialDeduction.replace(/,/g, ''));
    const other = parseFloat(otherDeductions.replace(/,/g, ''));

    if (isNaN(income) || income <= 0) {
      alert('연간 총소득을 입력해주세요.');
      return;
    }

    const totalDeductions = basic + additional + special + other;
    const taxableIncome = Math.max(0, income - totalDeductions);

    // 2024년 한국 소득세 세율표 (과세표준)
    const taxRates = [
      { min: 0, max: 12000000, rate: 0.06 },
      { min: 12000000, max: 46000000, rate: 0.15 },
      { min: 46000000, max: 88000000, rate: 0.24 },
      { min: 88000000, max: 150000000, rate: 0.35 },
      { min: 150000000, max: 300000000, rate: 0.38 },
      { min: 300000000, max: 500000000, rate: 0.40 },
      { min: 500000000, max: Infinity, rate: 0.42 }
    ];

    let calculatedTax = 0;
    const taxBreakdown = [];

    for (let i = 0; i < taxRates.length; i++) {
      const rate = taxRates[i];
      const prevMax = i > 0 ? taxRates[i - 1].max : 0;
      
      if (taxableIncome > prevMax) {
        const bracketAmount = Math.min(taxableIncome, rate.max) - prevMax;
        const bracketTax = bracketAmount * rate.rate;
        calculatedTax += bracketTax;
        
        taxBreakdown.push({
          bracket: `${(prevMax / 10000).toFixed(0)}만원 초과 ${(rate.max / 10000).toFixed(0)}만원 이하`,
          rate: rate.rate * 100,
          amount: bracketAmount,
          tax: bracketTax
        });
      }
    }

    const effectiveTaxRate = (calculatedTax / income) * 100;
    const monthlyTax = calculatedTax / 12;

    setResult({
      totalIncome: income,
      totalDeductions,
      taxableIncome,
      calculatedTax,
      effectiveTaxRate,
      monthlyTax,
      taxBreakdown: {
        basicDeduction: basic,
        additionalDeduction: additional,
        specialDeduction: special,
        otherDeductions: other
      },
      taxRates: taxBreakdown
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaFileInvoiceDollar className="mr-3 text-[#003366]" />
              소득세 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaReceipt className="inline mr-2 text-black" />
                  소득 유형
                </label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="salary">근로소득 (급여)</option>
                  <option value="business">사업소득 (개인사업자)</option>
                  <option value="interest">이자소득</option>
                  <option value="dividend">배당소득</option>
                  <option value="capital">양도소득</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  연간 총소득 (원)
                </label>
                <input
                  type="text"
                  value={annualIncomeDisplay}
                  onChange={handleAnnualIncomeChange}
                  placeholder="50,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기본공제 (원)</label>
                <input
                  type="text"
                  value={basicDeductionDisplay}
                  onChange={handleBasicDeductionChange}
                  placeholder="1,500,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추가공제 (원)</label>
                <input
                  type="text"
                  value={additionalDeductionDisplay}
                  onChange={handleAdditionalDeductionChange}
                  placeholder="1,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">특별공제 (원)</label>
                <input
                  type="text"
                  value={specialDeductionDisplay}
                  onChange={handleSpecialDeductionChange}
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기타공제 (원)</label>
                <input
                  type="text"
                  value={otherDeductionsDisplay}
                  onChange={handleOtherDeductionsChange}
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={calculateTax}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과세표준</p>
                    <p className="text-xl font-bold text-[#003366]">{result.taxableIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">산출세액</p>
                    <p className="text-xl font-bold text-[#003366]">{result.calculatedTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">실효세율</p>
                    <p className="text-xl font-bold text-[#003366]">{result.effectiveTaxRate.toFixed(2)}%</p>
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
              
              <Link href="/work-income-tax-refund-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근로소득세 환급액</h4>
                <p className="text-xs text-gray-600">연말정산 계산</p>
              </Link>
              
              <Link href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaFileInvoiceDollar className="text-xl text-black" />
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
