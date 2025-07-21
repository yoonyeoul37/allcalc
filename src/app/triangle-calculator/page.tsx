"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaRuler, FaAngleUp, FaDrawPolygon, FaSquareRootAlt } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function TriangleCalculator() {
  const [calculationType, setCalculationType] = useState<string>("area");
  const [sideA, setSideA] = useState<string>("");
  const [sideB, setSideB] = useState<string>("");
  const [sideC, setSideC] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [angleA, setAngleA] = useState<string>("");
  const [angleB, setAngleB] = useState<string>("");
  const [angleC, setAngleC] = useState<string>("");
  const [results, setResults] = useState<any>({});
  const [calculationSteps, setCalculationSteps] = useState<string>("");

  // 면적 계산 (밑변 × 높이 ÷ 2)
  const calculateArea = () => {
    const base = parseFloat(sideA);
    const h = parseFloat(height);
    
    if (isNaN(base) || isNaN(h) || base <= 0 || h <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    const area = (base * h) / 2;
    setResults({
      area: area.toFixed(2),
      perimeter: "계산 불가",
      height: h.toFixed(2),
      angles: "계산 불가"
    });
    setCalculationSteps(`면적 = (밑변 × 높이) ÷ 2 = (${base} × ${h}) ÷ 2 = ${area.toFixed(2)}`);
  };

  // 헤론의 공식으로 면적 계산
  const calculateAreaHeron = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    // 삼각형 조건 확인
    if (a + b <= c || b + c <= a || a + c <= b) {
      alert("삼각형이 될 수 없는 변의 길이입니다");
      return;
    }

    const s = (a + b + c) / 2; // 반둘레
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const perimeter = a + b + c;
    
    setResults({
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      height: "계산 불가",
      angles: "계산 불가"
    });
    setCalculationSteps(`헤론의 공식: s = (${a} + ${b} + ${c}) ÷ 2 = ${s}, 면적 = √(s(s-a)(s-b)(s-c)) = ${area.toFixed(2)}`);
  };

  // 둘레 계산
  const calculatePerimeter = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    const perimeter = a + b + c;
    setResults({
      area: "계산 불가",
      perimeter: perimeter.toFixed(2),
      height: "계산 불가",
      angles: "계산 불가"
    });
    setCalculationSteps(`둘레 = ${a} + ${b} + ${c} = ${perimeter.toFixed(2)}`);
  };

  // 피타고라스 정리 (직각삼각형)
  const calculatePythagorean = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    const c = Math.sqrt(a * a + b * b);
    const area = (a * b) / 2;
    const perimeter = a + b + c;
    
    setResults({
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      height: b.toFixed(2),
      angles: "90°, 계산 불가, 계산 불가"
    });
    setCalculationSteps(`피타고라스 정리: c = √(${a}² + ${b}²) = √${a*a + b*b} = ${c.toFixed(2)}`);
  };

  // 각도 계산 (코사인 법칙)
  const calculateAngles = () => {
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);
    
    if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    // 삼각형 조건 확인
    if (a + b <= c || b + c <= a || a + c <= b) {
      alert("삼각형이 될 수 없는 변의 길이입니다");
      return;
    }

    // 코사인 법칙으로 각도 계산
    const cosA = (b * b + c * c - a * a) / (2 * b * c);
    const cosB = (a * a + c * c - b * b) / (2 * a * c);
    const cosC = (a * a + b * b - c * c) / (2 * a * b);
    
    const angleA = Math.acos(cosA) * (180 / Math.PI);
    const angleB = Math.acos(cosB) * (180 / Math.PI);
    const angleC = Math.acos(cosC) * (180 / Math.PI);
    
    const area = (a * b * Math.sin(angleC * Math.PI / 180)) / 2;
    const perimeter = a + b + c;
    
    setResults({
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
      height: "계산 불가",
      angles: `${angleA.toFixed(1)}°, ${angleB.toFixed(1)}°, ${angleC.toFixed(1)}°`
    });
    setCalculationSteps(`코사인 법칙으로 각도 계산: A=${angleA.toFixed(1)}°, B=${angleB.toFixed(1)}°, C=${angleC.toFixed(1)}°`);
  };

  // 높이 계산
  const calculateHeight = () => {
    const base = parseFloat(sideA);
    const area = parseFloat(sideB); // 면적을 sideB에 입력
    
    if (isNaN(base) || isNaN(area) || base <= 0 || area <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    const h = (2 * area) / base;
    setResults({
      area: area.toFixed(2),
      perimeter: "계산 불가",
      height: h.toFixed(2),
      angles: "계산 불가"
    });
    setCalculationSteps(`높이 = (2 × 면적) ÷ 밑변 = (2 × ${area}) ÷ ${base} = ${h.toFixed(2)}`);
  };

  // 계산 실행
  const performCalculation = () => {
    switch (calculationType) {
      case "area":
        calculateArea();
        break;
      case "heron":
        calculateAreaHeron();
        break;
      case "perimeter":
        calculatePerimeter();
        break;
      case "pythagorean":
        calculatePythagorean();
        break;
      case "angles":
        calculateAngles();
        break;
      case "height":
        calculateHeight();
        break;
      default:
        break;
    }
  };

  // 입력 초기화
  const clearInputs = () => {
    setSideA("");
    setSideB("");
    setSideC("");
    setHeight("");
    setAngleA("");
    setAngleB("");
    setAngleC("");
    setResults({});
    setCalculationSteps("");
  };

  // 계산 타입에 따른 입력 라벨
  const getInputLabels = () => {
    switch (calculationType) {
      case "area":
        return { label1: "밑변", label2: "높이", label3: "" };
      case "heron":
        return { label1: "변 a", label2: "변 b", label3: "변 c" };
      case "perimeter":
        return { label1: "변 a", label2: "변 b", label3: "변 c" };
      case "pythagorean":
        return { label1: "밑변", label2: "높이", label3: "" };
      case "angles":
        return { label1: "변 a", label2: "변 b", label3: "변 c" };
      case "height":
        return { label1: "밑변", label2: "면적", label3: "" };
      default:
        return { label1: "변 a", label2: "변 b", label3: "변 c" };
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">삼각형 계산기</h1>
            <p className="text-lg text-gray-600">면적, 둘레, 높이, 각도 등을 계산하는 삼각형 도구</p>
          </div>

          {/* 삼각형 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            
            {/* 계산 타입 선택 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">계산 타입 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setCalculationType("area")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "area"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  면적 (밑변×높이)
                </button>
                <button
                  onClick={() => setCalculationType("heron")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "heron"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  면적 (헤론의 공식)
                </button>
                <button
                  onClick={() => setCalculationType("perimeter")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "perimeter"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  둘레
                </button>
                <button
                  onClick={() => setCalculationType("pythagorean")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "pythagorean"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  피타고라스 정리
                </button>
                <button
                  onClick={() => setCalculationType("angles")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "angles"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  각도 계산
                </button>
                <button
                  onClick={() => setCalculationType("height")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    calculationType === "height"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  높이 계산
                </button>
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.label1}
                  </label>
                  <input
                    type="number"
                    value={sideA}
                    onChange={(e) => setSideA(e.target.value)}
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
                    value={sideB}
                    onChange={(e) => setSideB(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="두 번째 값 입력"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.label3}
                  </label>
                  <input
                    type="number"
                    value={sideC}
                    onChange={(e) => setSideC(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="세 번째 값 입력"
                    disabled={calculationType === "area" || calculationType === "pythagorean" || calculationType === "height"}
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
            {Object.keys(results).length > 0 && (
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">면적</div>
                      <div className="text-2xl font-bold text-gray-800">{results.area}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">둘레</div>
                      <div className="text-2xl font-bold text-gray-800">{results.perimeter}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">높이</div>
                      <div className="text-2xl font-bold text-gray-800">{results.height}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">각도</div>
                      <div className="text-2xl font-bold text-gray-800">{results.angles}</div>
                    </div>
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
                    setCalculationType("area");
                    setSideA("6");
                    setHeight("4");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  밑변 6, 높이 4
                </button>
                <button
                  onClick={() => {
                    setCalculationType("heron");
                    setSideA("3");
                    setSideB("4");
                    setSideC("5");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  3, 4, 5 삼각형
                </button>
                <button
                  onClick={() => {
                    setCalculationType("pythagorean");
                    setSideA("3");
                    setSideB("4");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  피타고라스 3,4
                </button>
                <button
                  onClick={() => {
                    setCalculationType("height");
                    setSideA("6");
                    setSideB("12");
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  밑변 6, 면적 12
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
          
          {/* 삼각형 계산기란? */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">삼각형 계산기란?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed mb-4 text-center mx-auto max-w-3xl">
                삼각형 계산기는 삼각형의 각종 특성을 계산하는 도구입니다. 세 변의 길이, 각의 크기, 
                높이, 넓이 등을 입력하여 나머지 값들을 자동으로 계산해줍니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-center mx-auto max-w-3xl">
                피타고라스 정리, 사인 법칙, 코사인 법칙 등을 활용하여 정확한 계산을 수행하며, 
                직각삼각형, 예각삼각형, 둔각삼각형 모두 지원합니다.
              </p>
            </div>
          </section>

          {/* 삼각형 계산 방법 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">삼각형 계산 방법</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">면적 계산</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 기본 공식: (밑변 × 높이) ÷ 2</li>
                  <li>• 헤론의 공식: 세 변의 길이로 계산</li>
                  <li>• 두 변과 끼인 각으로 계산</li>
                  <li>• 예: 밑변 6, 높이 4 → 면적 12</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">둘레 계산</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 세 변의 길이 합</li>
                  <li>• 둘레 = a + b + c</li>
                  <li>• 예: 3, 4, 5 → 둘레 12</li>
                  <li>• 삼각형 조건 확인 필요</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">피타고라스 정리</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 직각삼각형에서만 적용</li>
                  <li>• a² + b² = c²</li>
                  <li>• 예: 3, 4 → 빗변 5</li>
                  <li>• 면적 = (밑변 × 높이) ÷ 2</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">각도 계산</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 코사인 법칙 사용</li>
                  <li>• 세 각의 합은 180°</li>
                  <li>• 예: 3, 4, 5 → 90°, 53.1°, 36.9°</li>
                  <li>• 삼각형 조건 확인 필요</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">기본 면적 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 밑변 6, 높이 4 → 면적 12</p>
                <p><strong>예시 2:</strong> 밑변 10, 높이 8 → 면적 40</p>
                <p><strong>예시 3:</strong> 밑변 5, 높이 3 → 면적 7.5</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">헤론의 공식</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 3, 4, 5 → 면적 6, 둘레 12</p>
                <p><strong>예시 2:</strong> 5, 12, 13 → 면적 30, 둘레 30</p>
                <p><strong>예시 3:</strong> 7, 24, 25 → 면적 84, 둘레 56</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">피타고라스 정리</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 3, 4 → 빗변 5, 면적 6</p>
                <p><strong>예시 2:</strong> 5, 12 → 빗변 13, 면적 30</p>
                <p><strong>예시 3:</strong> 8, 15 → 빗변 17, 면적 60</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">높이 계산</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 밑변 6, 면적 12 → 높이 4</p>
                <p><strong>예시 2:</strong> 밑변 10, 면적 25 → 높이 5</p>
                <p><strong>예시 3:</strong> 밑변 8, 면적 20 → 높이 5</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📐 삼각형 조건</h3>
                <p className="text-gray-600">세 변의 길이가 삼각형이 될 수 있는지 확인합니다. 임의의 두 변의 합이 나머지 한 변보다 커야 합니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔢 정확도</h3>
                <p className="text-gray-600">결과는 소수점 둘째 자리까지 표시됩니다. 필요시 반올림됩니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 학습 도구</h3>
                <p className="text-gray-600">계산 과정을 확인하여 삼각형 계산의 원리를 이해할 수 있습니다.</p>
              </div>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/engineering-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">공학용 계산기</h3>
                <p className="text-sm text-gray-600">고급 수학 함수</p>
              </Link>
              <Link href="/fraction-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaRuler className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">분수 계산기</h3>
                <p className="text-sm text-gray-600">분수 연산</p>
              </Link>
              <Link href="/percentage-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaAngleUp className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">백분율 계산기</h3>
                <p className="text-sm text-gray-600">백분율 계산</p>
              </Link>
              <Link href="/standard-deviation-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDrawPolygon className="text-2xl text-purple-600" />
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
