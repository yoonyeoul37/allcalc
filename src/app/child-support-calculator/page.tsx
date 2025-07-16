'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function ChildSupportCalculator() {
  const [childAge, setChildAge] = useState('');
  const [custodianIncome, setCustodianIncome] = useState('');
  const [nonCustodianIncome, setNonCustodianIncome] = useState('');
  const [custodianExpenses, setCustodianExpenses] = useState('');
  const [nonCustodianExpenses, setNonCustodianExpenses] = useState('');
  const [result, setResult] = useState<{
    totalIncome: number;
    totalExpenses: number;
    childExpenses: number;
    custodianShare: number;
    nonCustodianShare: number;
    monthlySupport: number;
  } | null>(null);

  const calculateChildSupport = () => {
    if (!childAge || !custodianIncome || !nonCustodianIncome) return;

    const age = parseInt(childAge);
    const custodian = parseFloat(custodianIncome);
    const nonCustodian = parseFloat(nonCustodianIncome);
    const custodianExp = parseFloat(custodianExpenses) || 0;
    const nonCustodianExp = parseFloat(nonCustodianExpenses) || 0;

    const totalIncome = custodian + nonCustodian;
    const totalExpenses = custodianExp + nonCustodianExp;

    // 자녀 연령별 월 양육비 기준 (2024년 기준)
    let monthlyChildExpense = 0;
    if (age <= 2) {
      monthlyChildExpense = 800000; // 0-2세: 80만원
    } else if (age <= 5) {
      monthlyChildExpense = 1000000; // 3-5세: 100만원
    } else if (age <= 11) {
      monthlyChildExpense = 1200000; // 6-11세: 120만원
    } else if (age <= 17) {
      monthlyChildExpense = 1500000; // 12-17세: 150만원
    } else {
      monthlyChildExpense = 1800000; // 18세 이상: 180만원
    }

    // 소득 비율에 따른 분담
    const custodianRatio = custodian / totalIncome;
    const nonCustodianRatio = nonCustodian / totalIncome;

    const custodianShare = Math.round(monthlyChildExpense * custodianRatio);
    const nonCustodianShare = Math.round(monthlyChildExpense * nonCustodianRatio);

    // 양육비는 비양육권자가 양육권자에게 지급
    const monthlySupport = nonCustodianShare;

    setResult({
      totalIncome: Math.round(totalIncome),
      totalExpenses: Math.round(totalExpenses),
      childExpenses: Math.round(monthlyChildExpense),
      custodianShare: Math.round(custodianShare),
      nonCustodianShare: Math.round(nonCustodianShare),
      monthlySupport: Math.round(monthlySupport)
    });
  };

  const resetCalculator = () => {
    setChildAge('');
    setCustodianIncome('');
    setNonCustodianIncome('');
    setCustodianExpenses('');
    setNonCustodianExpenses('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">양육비 계산기</h1>
            <p className="text-lg text-gray-600">
              법원 양육비 산정표 기준에 따른 양육비를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자녀 연령
                </label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  placeholder="예: 8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양육권자 월 소득 (원)
                </label>
                <input
                  type="number"
                  value={custodianIncome}
                  onChange={(e) => setCustodianIncome(e.target.value)}
                  placeholder="예: 3000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비양육권자 월 소득 (원)
                </label>
                <input
                  type="number"
                  value={nonCustodianIncome}
                  onChange={(e) => setNonCustodianIncome(e.target.value)}
                  placeholder="예: 4000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양육권자 월 지출 (원)
                </label>
                <input
                  type="number"
                  value={custodianExpenses}
                  onChange={(e) => setCustodianExpenses(e.target.value)}
                  placeholder="예: 2000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비양육권자 월 지출 (원)
                </label>
                <input
                  type="number"
                  value={nonCustodianExpenses}
                  onChange={(e) => setNonCustodianExpenses(e.target.value)}
                  placeholder="예: 2500000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateChildSupport}
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
                    <p className="text-sm text-gray-600">총 소득</p>
                    <p className="text-xl font-bold text-blue-600">{result.totalIncome.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">자녀 월 양육비</p>
                    <p className="text-xl font-bold text-green-600">{result.childExpenses.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">양육권자 분담금</p>
                    <p className="text-xl font-bold text-blue-600">{result.custodianShare.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">비양육권자 분담금</p>
                    <p className="text-xl font-bold text-orange-600">{result.nonCustodianShare.toLocaleString()}원</p>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-sm text-gray-600">월 양육비 지급액</p>
                    <p className="text-2xl font-bold text-red-600">{result.monthlySupport.toLocaleString()}원</p>
                    <p className="text-sm text-gray-600 mt-1">(비양육권자 → 양육권자)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">양육비란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                양육비는 이혼 후 자녀를 양육하지 않는 부모가 양육하는 부모에게 지급하는 비용입니다. 
                자녀의 양육에 필요한 비용을 부모가 소득 비율에 따라 분담하는 원칙을 따릅니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">자녀 연령별 월 양육비 기준</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>0-2세: 80만원</li>
                <li>3-5세: 100만원</li>
                <li>6-11세: 120만원</li>
                <li>12-17세: 150만원</li>
                <li>18세 이상: 180만원</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 자녀 정보 입력</h3>
                <p className="text-gray-700">
                  자녀의 연령을 입력하세요. 연령에 따라 양육비 기준이 달라집니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 부모 소득 입력</h3>
                <p className="text-gray-700">
                  양육권자와 비양육권자의 월 소득을 입력하세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 지출 정보 입력</h3>
                <p className="text-gray-700">
                  각 부모의 월 지출을 입력하세요. (선택사항)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/divorce-property-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">이혼 재산분할 계산기</h3>
                <p className="text-sm text-gray-600">혼인 중 형성 재산 분할</p>
              </a>
              <a
                href="/alimony-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">위자료 계산기</h3>
                <p className="text-sm text-gray-600">위자료 계산</p>
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