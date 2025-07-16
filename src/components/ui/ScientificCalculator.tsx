"use client";

import { useState } from "react";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [isDegree, setIsDegree] = useState(true);

  const handleClick = (value: string) => {
    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay(display + value);
    }
  };

  const calculate = () => {
    try {
      const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const clear = () => setDisplay("0");
  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  return (
    <div className="bg-white border-2 border-gray-800 p-4 w-80 h-[450px] overflow-hidden shadow-lg">
      <h3 className="text-center text-base font-semibold text-gray-700 mb-3">과학 계산기</h3>
      {/* Display */}
      <div className="bg-gray-800 text-white text-right p-3 mb-3 text-xl font-mono min-h-[50px] flex items-center justify-end border border-gray-400">
        {display}
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-5 gap-0.5 text-xs">
        {/* Row 1 */}
        <button onClick={() => handleClick("sin")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">sin</button>
        <button onClick={() => handleClick("cos")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">cos</button>
        <button onClick={() => handleClick("tan")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">tan</button>
        <button onClick={() => setIsDegree(!isDegree)} className="bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white p-1.5 text-xs">
          {isDegree ? "Deg" : "Rad"}
        </button>
        <button onClick={() => handleClick("sin⁻¹")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">sin⁻¹</button>
        
        {/* Row 2 */}
        <button onClick={() => handleClick("tan⁻¹")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">tan⁻¹</button>
        <button onClick={() => handleClick("π")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">π</button>
        <button onClick={() => handleClick("e")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">e</button>
        <button onClick={() => handleClick("x^y")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">x^y</button>
        <button onClick={() => handleClick("x³")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">x³</button>

        {/* Row 3 */}
        <button onClick={() => handleClick("x²")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">x²</button>
        <button onClick={() => handleClick("e^x")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">e^x</button>
        <button onClick={() => handleClick("10^x")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">10^x</button>
        <button onClick={() => handleClick("√")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">√x</button>
        <button onClick={() => handleClick("³√")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">³√x</button>

        {/* Row 4 */}
        <button onClick={() => handleClick("√")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">√</button>
        <button onClick={() => handleClick("ln")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">ln</button>
        <button onClick={() => handleClick("log")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">log</button>
        <button onClick={() => handleClick("(")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">(</button>
        <button onClick={() => handleClick(")")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">)</button>

        {/* Row 5 */}
        <button onClick={() => handleClick("1/x")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">1/x</button>
        <button onClick={() => handleClick("%")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">%</button>
        <button onClick={() => handleClick("n!")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">n!</button>
        <button onClick={() => handleClick("7")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">7</button>
        <button onClick={() => handleClick("8")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">8</button>

        {/* Row 6 */}
        <button onClick={() => handleClick("9")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">9</button>
        <button onClick={() => handleClick("+")} className="bg-orange-400 hover:bg-orange-500 border border-orange-500 text-white p-1.5 text-xs font-semibold">+</button>
        <button onClick={backspace} className="bg-red-400 hover:bg-red-500 border border-red-500 text-white p-1.5 text-xs">Back</button>
        <button onClick={() => handleClick("4")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">4</button>
        <button onClick={() => handleClick("5")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">5</button>

        {/* Row 7 */}
        <button onClick={() => handleClick("6")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">6</button>
        <button onClick={() => handleClick("−")} className="bg-orange-400 hover:bg-orange-500 border border-orange-500 text-white p-1.5 text-xs font-semibold">−</button>
        <button onClick={() => handleClick("Ans")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">Ans</button>
        <button onClick={() => handleClick("1")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">1</button>
        <button onClick={() => handleClick("2")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">2</button>

        {/* Row 8 */}
        <button onClick={() => handleClick("3")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">3</button>
        <button onClick={() => handleClick("×")} className="bg-orange-400 hover:bg-orange-500 border border-orange-500 text-white p-1.5 text-xs font-semibold">×</button>
        <button onClick={() => handleClick("M+")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">M+</button>
        <button onClick={() => handleClick("0")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">0</button>
        <button onClick={() => handleClick(".")} className="bg-white hover:bg-gray-100 border border-gray-400 p-1.5 text-xs font-semibold">.</button>

        {/* Row 9 */}
        <button onClick={() => handleClick("EXP")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">EXP</button>
        <button onClick={() => handleClick("÷")} className="bg-orange-400 hover:bg-orange-500 border border-orange-500 text-white p-1.5 text-xs font-semibold">÷</button>
        <button onClick={() => handleClick("M-")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">M-</button>
        <button onClick={() => handleClick("±")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">±</button>
        <button onClick={() => handleClick("RND")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">RND</button>

        {/* Row 10 */}
        <button onClick={clear} className="bg-red-400 hover:bg-red-500 border border-red-500 text-white p-1.5 text-xs font-semibold">AC</button>
        <button onClick={calculate} className="bg-green-600 hover:bg-green-700 border border-green-700 text-white p-1.5 text-xs font-semibold">=</button>
        <button onClick={() => handleClick("MR")} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs">MR</button>
        <button className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs"></button>
        <button className="bg-gray-200 hover:bg-gray-300 border border-gray-400 p-1.5 text-xs"></button>
      </div>
    </div>
  );
} 