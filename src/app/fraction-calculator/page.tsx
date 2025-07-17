"use client";

import { useState } from "react";
import { FaCalculator, FaDivide, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface Fraction {
  numerator: number;
  denominator: number;
}

export default function FractionCalculator() {
  const [firstFraction, setFirstFraction] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [secondFraction, setSecondFraction] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [operation, setOperation] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [decimalResult, setDecimalResult] = useState<string>("");
  const [showDecimal, setShowDecimal] = useState<boolean>(false);

  // 최대공약수 계산
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // 최소공배수 계산
  const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  // 분수 기약분수로 만들기
  const simplifyFraction = (fraction: Fraction): Fraction => {
    const divisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator));
    return {
      numerator: fraction.numerator / divisor,
      denominator: fraction.denominator / divisor
    };
  };

  // 분수를 문자열로 변환
  const fractionToString = (fraction: Fraction): string => {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString();
    }
    if (fraction.numerator === 0) {
      return "0";
    }
    return `${fraction.numerator}/${fraction.denominator}`;
  };

  // 분수를 소수로 변환
  const fractionToDecimal = (fraction: Fraction): number => {
    return fraction.numerator / fraction.denominator;
  };

  // 분수 계산
  const calculateFractions = () => {
    if (!operation) return;

    let resultFraction: Fraction;

    switch (operation) {
      case "+":
        // 덧셈: (a/b) + (c/d) = (ad + bc) / (bd)
        resultFraction = {
          numerator: firstFraction.numerator * secondFraction.denominator + 
                    secondFraction.numerator * firstFraction.denominator,
          denominator: firstFraction.denominator * secondFraction.denominator
        };
        break;
      case "-":
        // 뺄셈: (a/b) - (c/d) = (ad - bc) / (bd)
        resultFraction = {
          numerator: firstFraction.numerator * secondFraction.denominator - 
                    secondFraction.numerator * firstFraction.denominator,
          denominator: firstFraction.denominator * secondFraction.denominator
        };
        break;
      case "×":
        // 곱셈: (a/b) × (c/d) = (ac) / (bd)
        resultFraction = {
          numerator: firstFraction.numerator * secondFraction.numerator,
          denominator: firstFraction.denominator * secondFraction.denominator
        };
        break;
      case "÷":
        // 나눗셈: (a/b) ÷ (c/d) = (a/b) × (d/c) = (ad) / (bc)
        if (secondFraction.numerator === 0) {
          setResult("오류: 0으로 나눌 수 없습니다");
          setDecimalResult("");
          return;
        }
        resultFraction = {
          numerator: firstFraction.numerator * secondFraction.denominator,
          denominator: firstFraction.denominator * secondFraction.numerator
        };
        break;
      default:
        return;
    }

    // 기약분수로 만들기
    const simplified = simplifyFraction(resultFraction);
    
    // 결과 설정
    setResult(fractionToString(simplified));
    setDecimalResult(fractionToDecimal(simplified).toFixed(6));
  };

  // 입력 처리
  const handleInput = (fractionIndex: number, field: 'numerator' | 'denominator', value: string) => {
    const numValue = parseInt(value) || 0;
    
    if (fractionIndex === 1) {
      setFirstFraction(prev => ({ ...prev, [field]: numValue }));
    } else {
      setSecondFraction(prev => ({ ...prev, [field]: numValue }));
    }
  };

  // 연산 설정
  const setOperationAndCalculate = (op: string) => {
    setOperation(op);
    // 연산이 설정되면 자동으로 계산
    setTimeout(() => {
      const currentOperation = op;
      setOperation(currentOperation);
      calculateFractions();
    }, 100);
  };

  // 분수 초기화
  const clearAll = () => {
    setFirstFraction({ numerator: 0, denominator: 1 });
    setSecondFraction({ numerator: 0, denominator: 1 });
    setOperation("");
    setResult("");
    setDecimalResult("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">분수 계산기</h1>
            <p className="text-lg text-gray-600">분수의 덧셈, 뺄셈, 곱셈, 나눗셈을 지원하는 계산기</p>
          </div>

          {/* 분수 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            
            {/* 첫 번째 분수 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">첫 번째 분수</h3>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={firstFraction.numerator}
                    onChange={(e) => handleInput(1, 'numerator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none"
                    placeholder="분자"
                  />
                  <div className="w-20 h-0.5 bg-gray-400 my-1"></div>
                  <input
                    type="number"
                    value={firstFraction.denominator}
                    onChange={(e) => handleInput(1, 'denominator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none"
                    placeholder="분모"
                  />
                </div>
                
                {/* 연산 버튼들 */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setOperationAndCalculate("+")}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-colors ${
                      operation === "+" 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setOperationAndCalculate("-")}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-colors ${
                      operation === "-" 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    -
                  </button>
                  <button
                    onClick={() => setOperationAndCalculate("×")}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-colors ${
                      operation === "×" 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    ×
                  </button>
                  <button
                    onClick={() => setOperationAndCalculate("÷")}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-colors ${
                      operation === "÷" 
                        ? "bg-blue-500 text-white" 
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    ÷
                  </button>
                </div>

                {/* 두 번째 분수 입력 */}
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={secondFraction.numerator}
                    onChange={(e) => handleInput(2, 'numerator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none"
                    placeholder="분자"
                  />
                  <div className="w-20 h-0.5 bg-gray-400 my-1"></div>
                  <input
                    type="number"
                    value={secondFraction.denominator}
                    onChange={(e) => handleInput(2, 'denominator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none"
                    placeholder="분모"
                  />
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <div className="flex justify-center mb-6">
              <button
                onClick={calculateFractions}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                계산하기
              </button>
              <button
                onClick={clearAll}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors ml-4"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                
                {/* 분수 형태 결과 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">분수 형태:</label>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{result}</div>
                    </div>
                  </div>
                </div>

                {/* 소수 형태 결과 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">소수 형태:</label>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{decimalResult}</div>
                    </div>
                  </div>
                </div>

                {/* 계산 과정 표시 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">계산 과정:</h4>
                  <div className="text-sm text-gray-600">
                    {fractionToString(firstFraction)} {operation} {fractionToString(secondFraction)} = {result}
                  </div>
                </div>
              </div>
            )}

            {/* 빠른 입력 예시 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 입력 예시</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setFirstFraction({ numerator: 1, denominator: 2 });
                    setSecondFraction({ numerator: 1, denominator: 3 });
                    setOperation("+");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  1/2 + 1/3
                </button>
                <button
                  onClick={() => {
                    setFirstFraction({ numerator: 3, denominator: 4 });
                    setSecondFraction({ numerator: 1, denominator: 2 });
                    setOperation("×");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  3/4 × 1/2
                </button>
                <button
                  onClick={() => {
                    setFirstFraction({ numerator: 5, denominator: 6 });
                    setSecondFraction({ numerator: 2, denominator: 3 });
                    setOperation("-");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  5/6 - 2/3
                </button>
                <button
                  onClick={() => {
                    setFirstFraction({ numerator: 2, denominator: 3 });
                    setSecondFraction({ numerator: 1, denominator: 4 });
                    setOperation("÷");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  2/3 ÷ 1/4
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
          
          {/* 분수 계산기란? */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">분수 계산기란?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed mb-4 text-center mx-auto max-w-3xl">
                분수 계산기는 분수의 덧셈, 뺄셈, 곱셈, 나눗셈을 쉽게 계산할 수 있는 도구입니다. 
                복잡한 분수 연산을 단계별로 풀어서 보여주며, 결과를 기약분수 형태로 제공합니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-center mx-auto max-w-3xl">
                분자와 분모를 입력하면 자동으로 계산이 수행되며, 소수와 분수 간의 변환도 지원합니다. 
                수학 학습이나 일상적인 계산에서 유용하게 사용할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 분수 연산 방법 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">분수 연산 방법</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">덧셈과 뺄셈</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 분모를 통분하여 같은 분모로 만듭니다</li>
                  <li>• 분자끼리 더하거나 뺍니다</li>
                  <li>• 결과를 기약분수로 만듭니다</li>
                  <li>• 예: 1/2 + 1/3 = 3/6 + 2/6 = 5/6</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">곱셈</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 분자는 분자끼리 곱합니다</li>
                  <li>• 분모는 분모끼리 곱합니다</li>
                  <li>• 결과를 기약분수로 만듭니다</li>
                  <li>• 예: 2/3 × 3/4 = 6/12 = 1/2</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">나눗셈</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 나누는 분수를 뒤집어 곱셈으로 바꿉니다</li>
                  <li>• 분자는 분자끼리 곱합니다</li>
                  <li>• 분모는 분모끼리 곱합니다</li>
                  <li>• 예: 2/3 ÷ 1/4 = 2/3 × 4/1 = 8/3</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">기약분수</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 분자와 분모의 최대공약수로 나눕니다</li>
                  <li>• 더 이상 나눌 수 없을 때까지 반복합니다</li>
                  <li>• 예: 8/12 = 2/3 (4로 나눔)</li>
                  <li>• 분모가 1이면 정수로 표시합니다</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">덧셈 예시</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 1/2 + 1/3 = 3/6 + 2/6 = 5/6 ≈ 0.8333</p>
                <p><strong>예시 2:</strong> 3/4 + 1/8 = 6/8 + 1/8 = 7/8 = 0.875</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">곱셈 예시</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 2/3 × 3/4 = 6/12 = 1/2 = 0.5</p>
                <p><strong>예시 2:</strong> 1/2 × 1/2 = 1/4 = 0.25</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">나눗셈 예시</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 2/3 ÷ 1/4 = 2/3 × 4/1 = 8/3 ≈ 2.6667</p>
                <p><strong>예시 2:</strong> 1/2 ÷ 1/3 = 1/2 × 3/1 = 3/2 = 1.5</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔢 분모 입력</h3>
                <p className="text-gray-600">분모는 0이 될 수 없습니다. 0을 입력하면 계산이 불가능합니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📊 기약분수</h3>
                <p className="text-gray-600">결과는 자동으로 기약분수 형태로 표시됩니다. 예: 4/8 → 1/2</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 학습 도구</h3>
                <p className="text-gray-600">계산 과정을 확인하여 분수 연산의 원리를 이해할 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/engineering-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">공학용 계산기</h3>
                <p className="text-sm text-gray-600">고급 수학 함수</p>
              </a>
              <a href="/percentage-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDivide className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">백분율 계산기</h3>
                <p className="text-sm text-gray-600">백분율 계산</p>
              </a>
              <a href="/triangle-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaPlus className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">삼각형 계산기</h3>
                <p className="text-sm text-gray-600">기하학 계산</p>
              </a>
              <a href="/standard-deviation-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaTimes className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">표준편차 계산기</h3>
                <p className="text-sm text-gray-600">통계 분석</p>
              </a>
            </div>
          </section>
            </div>
            

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-6 text-sm text-gray-700 leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            이 분수 계산기는 분수의 덧셈, 뺄셈, 곱셈, 나눗셈을 자동으로 계산해줍니다. 
            결과는 기약분수 형태와 소수 형태로 모두 표시되며, 계산 과정도 함께 보여줍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 