'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

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

  const calculateTax = () => {
    if (!salary && !businessIncome && !interestIncome && !dividendIncome && !otherIncome) return;

    const salaryAmount = parseFloat(salary) || 0;
    const businessAmount = parseFloat(businessIncome) || 0;
    const interestAmount = parseFloat(interestIncome) || 0;
    const dividendAmount = parseFloat(dividendIncome) || 0;
    const otherAmount = parseFloat(otherIncome) || 0;
    const deductionAmount = parseFloat(deductions) || 0;

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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">종합소득세 간이 계산기</h1>
            <p className="text-lg text-gray-600">
              소득금액과 공제액에 따른 종합소득세를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  근로소득 (원)
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="예: 50000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사업소득 (원)
                </label>
                <input
                  type="number"
                  value={businessIncome}
                  onChange={(e) => setBusinessIncome(e.target.value)}
                  placeholder="예: 10000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이자소득 (원)
                </label>
                <input
                  type="number"
                  value={interestIncome}
                  onChange={(e) => setInterestIncome(e.target.value)}
                  placeholder="예: 1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배당소득 (원)
                </label>
                <input
                  type="number"
                  value={dividendIncome}
                  onChange={(e) => setDividendIncome(e.target.value)}
                  placeholder="예: 500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타소득 (원)
                </label>
                <input
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(e.target.value)}
                  placeholder="예: 2000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  공제액 (원)
                </label>
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  placeholder="예: 5000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateTax}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                계산하기
              </Button>
              <Button
                onClick={resetCalculator}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                초기화
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 소득금액</p>
                    <p className="text-xl font-bold text-blue-600">{result.totalIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과세표준</p>
                    <p className="text-xl font-bold text-blue-600">{result.taxableIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">종합소득세</p>
                    <p className="text-xl font-bold text-red-600">{result.taxAmount.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">실효세율</p>
                    <p className="text-xl font-bold text-blue-600">{result.effectiveRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">종합소득세란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                종합소득세는 개인이 1년간 얻은 모든 소득을 합산하여 과세하는 세금입니다. 
                근로소득, 사업소득, 이자소득, 배당소득 등 모든 소득이 포함됩니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">세율 구조 (2024년 기준)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>1,200만원 이하: 6%</li>
                <li>1,200만원 초과 ~ 4,600만원: 15%</li>
                <li>4,600만원 초과 ~ 8,800만원: 24%</li>
                <li>8,800만원 초과 ~ 1억5천만원: 35%</li>
                <li>1억5천만원 초과 ~ 3억원: 38%</li>
                <li>3억원 초과 ~ 5억원: 40%</li>
                <li>5억원 초과: 42%</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 소득금액 입력</h3>
                <p className="text-gray-700">
                  각 소득 유형별로 금액을 입력하세요. 해당하는 소득이 없으면 0으로 두세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 공제액 입력</h3>
                <p className="text-gray-700">
                  받을 수 있는 공제액을 입력하세요. (기본공제, 추가공제, 특별공제 등)
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 세금 계산</h3>
                <p className="text-gray-700">
                  계산하기 버튼을 클릭하면 과세표준과 세금이 계산됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/work-income-tax-refund-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">근로소득세 연말정산 환급액 계산기</h3>
                <p className="text-sm text-gray-600">연말정산 환급액 계산</p>
              </a>
              <a
                href="/income-tax-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">소득세 계산기</h3>
                <p className="text-sm text-gray-600">소득세 계산</p>
              </a>
              <a
                href="/salary-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">급여 계산기</h3>
                <p className="text-sm text-gray-600">실수령액 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 