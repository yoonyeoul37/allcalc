"use client";

import { useState } from "react";

export default function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
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

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const toggleSign = () => {
    if (display !== "0") {
      setDisplay(display.charAt(0) === "-" ? display.slice(1) : "-" + display);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-800 p-4 w-80 h-[450px] overflow-hidden shadow-lg">
      <h3 className="text-center text-base font-semibold text-gray-700 mb-3">일반 계산기</h3>
      
      {/* Display */}
      <div className="bg-gray-800 text-white text-right p-4 mb-4 text-2xl font-mono min-h-[60px] flex items-center justify-end border border-gray-400">
        {display}
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button onClick={clear} className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 text-base font-semibold border border-red-600">
          AC
        </button>
        <button onClick={clearEntry} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-400">
          CE
        </button>
        <button onClick={inputPercent} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-400">
          %
        </button>
        <button onClick={() => inputOperation("÷")} className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 text-base font-semibold border border-orange-600">
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => inputNumber("7")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          7
        </button>
        <button onClick={() => inputNumber("8")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          8
        </button>
        <button onClick={() => inputNumber("9")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          9
        </button>
        <button onClick={() => inputOperation("×")} className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 text-base font-semibold border border-orange-600">
          ×
        </button>

        {/* Row 3 */}
        <button onClick={() => inputNumber("4")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          4
        </button>
        <button onClick={() => inputNumber("5")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          5
        </button>
        <button onClick={() => inputNumber("6")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          6
        </button>
        <button onClick={() => inputOperation("-")} className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 text-base font-semibold border border-orange-600">
          −
        </button>

        {/* Row 4 */}
        <button onClick={() => inputNumber("1")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          1
        </button>
        <button onClick={() => inputNumber("2")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          2
        </button>
        <button onClick={() => inputNumber("3")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          3
        </button>
        <button onClick={() => inputOperation("+")} className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 text-base font-semibold border border-orange-600">
          +
        </button>

        {/* Row 5 */}
        <button onClick={toggleSign} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-400">
          +/−
        </button>
        <button onClick={() => inputNumber("0")} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          0
        </button>
        <button onClick={inputDecimal} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-base font-semibold border border-gray-300">
          .
        </button>
        <button onClick={performCalculation} className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 text-base font-semibold border border-green-700">
          =
        </button>
      </div>
    </div>
  );
} 