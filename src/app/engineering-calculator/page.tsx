"use client";

import { useState } from "react";
import { FaCalculator, FaCog, FaChartLine, FaSquareRootAlt, FaDice, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function EngineeringCalculator() {
  const [display, setDisplay] = useState<string>("0");
  const [previousValue, setPreviousValue] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<string>("deg"); // deg or rad

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
    setPreviousValue("");
    setOperation("");
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === "") {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
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

  const calculateResult = () => {
    const inputValue = parseFloat(display);

    if (previousValue === "" || !operation) {
      return;
    }

    const currentValue = parseFloat(previousValue);
    const newValue = calculate(currentValue, inputValue, operation);
    setDisplay(String(newValue));
    setPreviousValue("");
    setOperation("");
    setWaitingForOperand(true);
  };

  // Scientific functions
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

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const toggleAngleMode = () => {
    setAngleMode(angleMode === "deg" ? "rad" : "deg");
  };

  // 각도 변환 함수들
  const convertDegToRad = () => {
    const inputValue = parseFloat(display);
    const radValue = (inputValue * Math.PI) / 180;
    setDisplay(String(radValue.toFixed(6)));
    setWaitingForOperand(true);
  };

  const convertRadToDeg = () => {
    const inputValue = parseFloat(display);
    const degValue = (inputValue * 180) / Math.PI;
    setDisplay(String(degValue.toFixed(6)));
    setWaitingForOperand(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaCalculator className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">공학용 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">삼각함수, 로그, 지수 등 고급 수학 함수를 지원하는 공학용 계산기</p>
          </div>

          {/* 공학용 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">계산기</h3>
            
            {/* 각도 모드 토글 */}
            <div className="mb-4 flex justify-center">
              <button
                onClick={toggleAngleMode}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  angleMode === "deg"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {angleMode === "deg" ? "도(DEG)" : "라디안(RAD)"}
              </button>
            </div>

            {/* 디스플레이 */}
            <div className="mb-6">
              <div className="bg-gray-100 p-4 rounded-lg text-right">
                <div className="text-sm text-gray-500 mb-1">
                  {previousValue} {operation}
                </div>
                <div className="text-2xl font-bold text-gray-800">{display}</div>
              </div>
            </div>

            {/* 메모리 버튼들 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={memoryStore}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                MS
              </button>
              <button
                onClick={memoryRecall}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                MR
              </button>
              <button
                onClick={memoryAdd}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                M+
              </button>
              <button
                onClick={memoryClear}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                MC
              </button>
            </div>

            {/* 과학 함수 버튼들 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => scientificFunction("sin")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                sin
              </button>
              <button
                onClick={() => scientificFunction("cos")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                cos
              </button>
              <button
                onClick={() => scientificFunction("tan")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                tan
              </button>
              <button
                onClick={() => scientificFunction("log")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                log
              </button>
              <button
                onClick={() => scientificFunction("ln")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                ln
              </button>
              <button
                onClick={() => scientificFunction("sqrt")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                √
              </button>
              <button
                onClick={() => scientificFunction("square")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                x²
              </button>
              <button
                onClick={() => scientificFunction("cube")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                x³
              </button>
              <button
                onClick={() => scientificFunction("factorial")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                x!
              </button>
              <button
                onClick={() => scientificFunction("exp")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                eˣ
              </button>
              <button
                onClick={() => scientificFunction("abs")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                |x|
              </button>
              <button
                onClick={() => scientificFunction("inverse")}
                className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                1/x
              </button>
            </div>

            {/* 각도 변환 버튼들 */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={convertDegToRad}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                DEG→RAD
              </button>
              <button
                onClick={convertRadToDeg}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                RAD→DEG
              </button>
            </div>

            {/* 기본 연산 버튼들 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => performOperation("÷")}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                ÷
              </button>
              <button
                onClick={() => performOperation("×")}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                ×
              </button>
              <button
                onClick={() => performOperation("-")}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                -
              </button>
              <button
                onClick={() => performOperation("+")}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                +
              </button>
            </div>

            {/* 숫자 버튼들 */}
            <div className="grid grid-cols-3 gap-2">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                <button
                  key={num}
                  onClick={() => inputDigit(num.toString())}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={inputDecimal}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                =
              </button>
            </div>

            {/* Clear 버튼 */}
            <div className="mt-4">
              <button
                onClick={clear}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">공학용 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">기본 기능</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>사칙연산:</strong> 덧셈, 뺄셈, 곱셈, 나눗셈</div>
                  <div>• <strong>메모리 기능:</strong> MS, MR, M+, MC</div>
                  <div>• <strong>각도 모드:</strong> 도(DEG) / 라디안(RAD)</div>
                  <div>• <strong>각도 변환:</strong> DEG↔RAD 변환</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">과학 함수</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>삼각함수:</strong> sin, cos, tan</div>
                  <div>• <strong>로그함수:</strong> log(상용로그), ln(자연로그)</div>
                  <div>• <strong>지수함수:</strong> eˣ, x², x³</div>
                  <div>• <strong>기타:</strong> √x, x!, |x|, 1/x</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/basic-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">기본 계산기</h4>
                <p className="text-xs text-gray-600">기본 계산</p>
              </a>
              
              <a href="/scientific-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">과학 계산기</h4>
                <p className="text-xs text-gray-600">과학 계산</p>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">백분율 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}