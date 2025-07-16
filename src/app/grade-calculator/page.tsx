"use client";

import { useState } from "react";
import { FaGraduationCap, FaCalculator, FaChartLine, FaPlus, FaMinus, FaTrophy, FaBullseye, FaHistory } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface Test {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  grade: string;
}

export default function GradeCalculator() {
  const [calculationType, setCalculationType] = useState("basic");
  const [tests, setTests] = useState<Test[]>([]);
  const [targetGrade, setTargetGrade] = useState("");
  const [remainingTests, setRemainingTests] = useState("");
  const [result, setResult] = useState<any>(null);

  // 한국 학교 성적 체계 (100점 만점 기준)
  const gradeSystem = {
    "A+": { min: 95, max: 100, color: "text-red-600" },
    "A": { min: 90, max: 94, color: "text-red-500" },
    "B+": { min: 85, max: 89, color: "text-orange-600" },
    "B": { min: 80, max: 84, color: "text-orange-500" },
    "C+": { min: 75, max: 79, color: "text-yellow-600" },
    "C": { min: 70, max: 74, color: "text-yellow-500" },
    "D+": { min: 65, max: 69, color: "text-green-600" },
    "D": { min: 60, max: 64, color: "text-green-500" },
    "F": { min: 0, max: 59, color: "text-gray-600" }
  };

  const getGradeFromScore = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    for (const [grade, range] of Object.entries(gradeSystem)) {
      if (percentage >= range.min && percentage <= range.max) {
        return grade;
      }
    }
    return "F";
  };

  const addTest = () => {
    const newTest: Test = {
      id: Date.now(),
      name: "",
      score: 0,
      maxScore: 100,
      weight: 1,
      grade: "F"
    };
    setTests([...tests, newTest]);
  };

  const removeTest = (id: number) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const updateTest = (id: number, field: keyof Test, value: string | number) => {
    setTests(tests.map(test => {
      if (test.id === id) {
        const updatedTest = { ...test, [field]: value };
        if (field === 'score' || field === 'maxScore') {
          updatedTest.grade = getGradeFromScore(updatedTest.score, updatedTest.maxScore);
        }
        return updatedTest;
      }
      return test;
    }));
  };

  const calculateGrades = () => {
    if (tests.length === 0) {
      alert("시험을 추가해주세요.");
      return;
    }

    const validTests = tests.filter(test => test.name && test.score >= 0);
    
    if (validTests.length === 0) {
      alert("시험명과 점수를 입력해주세요.");
      return;
    }

    // 가중 평균 계산
    const totalWeight = validTests.reduce((sum, test) => sum + test.weight, 0);
    const weightedSum = validTests.reduce((sum, test) => {
      const percentage = (test.score / test.maxScore) * 100;
      return sum + (percentage * test.weight);
    }, 0);
    const averageScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const averageGrade = getGradeFromScore(averageScore);

    // 성적 분포 계산
    const gradeDistribution = validTests.reduce((acc, test) => {
      acc[test.grade] = (acc[test.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 성적 향상도 계산 (이전 성적과 비교)
    const sortedTests = [...validTests].sort((a, b) => a.id - b.id);
    const improvement = sortedTests.length > 1 ? 
      sortedTests[sortedTests.length - 1].score - sortedTests[0].score : 0;

    setResult({
      type: "basic",
      averageScore: averageScore.toFixed(1),
      averageGrade,
      totalTests: validTests.length,
      gradeDistribution,
      improvement,
      tests: validTests
    });
  };

  const calculateTargetGrade = () => {
    if (!targetGrade || !remainingTests) {
      alert("목표 등급과 남은 시험 수를 입력해주세요.");
      return;
    }

    const target = targetGrade;
    const remaining = parseInt(remainingTests);
    const currentAverage = parseFloat(result?.averageScore || "0");
    const currentTests = result?.totalTests || 0;

    if (isNaN(remaining) || remaining <= 0) {
      alert("올바른 값을 입력해주세요.");
      return;
    }

    const totalTests = currentTests + remaining;
    const targetMinScore = gradeSystem[target as keyof typeof gradeSystem]?.min || 0;
    const requiredTotalScore = targetMinScore * totalTests;
    const currentTotalScore = currentAverage * currentTests;
    const requiredRemainingScore = requiredTotalScore - currentTotalScore;
    const requiredAverage = requiredRemainingScore / remaining;

    let achievable = true;
    let message = "";
    
    if (requiredAverage > 100) {
      achievable = false;
      message = "목표 등급 달성이 불가능합니다. 목표를 낮추거나 더 많은 시험을 치러야 합니다.";
    } else if (requiredAverage < 0) {
      achievable = false;
      message = "현재 평균이 목표보다 높습니다.";
    } else {
      message = `남은 ${remaining}개 시험에서 평균 ${requiredAverage.toFixed(1)}점 이상이 필요합니다.`;
    }

    setResult({
      type: "target",
      currentAverage: currentAverage.toFixed(1),
      targetGrade: target,
      requiredAverage: requiredAverage.toFixed(1),
      remainingTests: remaining,
      achievable,
      message
    });
  };

  const resetCalculator = () => {
    setTests([]);
    setTargetGrade("");
    setRemainingTests("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaGraduationCap className="text-4xl text-blue-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">성적계산기</h1>
            </div>
            <p className="text-lg text-gray-600">시험 점수 등급 변환 및 평균 성적 계산</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCalculationType("basic")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "basic"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaCalculator className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">기본 성적 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("target")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "target"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <FaBullseye className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">목표 등급 계산</span>
              </button>
            </div>
          </div>

          {/* 기본 성적 계산 */}
          {calculationType === "basic" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">시험 입력</h3>
                <button
                  onClick={addTest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" />
                  시험 추가
                </button>
              </div>

              {tests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaCalculator className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>시험을 추가해주세요.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tests.map((test, index) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">시험 {index + 1}</h4>
                        <button
                          onClick={() => removeTest(test.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaMinus />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">시험명</label>
                          <input
                            type="text"
                            value={test.name}
                            onChange={(e) => updateTest(test.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="예: 중간고사"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">점수</label>
                          <input
                            type="number"
                            value={test.score}
                            onChange={(e) => updateTest(test.id, 'score', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max={test.maxScore}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">만점</label>
                          <input
                            type="number"
                            value={test.maxScore}
                            onChange={(e) => updateTest(test.id, 'maxScore', parseFloat(e.target.value) || 100)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">가중치</label>
                          <input
                            type="number"
                            value={test.weight}
                            onChange={(e) => updateTest(test.id, 'weight', parseFloat(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0.1"
                            step="0.1"
                          />
                        </div>
                      </div>
                      
                      {test.name && test.score > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">등급:</span>
                            <span className={`font-semibold ${gradeSystem[test.grade as keyof typeof gradeSystem]?.color}`}>
                              {test.grade} ({(test.score / test.maxScore * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={calculateGrades}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
                >
                  <FaCalculator className="mr-2" />
                  성적 계산하기
                </button>
              </div>
            </div>
          )}

          {/* 목표 등급 계산 */}
          {calculationType === "target" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">목표 등급 달성 계획</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">목표 등급</label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">등급 선택</option>
                    {Object.keys(gradeSystem).map(grade => (
                      <option key={grade} value={grade}>
                        {grade} ({gradeSystem[grade as keyof typeof gradeSystem].min}점 이상)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">남은 시험 수</label>
                  <input
                    type="number"
                    value={remainingTests}
                    onChange={(e) => setRemainingTests(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    placeholder="예: 3"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={calculateTargetGrade}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
                >
                                          <FaBullseye className="mr-2" />
                  목표 등급 계산하기
                </button>
              </div>
            </div>
          )}

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">계산 결과</h3>
              
              {result.type === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.averageScore}점</div>
                      <div className="text-sm text-gray-600">평균 점수</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className={`text-2xl font-bold ${gradeSystem[result.averageGrade as keyof typeof gradeSystem]?.color}`}>
                        {result.averageGrade}
                      </div>
                      <div className="text-sm text-gray-600">평균 등급</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.totalTests}개</div>
                      <div className="text-sm text-gray-600">시험 수</div>
                    </div>
                  </div>

                  {result.improvement !== 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-center">
                        <FaHistory className="text-yellow-600 mr-2" />
                        <span className="font-semibold text-yellow-800">
                          성적 변화: {result.improvement > 0 ? '+' : ''}{result.improvement.toFixed(1)}점
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">등급별 분포</h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {Object.entries(result.gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="text-center p-2 bg-gray-50 rounded">
                          <div className={`font-bold ${gradeSystem[grade as keyof typeof gradeSystem]?.color}`}>
                            {grade}
                          </div>
                          <div className="text-sm text-gray-600">{count}개</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">시험별 상세</h4>
                    <div className="space-y-2">
                      {result.tests.map((test: Test, index: number) => (
                        <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="font-medium">{test.name}</span>
                          <div className="flex items-center space-x-4">
                            <span>{test.score}/{test.maxScore}점</span>
                            <span className={`font-semibold ${gradeSystem[test.grade as keyof typeof gradeSystem]?.color}`}>
                              {test.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {result.type === "target" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-blue-600">{result.currentAverage}점</div>
                      <div className="text-sm text-gray-600">현재 평균</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-600">{result.targetGrade}</div>
                      <div className="text-sm text-gray-600">목표 등급</div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${result.achievable ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-center mb-2">
                      {result.achievable ? (
                        <FaTrophy className="text-green-600 mr-2" />
                      ) : (
                        <FaBullseye className="text-red-600 mr-2" />
                      )}
                      <span className={`font-semibold ${result.achievable ? 'text-green-800' : 'text-red-800'}`}>
                        {result.achievable ? '목표 달성 가능' : '목표 달성 불가능'}
                      </span>
                    </div>
                    <p className="text-center text-sm text-gray-600">{result.message}</p>
                  </div>

                  {result.achievable && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold text-yellow-600">{result.requiredAverage}점</div>
                        <div className="text-sm text-gray-600">남은 시험에서 필요한 평균 점수</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법 안내</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>기본 성적 계산:</strong> 여러 시험의 점수를 입력하여 평균 점수와 등급을 계산합니다.</p>
              <p>• <strong>목표 등급 계산:</strong> 원하는 등급을 달성하기 위해 남은 시험에서 필요한 점수를 계산합니다.</p>
              <p>• <strong>가중치:</strong> 중요한 시험에 더 높은 가중치를 설정할 수 있습니다.</p>
              <p>• <strong>등급 체계:</strong> A+ (95-100점), A (90-94점), B+ (85-89점), B (80-84점), C+ (75-79점), C (70-74점), D+ (65-69점), D (60-64점), F (0-59점)</p>
            </div>
          </div>

          {/* 관련 계산기 링크 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/gpa-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">GPA 계산기</h4>
                <p className="text-xs text-gray-600">대학 성적 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">백분율 계산</p>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </a>
              
              <a href="/standard-deviation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">표준편차 계산기</h4>
                <p className="text-xs text-gray-600">통계 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 