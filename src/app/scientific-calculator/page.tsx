"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaArrowLeft, FaInfoCircle, FaCog, FaChartLine } from "react-icons/fa";
import { Header, Footer } from '../../components';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [angleMode, setAngleMode] = useState("deg"); // deg or rad

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
      case "^":
        return Math.pow(firstValue, secondValue);
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

  const scientificFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case "sin":
        result = Math.sin(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue);
        break;
      case "cos":
        result = Math.cos(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue);
        break;
      case "tan":
        result = Math.tan(angleMode === "deg" ? (inputValue * Math.PI) / 180 : inputValue);
        break;
      case "log":
        result = Math.log10(inputValue);
        break;
      case "ln":
        result = Math.log(inputValue);
        break;
      case "sqrt":
        result = Math.sqrt(inputValue);
        break;
      case "square":
        result = inputValue * inputValue;
        break;
      case "cube":
        result = inputValue * inputValue * inputValue;
        break;
      case "factorial":
        result = factorial(inputValue);
        break;
      case "exp":
        result = Math.exp(inputValue);
        break;
      case "abs":
        result = Math.abs(inputValue);
        break;
      case "inverse":
        result = 1 / inputValue;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const toggleAngleMode = () => {
    setAngleMode(angleMode === "deg" ? "rad" : "deg");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-2xl mx-auto pt-8 pb-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaCalculator className="text-2xl text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">과학용 계산기</h1>
            </div>
            <Link 
              href="/" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-1" />
              <span className="text-sm">홈으로</span>
            </Link>
          </div>

          {/* 각도 모드 표시 */}
          <div className="mb-4">
            <button
              onClick={toggleAngleMode}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {angleMode === "deg" ? "도(DEG)" : "라디안(RAD)"}
            </button>
          </div>

          {/* 디스플레이 */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="text-right text-3xl font-mono text-gray-800 min-h-[2.5rem] flex items-center justify-end">
              {display}
            </div>
          </div>

          {/* 계산기 버튼들 */}
          <div className="grid grid-cols-5 gap-2">
            {/* 첫 번째 행 - 과학 함수들 */}
            <button
              onClick={() => scientificFunction("sin")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              sin
            </button>
            <button
              onClick={() => scientificFunction("cos")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              cos
            </button>
            <button
              onClick={() => scientificFunction("tan")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              tan
            </button>
            <button
              onClick={() => scientificFunction("log")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              log
            </button>
            <button
              onClick={() => scientificFunction("ln")}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              ln
            </button>

            {/* 두 번째 행 - 추가 과학 함수들 */}
            <button
              onClick={() => scientificFunction("sqrt")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              √
            </button>
            <button
              onClick={() => scientificFunction("square")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              x²
            </button>
            <button
              onClick={() => scientificFunction("cube")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              x³
            </button>
            <button
              onClick={() => scientificFunction("factorial")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              x!
            </button>
            <button
              onClick={() => scientificFunction("exp")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              eˣ
            </button>

            {/* 세 번째 행 - 기본 연산자 */}
            <button
              onClick={clear}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-2 rounded-lg transition-colors"
            >
              AC
            </button>
            <button
              onClick={() => scientificFunction("abs")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              |x|
            </button>
            <button
              onClick={() => scientificFunction("inverse")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-2 rounded-lg transition-colors text-sm"
            >
              1/x
            </button>
            <button
              onClick={() => performOperation("÷")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-2 rounded-lg transition-colors"
            >
              ÷
            </button>

            {/* 네 번째 행 - 숫자 7-9 */}
            <button
              onClick={() => inputDigit("7")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              7
            </button>
            <button
              onClick={() => inputDigit("8")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              8
            </button>
            <button
              onClick={() => inputDigit("9")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              9
            </button>
            <button
              onClick={() => performOperation("×")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-2 rounded-lg transition-colors"
            >
              ×
            </button>

            {/* 다섯 번째 행 - 숫자 4-6 */}
            <button
              onClick={() => inputDigit("4")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              4
            </button>
            <button
              onClick={() => inputDigit("5")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              5
            </button>
            <button
              onClick={() => inputDigit("6")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              6
            </button>
            <button
              onClick={() => performOperation("-")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-2 rounded-lg transition-colors"
            >
              -
            </button>

            {/* 여섯 번째 행 - 숫자 1-3 */}
            <button
              onClick={() => inputDigit("1")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              1
            </button>
            <button
              onClick={() => inputDigit("2")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              2
            </button>
            <button
              onClick={() => inputDigit("3")}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              3
            </button>
            <button
              onClick={() => performOperation("+")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-2 rounded-lg transition-colors"
            >
              +
            </button>

            {/* 일곱 번째 행 - 0, 소수점, 등호 */}
            <button
              onClick={() => inputDigit("0")}
              className="col-span-2 bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              0
            </button>
            <button
              onClick={inputDecimal}
              className="bg-white border-2 border-gray-300 hover:bg-gray-100 text-black font-bold py-3 px-2 rounded-lg transition-colors shadow-sm"
              style={{ WebkitTapHighlightColor: 'transparent', color: '#000000' }}
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded-lg transition-colors"
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
              <li>• 삼각함수: sin, cos, tan (각도 모드 전환 가능)</li>
              <li>• 로그함수: log(밑이 10), ln(자연로그)</li>
              <li>• 거듭제곱: x², x³, x^n</li>
              <li>• 기타: √(제곱근), x!(팩토리얼), eˣ(지수함수)</li>
              <li>• 각도 모드: 도(DEG)와 라디안(RAD) 전환 가능</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
