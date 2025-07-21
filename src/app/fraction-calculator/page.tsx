"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaDivide, FaPlus, FaMinus, FaTimes, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaCalculator className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">분수 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">분수의 덧셈, 뺄셈, 곱셈, 나눗셈을 지원하는 계산기</p>
          </div>

          {/* 분수 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">분수 계산</h3>
            
            {/* 첫 번째 분수 입력 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">첫 번째 분수</h4>
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={firstFraction.numerator}
                    onChange={(e) => handleInput(1, 'numerator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    placeholder="분자"
                  />
                  <div className="w-20 h-0.5 bg-gray-400 my-1"></div>
                  <input
                    type="number"
                    value={firstFraction.denominator}
                    onChange={(e) => handleInput(1, 'denominator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
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
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    placeholder="분자"
                  />
                  <div className="w-20 h-0.5 bg-gray-400 my-1"></div>
                  <input
                    type="number"
                    value={secondFraction.denominator}
                    onChange={(e) => handleInput(2, 'denominator', e.target.value)}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    placeholder="분모"
                  />
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateFractions}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">분수 형태</label>
                    <div className="text-2xl font-bold text-black">{result}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">소수 형태</label>
                    <div className="text-2xl font-bold text-black">{decimalResult}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">분수 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>덧셈:</strong> (a/b) + (c/d) = (ad + bc) / (bd)</div>
                  <div>• <strong>뺄셈:</strong> (a/b) - (c/d) = (ad - bc) / (bd)</div>
                  <div>• <strong>곱셈:</strong> (a/b) × (c/d) = (ac) / (bd)</div>
                  <div>• <strong>나눗셈:</strong> (a/b) ÷ (c/d) = (ad) / (bc)</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">특징</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>자동 기약분수:</strong> 결과를 자동으로 기약분수로 변환</div>
                  <div>• <strong>소수 변환:</strong> 분수 결과를 소수로도 표시</div>
                  <div>• <strong>0 나눗셈 방지:</strong> 분모가 0인 경우 오류 처리</div>
                  <div>• <strong>실시간 계산:</strong> 연산 선택 시 자동 계산</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">공학 계산</p>
              </Link>
              
              <Link href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">백분율 계산</p>
              </Link>
              
              <Link href="/basic-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">기본 계산기</h4>
                <p className="text-xs text-gray-600">기본 계산</p>
              </Link>
              
              <Link href="/triangle-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">삼각형 계산기</h4>
                <p className="text-xs text-gray-600">기하학 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
