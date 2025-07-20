"use client";

import { useState } from "react";
import { FaCalculator, FaDice, FaList, FaCopy, FaTrash, FaPlus } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function StandardDeviationCalculator() {
  const [dataInput, setDataInput] = useState<string>("");
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [calculationType, setCalculationType] = useState<string>("sample");
  const [results, setResults] = useState<any>({});
  const [calculationSteps, setCalculationSteps] = useState<string>("");

  // 데이터 입력 처리
  const handleDataInput = () => {
    if (!dataInput.trim()) {
      alert("데이터를 입력하세요");
      return;
    }

    const numbers = dataInput
      .split(/[,\s]+/)
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num));

    if (numbers.length === 0) {
      alert("유효한 숫자를 입력하세요");
      return;
    }

    setDataPoints(numbers);
    calculateStatistics(numbers);
  };

  // 통계 계산
  const calculateStatistics = (data: number[]) => {
    if (data.length === 0) return;

    // 평균 계산
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    // 분산 계산
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    
    // 표본 분산 계산 (n-1로 나누기)
    const sampleVariance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    
    // 표준편차 계산
    const populationStdDev = Math.sqrt(variance);
    const sampleStdDev = Math.sqrt(sampleVariance);
    
    // 최소값, 최대값
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // 범위
    const range = max - min;
    
    // 중앙값
    const sortedData = [...data].sort((a, b) => a - b);
    const median = sortedData.length % 2 === 0 
      ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
      : sortedData[Math.floor(sortedData.length / 2)];

    setResults({
      count: data.length,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      min: min.toFixed(4),
      max: max.toFixed(4),
      range: range.toFixed(4),
      populationVariance: variance.toFixed(4),
      sampleVariance: sampleVariance.toFixed(4),
      populationStdDev: populationStdDev.toFixed(4),
      sampleStdDev: sampleStdDev.toFixed(4)
    });

    // 계산 과정 표시
    const steps = `
      데이터 개수: ${data.length}개
      평균: ${data.join(' + ')} ÷ ${data.length} = ${mean.toFixed(4)}
      분산: Σ(x - 평균)² ÷ ${calculationType === 'sample' ? 'n-1' : 'n'} = ${calculationType === 'sample' ? sampleVariance.toFixed(4) : variance.toFixed(4)}
      표준편차: √분산 = ${calculationType === 'sample' ? sampleStdDev.toFixed(4) : populationStdDev.toFixed(4)}
    `;
    setCalculationSteps(steps);
  };

  // 개별 데이터 추가
  const addDataPoint = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const newData = [...dataPoints, num];
      setDataPoints(newData);
      calculateStatistics(newData);
    }
  };

  // 데이터 삭제
  const removeDataPoint = (index: number) => {
    const newData = dataPoints.filter((_, i) => i !== index);
    setDataPoints(newData);
    if (newData.length > 0) {
      calculateStatistics(newData);
    } else {
      setResults({});
      setCalculationSteps("");
    }
  };

  // 데이터 초기화
  const clearData = () => {
    setDataPoints([]);
    setDataInput("");
    setResults({});
    setCalculationSteps("");
  };

  // 계산 타입 변경 시 재계산
  const handleCalculationTypeChange = (type: string) => {
    setCalculationType(type);
    if (dataPoints.length > 0) {
      calculateStatistics(dataPoints);
    }
  };

  // 클립보드에 복사
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">표준편차 계산기</h1>
            <p className="text-lg text-gray-600">데이터의 분산과 표준편차를 계산하는 통계 도구</p>
          </div>

          {/* 표준편차 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            
            {/* 계산 타입 선택 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">계산 타입 선택</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCalculationTypeChange("sample")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    calculationType === "sample"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  표본 표준편차 (n-1)
                </button>
                <button
                  onClick={() => handleCalculationTypeChange("population")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    calculationType === "population"
                      ? "bg-[#003366] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  모집단 표준편차 (n)
                </button>
              </div>
            </div>

            {/* 데이터 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">데이터 입력</h3>
              
              {/* 일괄 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  데이터 일괄 입력 (쉼표 또는 공백으로 구분)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="예: 1, 2, 3, 4, 5 또는 1 2 3 4 5"
                  />
                  <button
                    onClick={handleDataInput}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    입력
                  </button>
                </div>
              </div>

              {/* 개별 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  개별 데이터 추가
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="singleInput"
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#003366] focus:outline-none"
                    placeholder="숫자 입력"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addDataPoint(target.value);
                        target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('singleInput') as HTMLInputElement;
                      addDataPoint(input.value);
                      input.value = '';
                    }}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* 데이터 목록 */}
              {dataPoints.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">입력된 데이터 ({dataPoints.length}개)</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                    {dataPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
                      >
                        <span className="text-sm font-medium">{point}</span>
                        <button
                          onClick={() => removeDataPoint(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={clearData}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    모든 데이터 삭제
                  </button>
                </div>
              )}
            </div>

            {/* 계산 버튼 */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => dataPoints.length > 0 && calculateStatistics(dataPoints)}
                className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                disabled={dataPoints.length === 0}
              >
                계산하기
              </button>
              <button
                onClick={clearData}
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
                      <div className="text-sm text-gray-600 mb-1">데이터 개수</div>
                      <div className="text-2xl font-bold text-gray-800">{results.count}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">평균</div>
                      <div className="text-2xl font-bold text-gray-800">{results.mean}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">중앙값</div>
                      <div className="text-2xl font-bold text-gray-800">{results.median}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">범위</div>
                      <div className="text-2xl font-bold text-gray-800">{results.range}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">최소값</div>
                      <div className="text-2xl font-bold text-gray-800">{results.min}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">최대값</div>
                      <div className="text-2xl font-bold text-gray-800">{results.max}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        {calculationType === "sample" ? "표본" : "모집단"} 분산
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {calculationType === "sample" ? results.sampleVariance : results.populationVariance}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        {calculationType === "sample" ? "표본" : "모집단"} 표준편차
                      </div>
                      <div className="text-2xl font-bold text-gray-800">
                        {calculationType === "sample" ? results.sampleStdDev : results.populationStdDev}
                      </div>
                    </div>
                  </div>
                </div>

                {calculationSteps && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">계산 과정:</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{calculationSteps}</div>
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
                    setDataInput("1, 2, 3, 4, 5");
                    handleDataInput();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  1, 2, 3, 4, 5
                </button>
                <button
                  onClick={() => {
                    setDataInput("10, 20, 30, 40, 50");
                    handleDataInput();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  10, 20, 30, 40, 50
                </button>
                <button
                  onClick={() => {
                    setDataInput("2, 4, 6, 8, 10, 12");
                    handleDataInput();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  2, 4, 6, 8, 10, 12
                </button>
                <button
                  onClick={() => {
                    setDataInput("1, 3, 5, 7, 9, 11, 13");
                    handleDataInput();
                  }}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  1, 3, 5, 7, 9, 11, 13
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
          
          {/* 표준편차 계산기란? */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">표준편차 계산기란?</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-gray-700 leading-relaxed mb-4 text-center mx-auto max-w-3xl">
                표준편차 계산기는 데이터의 분산 정도를 측정하는 통계 도구입니다. 평균으로부터 
                각 데이터가 얼마나 떨어져 있는지를 수치로 나타내어 데이터의 분포를 분석할 수 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-center mx-auto max-w-3xl">
                표본 표준편차와 모 표준편차를 모두 계산할 수 있으며, 평균, 분산, 변동계수 등 
                관련 통계량도 함께 제공합니다.
              </p>
            </div>
          </section>

          {/* 표준편차 계산 방법 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">표준편차 계산 방법</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">표본 표준편차</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• n-1로 나누기 (자유도 고려)</li>
                  <li>• 표본에서 모집단 추정</li>
                  <li>• 연구에서 주로 사용</li>
                  <li>• 더 큰 값 도출</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">모집단 표준편차</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• n으로 나누기</li>
                  <li>• 전체 모집단 데이터</li>
                  <li>• 완전한 데이터셋</li>
                  <li>• 더 작은 값 도출</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">계산 공식</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 평균 = Σx ÷ n</li>
                  <li>• 분산 = Σ(x-평균)² ÷ n</li>
                  <li>• 표준편차 = √분산</li>
                  <li>• 표본: n-1로 나누기</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">해석 방법</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 작을수록 데이터 집중</li>
                  <li>• 클수록 데이터 분산</li>
                  <li>• 평균의 68% 규칙</li>
                  <li>• 정규분포 가정</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 사용 예시 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 예시</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">기본 예시</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>예시 1:</strong> 1, 2, 3, 4, 5 → 평균 3, 표준편차 1.58</p>
                <p><strong>예시 2:</strong> 10, 20, 30, 40, 50 → 평균 30, 표준편차 15.81</p>
                <p><strong>예시 3:</strong> 2, 4, 6, 8, 10, 12 → 평균 7, 표준편차 3.74</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">실제 활용</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>교육:</strong> 학생 성적 분포 분석</p>
                <p><strong>의학:</strong> 혈압, 체중 등 건강 지표</p>
                <p><strong>경제:</strong> 주가 변동성 측정</p>
                <p><strong>품질관리:</strong> 제품 품질 일관성</p>
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-4 mt-6">해석 가이드</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>작은 표준편차:</strong> 데이터가 평균에 집중 (일관성 높음)</p>
                <p><strong>큰 표준편차:</strong> 데이터가 넓게 분산 (변동성 높음)</p>
                <p><strong>68% 규칙:</strong> 평균 ± 1σ에 68% 데이터</p>
                <p><strong>95% 규칙:</strong> 평균 ± 2σ에 95% 데이터</p>
              </div>
            </div>
          </section>

          {/* 주의사항 */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">사용 시 주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📊 데이터 타입</h3>
                <p className="text-gray-600">연속형 수치 데이터에만 적용 가능합니다. 범주형 데이터에는 사용하지 마세요.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🔢 표본 vs 모집단</h3>
                <p className="text-gray-600">전체 데이터가 있으면 모집단, 일부만 있으면 표본 표준편차를 사용하세요.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 해석 주의</h3>
                <p className="text-gray-600">이상치(outlier)가 있으면 표준편차가 크게 영향을 받을 수 있습니다.</p>
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
              <a href="/fraction-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaDice className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">분수 계산기</h3>
                <p className="text-sm text-gray-600">분수 연산</p>
              </a>
              <a href="/percentage-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaList className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">백분율 계산기</h3>
                <p className="text-sm text-gray-600">백분율 계산</p>
              </a>
              <a href="/triangle-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCopy className="text-2xl text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">삼각형 계산기</h3>
                <p className="text-sm text-gray-600">기하학 계산</p>
              </a>
              <a href="/engineering-calculator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-red-300 cursor-pointer">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCalculator className="text-2xl text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">공학용 계산기</h3>
                <p className="text-sm text-gray-600">고급 수학 함수</p>
              </a>
              <a href="/random-number-generator" className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-yellow-300 cursor-pointer">
                <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaList className="text-2xl text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">난수 생성기</h3>
                <p className="text-sm text-gray-600">무작위 숫자 생성</p>
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