'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

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

  const calculateRefund = () => {
    if (!annualSalary || !withheldTax) return;

    const salary = parseFloat(annualSalary);
    const withheld = parseFloat(withheldTax);
    const basic = parseFloat(basicDeduction) || 1500000;
    const additional = parseFloat(additionalDeduction) || 0;
    const special = parseFloat(specialDeduction) || 0;
    const insurance = parseFloat(insuranceDeduction) || 0;
    const medical = parseFloat(medicalDeduction) || 0;
    const education = parseFloat(educationDeduction) || 0;
    const donation = parseFloat(donationDeduction) || 0;

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
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">근로소득세 연말정산 환급액 계산기</h1>
            <p className="text-lg text-gray-600">
              연말정산 시 환급받을 수 있는 세금을 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연간 급여 (원)
                </label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  placeholder="예: 50000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  원천징수 세금 (원)
                </label>
                <input
                  type="number"
                  value={withheldTax}
                  onChange={(e) => setWithheldTax(e.target.value)}
                  placeholder="예: 3000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본공제 (원)
                </label>
                <input
                  type="number"
                  value={basicDeduction}
                  onChange={(e) => setBasicDeduction(e.target.value)}
                  placeholder="예: 1500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가공제 (원)
                </label>
                <input
                  type="number"
                  value={additionalDeduction}
                  onChange={(e) => setAdditionalDeduction(e.target.value)}
                  placeholder="예: 500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  특별공제 (원)
                </label>
                <input
                  type="number"
                  value={specialDeduction}
                  onChange={(e) => setSpecialDeduction(e.target.value)}
                  placeholder="예: 1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보험료공제 (원)
                </label>
                <input
                  type="number"
                  value={insuranceDeduction}
                  onChange={(e) => setInsuranceDeduction(e.target.value)}
                  placeholder="예: 300000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  의료비공제 (원)
                </label>
                <input
                  type="number"
                  value={medicalDeduction}
                  onChange={(e) => setMedicalDeduction(e.target.value)}
                  placeholder="예: 200000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  교육비공제 (원)
                </label>
                <input
                  type="number"
                  value={educationDeduction}
                  onChange={(e) => setEducationDeduction(e.target.value)}
                  placeholder="예: 150000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기부금공제 (원)
                </label>
                <input
                  type="number"
                  value={donationDeduction}
                  onChange={(e) => setDonationDeduction(e.target.value)}
                  placeholder="예: 100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateRefund}
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
                    <p className="text-sm text-gray-600">총 공제액</p>
                    <p className="text-xl font-bold text-blue-600">{result.totalDeduction.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과세표준</p>
                    <p className="text-xl font-bold text-blue-600">{result.taxableIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">산출세액</p>
                    <p className="text-xl font-bold text-red-600">{result.calculatedTax.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">환급액</p>
                    <p className="text-xl font-bold text-green-600">{result.refundAmount.toLocaleString()}원</p>
                  </div>
                  {result.additionalTax > 0 && (
                    <div className="text-center md:col-span-2">
                      <p className="text-sm text-gray-600">추가납부세액</p>
                      <p className="text-xl font-bold text-red-600">{result.additionalTax.toLocaleString()}원</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">연말정산이란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                연말정산은 1년간 근로소득세를 원천징수로 납부한 후, 연말에 실제 소득과 공제사항을 
                정리하여 세금을 재계산하는 제도입니다. 과다납부한 세금은 환급받고, 부족한 세금은 추가납부합니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">주요 공제 항목</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>기본공제: 모든 근로자에게 적용되는 기본 공제</li>
                <li>추가공제: 장애인, 한부모, 다자녀 등에 대한 추가 공제</li>
                <li>특별공제: 연금보험료, 의료보험료 등에 대한 공제</li>
                <li>보험료공제: 생명보험, 손해보험 등 보험료 공제</li>
                <li>의료비공제: 본인 및 부양가족의 의료비 공제</li>
                <li>교육비공제: 자녀 교육비에 대한 공제</li>
                <li>기부금공제: 기부금에 대한 공제</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 기본 정보 입력</h3>
                <p className="text-gray-700">
                  연간 급여와 원천징수된 세금을 입력하세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 공제 항목 입력</h3>
                <p className="text-gray-700">
                  받을 수 있는 공제 항목들을 입력하세요. 기본공제는 자동으로 150만원이 설정됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 환급액 확인</h3>
                <p className="text-gray-700">
                  계산하기 버튼을 클릭하면 환급받을 수 있는 세금이 계산됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/comprehensive-income-tax-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">종합소득세 간이 계산기</h3>
                <p className="text-sm text-gray-600">종합소득세 계산</p>
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