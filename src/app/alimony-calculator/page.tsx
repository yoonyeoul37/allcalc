'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function AlimonyCalculator() {
  const [marriageDuration, setMarriageDuration] = useState('');
  const [faultType, setFaultType] = useState('mutual');
  const [victimIncome, setVictimIncome] = useState('');
  const [faultPartyIncome, setFaultPartyIncome] = useState('');
  const [childrenCount, setChildrenCount] = useState('0');
  const [result, setResult] = useState<{
    baseAmount: number;
    faultMultiplier: number;
    incomeAdjustment: number;
    childrenAdjustment: number;
    finalAmount: number;
  } | null>(null);

  const calculateAlimony = () => {
    if (!marriageDuration || !victimIncome || !faultPartyIncome) return;

    const duration = parseFloat(marriageDuration);
    const victim = parseFloat(victimIncome);
    const fault = parseFloat(faultPartyIncome);
    const children = parseInt(childrenCount);

    // 기본 위자료 계산 (결혼 기간 기준)
    let baseAmount = 0;
    if (duration <= 1) {
      baseAmount = 5000000; // 1년 이하: 500만원
    } else if (duration <= 3) {
      baseAmount = 10000000; // 1-3년: 1000만원
    } else if (duration <= 5) {
      baseAmount = 15000000; // 3-5년: 1500만원
    } else if (duration <= 10) {
      baseAmount = 20000000; // 5-10년: 2000만원
    } else if (duration <= 15) {
      baseAmount = 25000000; // 10-15년: 2500만원
    } else {
      baseAmount = 30000000; // 15년 이상: 3000만원
    }

    // 과실 유형에 따른 배수
    let faultMultiplier = 1;
    switch (faultType) {
      case 'none':
        faultMultiplier = 0.5; // 과실 없음
        break;
      case 'minor':
        faultMultiplier = 1.0; // 경미한 과실
        break;
      case 'moderate':
        faultMultiplier = 1.5; // 중간 과실
        break;
      case 'severe':
        faultMultiplier = 2.0; // 중대한 과실
        break;
      case 'mutual':
        faultMultiplier = 1.0; // 상호 과실
        break;
      default:
        faultMultiplier = 1.0;
    }

    // 소득 차이에 따른 조정
    const incomeRatio = victim / fault;
    let incomeAdjustment = 1;
    if (incomeRatio < 0.5) {
      incomeAdjustment = 1.2; // 피해자 소득이 매우 낮음
    } else if (incomeRatio < 0.8) {
      incomeAdjustment = 1.1; // 피해자 소득이 낮음
    } else if (incomeRatio > 1.5) {
      incomeAdjustment = 0.8; // 피해자 소득이 높음
    } else if (incomeRatio > 2.0) {
      incomeAdjustment = 0.6; // 피해자 소득이 매우 높음
    }

    // 자녀 수에 따른 조정
    let childrenAdjustment = 1;
    if (children === 1) {
      childrenAdjustment = 1.1;
    } else if (children === 2) {
      childrenAdjustment = 1.2;
    } else if (children >= 3) {
      childrenAdjustment = 1.3;
    }

    const finalAmount = Math.round(baseAmount * faultMultiplier * incomeAdjustment * childrenAdjustment);

    setResult({
      baseAmount: Math.round(baseAmount),
      faultMultiplier,
      incomeAdjustment,
      childrenAdjustment,
      finalAmount
    });
  };

  const resetCalculator = () => {
    setMarriageDuration('');
    setFaultType('mutual');
    setVictimIncome('');
    setFaultPartyIncome('');
    setChildrenCount('0');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">위자료 계산기</h1>
            <p className="text-lg text-gray-600">
              이혼 시 위자료를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  혼인 기간 (년)
                </label>
                <input
                  type="number"
                  value={marriageDuration}
                  onChange={(e) => setMarriageDuration(e.target.value)}
                  placeholder="예: 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  과실 유형
                </label>
                <select
                  value={faultType}
                  onChange={(e) => setFaultType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">과실 없음</option>
                  <option value="minor">경미한 과실</option>
                  <option value="moderate">중간 과실</option>
                  <option value="severe">중대한 과실</option>
                  <option value="mutual">상호 과실</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피해자 연간 소득 (원)
                </label>
                <input
                  type="number"
                  value={victimIncome}
                  onChange={(e) => setVictimIncome(e.target.value)}
                  placeholder="예: 30000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  과실자 연간 소득 (원)
                </label>
                <input
                  type="number"
                  value={faultPartyIncome}
                  onChange={(e) => setFaultPartyIncome(e.target.value)}
                  placeholder="예: 40000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자녀 수
                </label>
                <input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(e.target.value)}
                  placeholder="예: 2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateAlimony}
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
                    <p className="text-sm text-gray-600">기본 위자료</p>
                    <p className="text-xl font-bold text-blue-600">{result.baseAmount.toLocaleString()}원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">과실 배수</p>
                    <p className="text-xl font-bold text-orange-600">{result.faultMultiplier}x</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">소득 조정</p>
                    <p className="text-xl font-bold text-green-600">{result.incomeAdjustment}x</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">자녀 조정</p>
                    <p className="text-xl font-bold text-purple-600">{result.childrenAdjustment}x</p>
                  </div>
                  <div className="text-center md:col-span-2">
                    <p className="text-sm text-gray-600">최종 위자료</p>
                    <p className="text-2xl font-bold text-red-600">{result.finalAmount.toLocaleString()}원</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">위자료란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                위자료는 이혼 시 정신적, 물질적 손해를 입은 배우자에게 상대방이 지급하는 금전적 보상입니다. 
                혼인 기간, 과실 유형, 소득 차이, 자녀 유무 등이 고려됩니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">혼인 기간별 기본 위자료</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>1년 이하: 500만원</li>
                <li>1-3년: 1000만원</li>
                <li>3-5년: 1500만원</li>
                <li>5-10년: 2000만원</li>
                <li>10-15년: 2500만원</li>
                <li>15년 이상: 3000만원</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 혼인 기간 입력</h3>
                <p className="text-gray-700">
                  혼인한 기간을 년 단위로 입력하세요. 소수점도 가능합니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 과실 유형 선택</h3>
                <p className="text-gray-700">
                  이혼의 원인이 되는 과실 유형을 선택하세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 소득 정보 입력</h3>
                <p className="text-gray-700">
                  피해자와 과실자의 연간 소득을 입력하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/child-support-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">양육비 계산기</h3>
                <p className="text-sm text-gray-600">양육비 계산</p>
              </a>
              <a
                href="/divorce-property-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">이혼 재산분할 계산기</h3>
                <p className="text-sm text-gray-600">혼인 중 형성 재산 분할</p>
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