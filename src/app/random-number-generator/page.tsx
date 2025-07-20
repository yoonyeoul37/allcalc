"use client";

import { useState } from "react";
import { FaDice, FaRandom, FaList, FaCopy, FaCalculator } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function RandomNumberGenerator() {
  const [generatorType, setGeneratorType] = useState<string>("range");
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("100");
  const [count, setCount] = useState<string>("1");
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);

  // 범위 내 난수 생성
  const generateRangeNumbers = () => {
    const min = parseInt(minValue);
    const max = parseInt(maxValue);
    const numCount = parseInt(count);
    
    if (isNaN(min) || isNaN(max) || isNaN(numCount) || min > max || numCount <= 0) {
      alert("유효한 값을 입력하세요");
      return;
    }

    const numbers: number[] = [];
    
    if (allowDuplicates) {
      // 중복 허용
      for (let i = 0; i < numCount; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else {
      // 중복 제외
      if (numCount > max - min + 1) {
        alert("중복을 제외할 수 없습니다. 범위를 늘리거나 개수를 줄이세요.");
        return;
      }
      
      const availableNumbers = [];
      for (let i = min; i <= max; i++) {
        availableNumbers.push(i);
      }
      
      for (let i = 0; i < numCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        numbers.push(availableNumbers.splice(randomIndex, 1)[0]);
      }
    }
    
    setResults(numbers);
    setHistory(prev => [numbers, ...prev.slice(0, 9)]); // 최근 10개 저장
  };

  // 로또 번호 생성 (1-45, 6개, 중복 제외)
  const generateLottoNumbers = () => {
    const numbers: number[] = [];
    const availableNumbers = [];
    
    for (let i = 1; i <= 45; i++) {
      availableNumbers.push(i);
    }
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      numbers.push(availableNumbers.splice(randomIndex, 1)[0]);
    }
    
    numbers.sort((a, b) => a - b); // 오름차순 정렬
    setResults(numbers);
    setHistory(prev => [numbers, ...prev.slice(0, 9)]);
  };

  // 주사위 굴리기 (1-6)
  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1;
    setResults([result]);
    setHistory(prev => [[result], ...prev.slice(0, 9)]);
  };

  // 동전 던지기 (0 또는 1)
  const flipCoin = () => {
    const result = Math.floor(Math.random() * 2);
    setResults([result]);
    setHistory(prev => [[result], ...prev.slice(0, 9)]);
  };

  // 카드 뽑기 (1-52)
  const drawCard = () => {
    const result = Math.floor(Math.random() * 52) + 1;
    setResults([result]);
    setHistory(prev => [[result], ...prev.slice(0, 9)]);
  };

  // 결과를 클립보드에 복사
  const copyToClipboard = () => {
    const text = results.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      alert("클립보드에 복사되었습니다!");
    });
  };

  // 결과 초기화
  const clearResults = () => {
    setResults([]);
    setHistory([]);
  };

  // 결과를 문자열로 변환
  const getResultText = () => {
    if (results.length === 0) return "";
    
    switch (generatorType) {
      case "lotto":
        return results.join(" - ");
      case "dice":
        return `주사위: ${results[0]}`;
      case "coin":
        return results[0] === 0 ? "앞면" : "뒷면";
      case "card":
        const suits = ["♠", "♥", "♦", "♣"];
        const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const cardIndex = results[0] - 1;
        const suit = suits[Math.floor(cardIndex / 13)];
        const rank = ranks[cardIndex % 13];
        return `${suit}${rank}`;
      default:
        return results.join(", ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      {/* 메인 생성기 섹션 */}
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">난수 생성기</h1>
            <p className="text-lg text-gray-600">무작위 숫자, 로또 번호, 주사위 등을 생성하는 도구</p>
          </div>

          {/* 난수 생성기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            
            {/* 생성 타입 선택 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">생성 타입 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setGeneratorType("range")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "range"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  범위 지정
                </button>
                <button
                  onClick={() => setGeneratorType("lotto")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "lotto"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  로또 번호
                </button>
                <button
                  onClick={() => setGeneratorType("dice")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "dice"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  주사위
                </button>
                <button
                  onClick={() => setGeneratorType("coin")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "coin"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  동전 던지기
                </button>
                <button
                  onClick={() => setGeneratorType("card")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "card"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  카드 뽑기
                </button>
                <button
                  onClick={() => setGeneratorType("sequence")}
                  className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                    generatorType === "sequence"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  시퀀스 섞기
                </button>
              </div>
            </div>

            {/* 범위 지정 입력 필드 */}
            {generatorType === "range" && (
              <div className="mb-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최소값</label>
                    <input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                      placeholder="최소값"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">최대값</label>
                    <input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                      placeholder="최대값"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">생성 개수</label>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                      placeholder="개수"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allowDuplicates}
                      onChange={(e) => setAllowDuplicates(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">중복 허용</span>
                  </label>
                </div>
              </div>
            )}

            {/* 생성 버튼 */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => {
                  switch (generatorType) {
                    case "range":
                      generateRangeNumbers();
                      break;
                    case "lotto":
                      generateLottoNumbers();
                      break;
                    case "dice":
                      rollDice();
                      break;
                    case "coin":
                      flipCoin();
                      break;
                    case "card":
                      drawCard();
                      break;
                    case "sequence":
                      generateRangeNumbers();
                      break;
                  }
                }}
                className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                생성하기
              </button>
              <button
                onClick={clearResults}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {results.length > 0 && (
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">생성 결과</h3>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{getResultText()}</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FaCopy className="text-sm" />
                    복사
                  </button>
                  <button
                    onClick={() => {
                      switch (generatorType) {
                        case "range":
                          generateRangeNumbers();
                          break;
                        case "lotto":
                          generateLottoNumbers();
                          break;
                        case "dice":
                          rollDice();
                          break;
                        case "coin":
                          flipCoin();
                          break;
                        case "card":
                          drawCard();
                          break;
                        case "sequence":
                          generateRangeNumbers();
                          break;
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <FaRandom className="text-sm" />
                    다시 생성
                  </button>
                </div>
              </div>
            )}

            {/* 생성 히스토리 */}
            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">생성 히스토리</h3>
                <div className="space-y-2">
                  {history.map((result, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-sm text-gray-600">#{index + 1}</span>
                      <span className="font-medium">
                        {generatorType === "lotto" 
                          ? result.join(" - ")
                          : generatorType === "dice"
                          ? `주사위: ${result[0]}`
                          : generatorType === "coin"
                          ? (result[0] === 0 ? "앞면" : "뒷면")
                          : generatorType === "card"
                          ? (() => {
                              const suits = ["♠", "♥", "♦", "♣"];
                              const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
                              const cardIndex = result[0] - 1;
                              const suit = suits[Math.floor(cardIndex / 13)];
                              const rank = ranks[cardIndex % 13];
                              return `${suit}${rank}`;
                            })()
                          : result.join(", ")
                        }
                      </span>
                      <button
                        onClick={() => {
                          const text = result.join(", ");
                          navigator.clipboard.writeText(text);
                          alert("클립보드에 복사되었습니다!");
                        }}
                        className="text-[#003366] hover:text-[#002244] text-sm"
                      >
                        복사
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 빠른 생성 예시 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">빠른 생성 예시</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setGeneratorType("range");
                    setMinValue("1");
                    setMaxValue("100");
                    setCount("5");
                    setAllowDuplicates(true);
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  1-100, 5개
                </button>
                <button
                  onClick={() => {
                    setGeneratorType("lotto");
                    generateLottoNumbers();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  로또 번호
                </button>
                <button
                  onClick={() => {
                    setGeneratorType("dice");
                    rollDice();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  주사위 굴리기
                </button>
                <button
                  onClick={() => {
                    setGeneratorType("coin");
                    flipCoin();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  동전 던지기
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
          
          {/* 난수 생성기란? */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">난수 생성기란?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed mb-4 text-center mx-auto max-w-3xl">
                난수 생성기는 무작위 숫자를 생성하는 도구입니다. 게임, 추첨, 통계 분석, 암호화 등 
                다양한 분야에서 사용되는 무작위 숫자를 쉽게 생성할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-center mx-auto max-w-3xl">
                최소값과 최대값을 설정하여 원하는 범위 내의 난수를 생성할 수 있으며, 
                중복 제거 옵션을 통해 고유한 난수들만 생성할 수도 있습니다.
              </p>
            </div>
          </section>

          {/* 난수 생성 방법 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">난수 생성 방법</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">범위 지정 생성</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 최소값과 최대값을 설정</li>
                  <li>• 생성할 개수 지정</li>
                  <li>• 중복 허용/제외 선택</li>
                  <li>• 예: 1-100 사이 5개 숫자</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">특수 생성</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 로또 번호: 1-45, 6개, 중복 제외</li>
                  <li>• 주사위: 1-6 사이 숫자</li>
                  <li>• 동전: 앞면(0) 또는 뒷면(1)</li>
                  <li>• 카드: 52장 중 1장</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">시퀀스 섞기</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 연속된 숫자를 무작위 순서로</li>
                  <li>• 예: 1-10을 무작위 순서로</li>
                  <li>• 중복 없이 모든 숫자 포함</li>
                  <li>• 순서만 무작위로 변경</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">기능</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 결과 클립보드 복사</li>
                  <li>• 생성 히스토리 저장</li>
                  <li>• 빠른 재생성</li>
                  <li>• 다양한 출력 형식</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">범위 지정 생성</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 1-100 사이 5개 → 23, 67, 12, 89, 45</p>
                <p><strong>예시 2:</strong> 1-10 사이 3개 (중복 제외) → 7, 2, 9</p>
                <p><strong>예시 3:</strong> 0-1 사이 10개 → 0, 1, 1, 0, 1, 0, 0, 1, 1, 0</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">특수 생성</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>로또 번호:</strong> 7 - 12 - 23 - 31 - 38 - 44</p>
                <p><strong>주사위:</strong> 4</p>
                <p><strong>동전:</strong> 앞면</p>
                <p><strong>카드:</strong> ♥K</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">시퀀스 섞기</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 1-5 → 3, 1, 5, 2, 4</p>
                <p><strong>예시 2:</strong> 1-10 → 7, 2, 9, 1, 6, 10, 3, 8, 4, 5</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎲 무작위성</h3>
                <p className="text-gray-600">생성된 숫자는 완전히 무작위입니다. 이전 결과가 다음 결과에 영향을 주지 않습니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📊 중복 제외</h3>
                <p className="text-gray-600">중복을 제외할 때는 생성 개수가 범위보다 클 수 없습니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💾 히스토리</h3>
                <p className="text-gray-600">최근 10개의 생성 결과가 히스토리에 저장됩니다. 페이지를 새로고침하면 초기화됩니다.</p>
              </div>
            </div>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/percentage-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaRandom className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">백분율 계산기</h3>
                <p className="text-sm text-gray-600">확률 계산</p>
              </a>
              <a href="/fraction-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDice className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">분수 계산기</h3>
                <p className="text-sm text-gray-600">분수 연산</p>
              </a>
              <a href="/triangle-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaList className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">삼각형 계산기</h3>
                <p className="text-sm text-gray-600">기하학 계산</p>
              </a>
              <a href="/standard-deviation-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-purple-600" />
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

      <Footer />
    </div>
  );
} 