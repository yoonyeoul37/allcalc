"use client";

import { useState } from "react";
import { FaCalculator, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { Header, Footer } from '../../components';
import Link from 'next/link';

export default function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue === null || operation === null) {
      return;
    }

    const newValue = calculate(previousValue, inputValue, operation);
    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    const newValue = currentValue / 100;
    setDisplay(String(newValue));
  };

  const handlePlusMinus = () => {
    const currentValue = parseFloat(display);
    const newValue = -currentValue;
    setDisplay(String(newValue));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-md mx-auto pt-8 pb-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaCalculator className="text-2xl text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">일반계산기</h1>
            </div>
            <Link 
              href="/" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-1" />
              <span className="text-sm">홈으로</span>
            </Link>
          </div>

          {/* 디스플레이 */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="text-right text-3xl font-mono text-black min-h-[2.5rem] flex items-center justify-end" style={{ color: '#000000 !important' }}>
              {display}
            </div>
          </div>

          {/* 계산기 버튼들 */}
          <div className="grid grid-cols-4 gap-3">
            {/* 첫 번째 행 */}
            <button
              onClick={clear}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              AC
            </button>
            <button
              onClick={handlePlusMinus}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ±
            </button>
            <button
              onClick={handlePercent}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              %
            </button>

            {/* 두 번째 행 */}
            <button
              onClick={() => performOperation("÷")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ÷
            </button>
            <button
              onClick={() => inputDigit("7")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              7
            </button>
            <button
              onClick={() => inputDigit("8")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              8
            </button>
            <button
              onClick={() => inputDigit("9")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              9
            </button>

            {/* 세 번째 행 */}
            <button
              onClick={() => performOperation("×")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ×
            </button>
            <button
              onClick={() => inputDigit("4")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              4
            </button>
            <button
              onClick={() => inputDigit("5")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              5
            </button>
            <button
              onClick={() => inputDigit("6")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              6
            </button>

            {/* 네 번째 행 */}
            <button
              onClick={() => performOperation("-")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              -
            </button>
            <button
              onClick={() => inputDigit("1")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              1
            </button>
            <button
              onClick={() => inputDigit("2")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              2
            </button>
            <button
              onClick={() => inputDigit("3")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              3
            </button>

            {/* 다섯 번째 행 */}
            <button
              onClick={() => performOperation("+")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              +
            </button>
            <button
              onClick={() => inputDigit("0")}
              className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              .
            </button>

            {/* 여섯 번째 행 */}
            <button
              onClick={handleEquals}
              className="col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              =
            </button>
          </div>

          {/* 사용법 안내 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FaInfoCircle className="text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">사용법</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 기본적인 사칙연산(덧셈, 뺄셈, 곱셈, 나눗셈)을 지원합니다</li>
              <li>• AC 버튼으로 모든 값을 초기화할 수 있습니다</li>
              <li>• ± 버튼으로 양수/음수를 전환할 수 있습니다</li>
              <li>• % 버튼으로 백분율 계산을 할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
