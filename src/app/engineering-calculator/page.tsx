"use client";

import { useState } from "react";
import { FaCalculator, FaCog, FaChartLine, FaSquareRootAlt, FaDice } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">공학용 계산기</h1>
            <p className="text-lg text-gray-600">삼각함수, 로그, 지수 등 고급 수학 함수를 지원하는 공학용 계산기</p>
          </div>

          {/* 공학용 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            
            {/* 각도 모드 토글 */}
            <div className="mb-4 flex justify-center items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={toggleAngleMode}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    angleMode === "deg" 
                      ? "bg-blue-500 text-white" 
                      : "bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  DEG
                </button>
                <button
                  onClick={toggleAngleMode}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    angleMode === "rad" 
                      ? "bg-blue-500 text-white" 
                      : "bg-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  RAD
                </button>
              </div>
              <div className="text-sm text-gray-600">
                현재 모드: <span className="font-semibold text-blue-600">{angleMode.toUpperCase()}</span>
              </div>
            </div>

            {/* 디스플레이 */}
            <div className="mb-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-right font-mono text-2xl min-h-[3rem] flex items-center justify-end">
                {display}
              </div>
              {operation && (
                <div className="text-right text-sm text-gray-500 mt-1">
                  {previousValue} {operation}
                </div>
              )}
            </div>

            {/* 메모리 버튼 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={memoryStore}
                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                MS
              </button>
              <button
                onClick={memoryRecall}
                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                MR
              </button>
              <button
                onClick={memoryAdd}
                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                M+
              </button>
              <button
                onClick={memoryClear}
                className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                MC
              </button>
            </div>

            {/* 과학 함수 버튼 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => scientificFunction("sin")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                sin
              </button>
              <button
                onClick={() => scientificFunction("cos")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                cos
              </button>
              <button
                onClick={() => scientificFunction("tan")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                tan
              </button>
              <button
                onClick={() => scientificFunction("log")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                log
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={convertDegToRad}
                className="bg-green-100 hover:bg-green-200 p-3 rounded-lg font-medium text-xs transition-colors"
              >
                DEG→RAD
              </button>
              <button
                onClick={convertRadToDeg}
                className="bg-green-100 hover:bg-green-200 p-3 rounded-lg font-medium text-xs transition-colors"
              >
                RAD→DEG
              </button>
              <button
                onClick={() => scientificFunction("ln")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                ln
              </button>
              <button
                onClick={() => scientificFunction("sqrt")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                √
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => scientificFunction("square")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                x²
              </button>
              <button
                onClick={() => scientificFunction("cube")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                x³
              </button>
              <button
                onClick={() => scientificFunction("factorial")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                x!
              </button>
              <button
                onClick={() => scientificFunction("exp")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                eˣ
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => scientificFunction("abs")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                |x|
              </button>
              <button
                onClick={() => scientificFunction("inverse")}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                1/x
              </button>
              <button
                onClick={() => performOperation("^")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                x^y
              </button>
              <button
                onClick={clear}
                className="bg-red-100 hover:bg-red-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                C
              </button>
            </div>

            {/* 기본 연산 버튼 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => setDisplay(display.slice(0, -1) || "0")}
                className="bg-red-100 hover:bg-red-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => performOperation("÷")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                ÷
              </button>
              <button
                onClick={() => performOperation("×")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                ×
              </button>
              <button
                onClick={() => performOperation("-")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-sm transition-colors"
              >
                -
              </button>
            </div>

            {/* 숫자 및 연산 버튼 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => inputDigit("7")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                7
              </button>
              <button
                onClick={() => inputDigit("8")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                8
              </button>
              <button
                onClick={() => inputDigit("9")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                9
              </button>
              <button
                onClick={() => performOperation("×")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => inputDigit("4")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                4
              </button>
              <button
                onClick={() => inputDigit("5")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                5
              </button>
              <button
                onClick={() => inputDigit("6")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                6
              </button>
              <button
                onClick={() => performOperation("-")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                -
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => inputDigit("1")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                1
              </button>
              <button
                onClick={() => inputDigit("2")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                2
              </button>
              <button
                onClick={() => inputDigit("3")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                3
              </button>
              <button
                onClick={() => performOperation("+")}
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => inputDigit("0")}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors col-span-2"
              >
                0
              </button>
              <button
                onClick={inputDecimal}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg font-medium text-lg transition-colors"
              >
                .
              </button>
              <button
                onClick={calculateResult}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-medium text-lg transition-colors"
              >
                =
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">📱 고급 계산기 앱</h3>
                  <p className="text-gray-600 mb-3">공학용 계산기, 그래프 계산기, 수식 편집기</p>
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">무료</span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">고급 기능</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                    다운로드
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 max-w-4xl">
          
          {/* 공학용 계산기란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">공학용 계산기란?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                공학용 계산기는 기본적인 사칙연산뿐만 아니라 삼각함수, 로그, 지수, 제곱근 등 고급 수학 함수를 
                지원하는 계산기입니다. 공학, 물리학, 수학 등의 분야에서 복잡한 계산을 수행할 때 사용됩니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                이 계산기는 각도 단위(DEG/RAD)를 선택할 수 있고, 메모리 기능을 통해 계산 결과를 저장하고 
                재사용할 수 있습니다. 또한 팩토리얼, 절댓값, 역수 등 다양한 수학 함수를 제공합니다.
              </p>
            </div>
          </section>

          {/* 주요 기능 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주요 기능</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">삼각함수</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• sin, cos, tan 함수</li>
                  <li>• 각도 단위 선택 (DEG/RAD)</li>
                  <li>• 역삼각함수 지원</li>
                  <li>• 쌍곡선 함수</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">로그 및 지수</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 자연로그 (ln)</li>
                  <li>• 상용로그 (log)</li>
                  <li>• 지수 함수 (eˣ)</li>
                  <li>• 거듭제곱 (x^y)</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">기하학 함수</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 제곱근 (√)</li>
                  <li>• 제곱 (x²)</li>
                  <li>• 세제곱 (x³)</li>
                  <li>• 절댓값 (|x|)</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">메모리 기능</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 메모리 저장 (MS)</li>
                  <li>• 메모리 불러오기 (MR)</li>
                  <li>• 메모리 더하기 (M+)</li>
                  <li>• 메모리 지우기 (MC)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">삼각함수 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> sin(30°) = 0.5</p>
                <p><strong>예시 2:</strong> cos(π/4) = 0.7071</p>
                <p><strong>예시 3:</strong> tan(45°) = 1</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">로그 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> log(100) = 2</p>
                <p><strong>예시 2:</strong> ln(e) = 1</p>
                <p><strong>예시 3:</strong> e^2 = 7.389</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">기하학 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> √16 = 4</p>
                <p><strong>예시 2:</strong> 5² = 25</p>
                <p><strong>예시 3:</strong> 3³ = 27</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📐 각도 단위</h3>
                <p className="text-gray-600">삼각함수 계산 시 DEG(도) 또는 RAD(라디안) 모드를 선택하세요. 기본값은 DEG 모드입니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔢 입력 순서</h3>
                <p className="text-gray-600">함수 계산 시 먼저 숫자를 입력한 후 함수 버튼을 누르세요. 예: 30 입력 후 sin 버튼</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💾 메모리 기능</h3>
                <p className="text-gray-600">중간 계산 결과를 메모리에 저장하여 복잡한 계산에서 활용할 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/triangle-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">삼각형 계산기</h3>
                <p className="text-sm text-gray-600">기하학 계산</p>
              </a>
              <a href="/standard-deviation-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCog className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">표준편차 계산기</h3>
                <p className="text-sm text-gray-600">통계 분석</p>
              </a>
              <a href="/fraction-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaChartLine className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">분수 계산기</h3>
                <p className="text-sm text-gray-600">분수 연산 계산기</p>
              </a>
              <a href="/percentage-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaSquareRootAlt className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">백분율 계산기</h3>
                <p className="text-sm text-gray-600">백분율 계산</p>
              </a>
              <a href="/random-number-generator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-yellow-300 cursor-pointer">
                <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDice className="text-2xl text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">난수 생성기</h3>
                <p className="text-sm text-gray-600">무작위 숫자 생성</p>
              </a>
            </div>
          </section>
            </div>
            
            {/* 사이드바 광고 (데스크톱 전용) */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-8 space-y-6">
                {/* 광고 4: 사이드바 배너 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-3">추천 광고</div>
                    <div className="bg-gradient-to-b from-blue-400 to-purple-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">📊 수학 도구</h4>
                      <p className="text-sm mb-3">그래프 계산기, 수식 편집기</p>
                      <button className="bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        시작하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 광고 5: 네이티브 광고 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-4">스폰서</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        📱
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">고급 계산기 앱</h5>
                        <p className="text-xs text-gray-600">공학용 + 그래프 기능</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        📚
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">수학 학습 앱</h5>
                        <p className="text-xs text-gray-600">개념 설명 + 연습문제</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        🎓
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">온라인 수학 강의</h5>
                        <p className="text-xs text-gray-600">고등학교 ~ 대학교 수학</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-6 text-sm text-gray-700 leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            이 공학용 계산기는 삼각함수, 로그, 지수 등 고급 수학 함수를 지원합니다. 
            공학, 물리학, 수학 등의 분야에서 복잡한 계산을 수행할 때 유용한 도구입니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 