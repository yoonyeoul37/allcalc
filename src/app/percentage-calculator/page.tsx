"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaPercent, FaArrowUp, FaArrowDown, FaDollarSign } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState<string>("basic");
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [calculationSteps, setCalculationSteps] = useState<string>("");

  // 기본 백분율 계산
  const calculateBasicPercentage = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);
    
    if (isNaN(num1) || isNaN(num2) || num2 === 0) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const percentage = (num1 / num2) * 100;
    setResult(`${percentage.toFixed(2)}%`);
    setCalculationSteps(`(${num1} ÷ ${num2}) × 100 = ${percentage.toFixed(2)}%`);
  };

  // 백분율로 값 계산
  const calculateValueFromPercentage = () => {
    const num1 = parseFloat(value1);
    const percentage = parseFloat(value2);
    
    if (isNaN(num1) || isNaN(percentage)) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const result = (num1 * percentage) / 100;
    setResult(result.toFixed(2));
    setCalculationSteps(`${num1} × ${percentage}% ÷ 100 = ${result.toFixed(2)}`);
  };

  // 증가율 계산
  const calculateIncrease = () => {
    const original = parseFloat(value1);
    const newValue = parseFloat(value2);
    
    if (isNaN(original) || isNaN(newValue)) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const increase = newValue - original;
    const percentage = (increase / original) * 100;
    
    setResult(`${percentage.toFixed(2)}%`);
    setCalculationSteps(`(${newValue} - ${original}) ÷ ${original} × 100 = ${percentage.toFixed(2)}%`);
  };

  // 감소율 계산
  const calculateDecrease = () => {
    const original = parseFloat(value1);
    const newValue = parseFloat(value2);
    
    if (isNaN(original) || isNaN(newValue)) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const decrease = original - newValue;
    const percentage = (decrease / original) * 100;
    
    setResult(`${percentage.toFixed(2)}%`);
    setCalculationSteps(`(${original} - ${newValue}) ÷ ${original} × 100 = ${percentage.toFixed(2)}%`);
  };

  // 할인율 계산
  const calculateDiscount = () => {
    const originalPrice = parseFloat(value1);
    const salePrice = parseFloat(value2);
    
    if (isNaN(originalPrice) || isNaN(salePrice)) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const discount = originalPrice - salePrice;
    const discountPercentage = (discount / originalPrice) * 100;
    
    setResult(`${discountPercentage.toFixed(2)}%`);
    setCalculationSteps(`(${originalPrice} - ${salePrice}) ÷ ${originalPrice} × 100 = ${discountPercentage.toFixed(2)}%`);
  };

  // 세금 계산
  const calculateTax = () => {
    const amount = parseFloat(value1);
    const taxRate = parseFloat(value2);
    
    if (isNaN(amount) || isNaN(taxRate)) {
      setResult("오류: 유효한 숫자를 입력하세요");
      return;
    }

    const taxAmount = (amount * taxRate) / 100;
    const totalWithTax = amount + taxAmount;
    
    setResult(`세금: ${taxAmount.toFixed(2)}, 총액: ${totalWithTax.toFixed(2)}`);
    setCalculationSteps(`세금: ${amount} × ${taxRate}% ÷ 100 = ${taxAmount.toFixed(2)}`);
  };

  // 계산 실행
  const performCalculation = () => {
    switch (calculationType) {
      case "basic":
        calculateBasicPercentage();
        break;
      case "value":
        calculateValueFromPercentage();
        break;
      case "increase":
        calculateIncrease();
        break;
      case "decrease":
        calculateDecrease();
        break;
      case "discount":
        calculateDiscount();
        break;
      case "tax":
        calculateTax();
        break;
      default:
        break;
    }
  };

  // 입력 초기화
  const clearInputs = () => {
    setValue1("");
    setValue2("");
    setResult("");
    setCalculationSteps("");
  };

  // 계산 타입에 따른 입력 라벨
  const getInputLabels = () => {
    switch (calculationType) {
      case "basic":
        return { label1: "값", label2: "전체" };
      case "value":
        return { label1: "값", label2: "백분율 (%)" };
      case "increase":
        return { label1: "원래 값", label2: "새 값" };
      case "decrease":
        return { label1: "원래 값", label2: "새 값" };
      case "discount":
        return { label1: "원래 가격", label2: "할인 가격" };
      case "tax":
        return { label1: "금액", label2: "세율 (%)" };
      default:
        return { label1: "값 1", label2: "값 2" };
    }
  };

  const labels = getInputLabels();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">백분율 계산기</h1>
            <p className="text-lg text-gray-600">백분율 계산, 증가율, 감소율, 할인율 등을 지원하는 계산기</p>
          </div>

          {/* 백분율 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            
            {/* 계산 타입 선택 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">계산 타입 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setCalculationType("basic")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "basic"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  기본 백분율
                </button>
                <button
                  onClick={() => setCalculationType("value")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "value"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  백분율로 값 계산
                </button>
                <button
                  onClick={() => setCalculationType("increase")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "increase"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  증가율 계산
                </button>
                <button
                  onClick={() => setCalculationType("decrease")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "decrease"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  감소율 계산
                </button>
                <button
                  onClick={() => setCalculationType("discount")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "discount"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  할인율 계산
                </button>
                <button
                  onClick={() => setCalculationType("tax")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "tax"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  세금 계산
                </button>
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.label1}
                  </label>
                  <input
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="첫 번째 값 입력"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.label2}
                  </label>
                  <input
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="두 번째 값 입력"
                  />
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={performCalculation}
                className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                계산하기
              </button>
              <button
                onClick={clearInputs}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{result}</div>
                  </div>
                </div>
                
                {calculationSteps && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">계산 과정:</h4>
                    <div className="text-sm text-gray-600">{calculationSteps}</div>
                  </div>
                )}
              </div>
            )}

            {/* 빠른 계산 예시 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 계산 예시</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setCalculationType("basic");
                    setValue1("25");
                    setValue2("100");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  25/100 = 25%
                </button>
                <button
                  onClick={() => {
                    setCalculationType("value");
                    setValue1("200");
                    setValue2("15");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  200의 15% = 30
                </button>
                <button
                  onClick={() => {
                    setCalculationType("increase");
                    setValue1("100");
                    setValue2("120");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  100→120 = 20% 증가
                </button>
                <button
                  onClick={() => {
                    setCalculationType("discount");
                    setValue1("100");
                    setValue2("80");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  100→80 = 20% 할인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            {/* 메인 콘텐츠 */}
            <div className="w-full max-w-4xl">
          
          {/* 백분율 계산기란? */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">백분율 계산기란?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed mb-4 text-center mx-auto max-w-3xl">
                백분율 계산기는 퍼센트 계산을 쉽게 할 수 있는 도구입니다. 할인율, 이자율, 세율 등 
                다양한 상황에서 백분율을 계산하고 변환할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-center mx-auto max-w-3xl">
                전체 값에서 일정 비율을 계산하거나, 증가율/감소율을 계산할 때 유용합니다. 
                금융, 쇼핑, 통계 등 다양한 분야에서 활용할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 백분율 계산 방법 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">백분율 계산 방법</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">기본 백분율</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 백분율 = (값 ÷ 전체) × 100</li>
                  <li>• 예: 25/100 = 25%</li>
                  <li>• 예: 3/5 = 60%</li>
                  <li>• 소수점 이하 반올림</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">백분율로 값 계산</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 값 = (전체 × 백분율) ÷ 100</li>
                  <li>• 예: 200의 15% = 30</li>
                  <li>• 예: 1000의 8% = 80</li>
                  <li>• 할인액, 세금 등 계산</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">증가율/감소율</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 증가율 = (새값 - 원래값) ÷ 원래값 × 100</li>
                  <li>• 감소율 = (원래값 - 새값) ÷ 원래값 × 100</li>
                  <li>• 예: 100→120 = 20% 증가</li>
                  <li>• 예: 100→80 = 20% 감소</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">할인율/세금</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 할인율 = (원가 - 할인가) ÷ 원가 × 100</li>
                  <li>• 세금액 = 금액 × 세율 ÷ 100</li>
                  <li>• 총액 = 원가 + 세금액</li>
                  <li>• 실수령액 = 원가 - 할인액</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">기본 백분율 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 25/100 = 25%</p>
                <p><strong>예시 2:</strong> 3/5 = 60%</p>
                <p><strong>예시 3:</strong> 7/8 = 87.5%</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">백분율로 값 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 200의 15% = 30</p>
                <p><strong>예시 2:</strong> 1000의 8% = 80</p>
                <p><strong>예시 3:</strong> 500의 20% = 100</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">증가율/감소율 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 100→120 = 20% 증가</p>
                <p><strong>예시 2:</strong> 200→150 = 25% 감소</p>
                <p><strong>예시 3:</strong> 50→75 = 50% 증가</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">할인율 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 100원→80원 = 20% 할인</p>
                <p><strong>예시 2:</strong> 200원→150원 = 25% 할인</p>
                <p><strong>예시 3:</strong> 1000원→700원 = 30% 할인</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔢 숫자 입력</h3>
                <p className="text-gray-600">유효한 숫자만 입력하세요. 0으로 나누기는 불가능합니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📊 소수점 처리</h3>
                <p className="text-gray-600">결과는 소수점 둘째 자리까지 표시됩니다. 필요시 반올림됩니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 계산 과정</h3>
                <p className="text-gray-600">계산 과정을 확인하여 백분율 계산의 원리를 이해할 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/fraction-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">분수 계산기</h3>
                <p className="text-sm text-gray-600">분수 연산 계산기</p>
              </Link>
              <Link href="/engineering-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaPercent className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">공학용 계산기</h3>
                <p className="text-sm text-gray-600">고급 수학 함수</p>
              </Link>
              <Link href="/triangle-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDollarSign className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">삼각형 계산기</h3>
                <p className="text-sm text-gray-600">기하학 계산</p>
              </Link>
              <Link href="/standard-deviation-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaArrowUp className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">표준편차 계산기</h3>
                <p className="text-sm text-gray-600">통계 분석</p>
              </Link>
            </div>
          </section>
            </div>
            
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
