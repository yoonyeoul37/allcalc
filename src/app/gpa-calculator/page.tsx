"use client";

import { useState } from "react";
import { FaGraduationCap, FaCalculator, FaBullseye, FaChartLine, FaPlus, FaMinus, FaTrophy } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
  gpa: number;
}

export default function GPACalculator() {
  const [calculationType, setCalculationType] = useState("basic");
  const [courses, setCourses] = useState<Course[]>([]);
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [result, setResult] = useState<any>(null);

  // 한국 대학 성적 체계 (4.5 만점)
  const gradeSystem = {
    "A+": 4.5, "A": 4.0, "B+": 3.5, "B": 3.0, "C+": 2.5, "C": 2.0, "D+": 1.5, "D": 1.0, "F": 0.0
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      name: "",
      credits: 0,
      grade: "A+",
      gpa: 4.5
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        const updatedCourse = { ...course, [field]: value };
        if (field === 'grade') {
          updatedCourse.gpa = gradeSystem[value as keyof typeof gradeSystem] || 0;
        }
        return updatedCourse;
      }
      return course;
    }));
  };

  const calculateGPA = () => {
    if (courses.length === 0) {
      alert("과목을 추가해주세요.");
      return;
    }

    const validCourses = courses.filter(course => course.name && course.credits > 0);
    
    if (validCourses.length === 0) {
      alert("과목명과 학점을 입력해주세요.");
      return;
    }

    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalWeightedGPA = validCourses.reduce((sum, course) => sum + (course.gpa * course.credits), 0);
    const gpa = totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;

    // 성적 분포 계산
    const gradeDistribution = validCourses.reduce((acc, course) => {
      acc[course.grade] = (acc[course.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setResult({
      type: "basic",
      gpa: gpa.toFixed(2),
      totalCredits,
      totalCourses: validCourses.length,
      gradeDistribution,
      courses: validCourses
    });
  };

  const calculateTargetGPA = () => {
    if (!targetGPA || !remainingCredits) {
      alert("목표 GPA와 남은 학점을 입력해주세요.");
      return;
    }

    const target = parseFloat(targetGPA);
    const remaining = parseInt(remainingCredits);
    const currentGPA = parseFloat(result?.gpa || "0");
    const currentCredits = result?.totalCredits || 0;

    if (isNaN(target) || isNaN(remaining) || remaining <= 0) {
      alert("올바른 값을 입력해주세요.");
      return;
    }

    const totalCredits = currentCredits + remaining;
    const requiredTotalGPA = target * totalCredits;
    const currentTotalGPA = currentGPA * currentCredits;
    const requiredRemainingGPA = requiredTotalGPA - currentTotalGPA;
    const requiredGPA = requiredRemainingGPA / remaining;

    let achievable = true;
    let message = "";
    
    if (requiredGPA > 4.5) {
      achievable = false;
      message = "목표 GPA 달성이 불가능합니다. 목표를 낮추거나 더 많은 학점을 이수해야 합니다.";
    } else if (requiredGPA < 0) {
      achievable = false;
      message = "현재 GPA가 목표보다 높습니다.";
    } else {
      const requiredGrade = Object.entries(gradeSystem).find(([_, gpa]) => gpa >= requiredGPA);
      message = `남은 ${remaining}학점에서 평균 ${requiredGPA.toFixed(2)} 이상의 GPA가 필요합니다.`;
    }

    setResult({
      type: "target",
      currentGPA: currentGPA.toFixed(2),
      targetGPA: target.toFixed(2),
      requiredGPA: requiredGPA.toFixed(2),
      remainingCredits: remaining,
      achievable,
      message
    });
  };

  const resetCalculator = () => {
    setCourses([]);
    setTargetGPA("");
    setRemainingCredits("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaGraduationCap className="text-4xl text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">GPA 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">한국 대학 4.5 만점 기준 GPA 계산</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCalculationType("basic")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "basic"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <FaCalculator className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">기본 GPA 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("target")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "target"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaBullseye className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">목표 GPA 계산</span>
              </button>
            </div>
          </div>

          {/* 기본 GPA 계산 */}
          {calculationType === "basic" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">과목 입력</h3>
                <button
                  onClick={addCourse}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaPlus className="mr-2" />
                  과목 추가
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaGraduationCap className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>과목을 추가하여 GPA를 계산해보세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={course.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">과목명</label>
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                          placeholder="예: 수학"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">학점</label>
                        <input
                          type="number"
                          value={course.credits || ""}
                          onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                          min="1"
                          max="6"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">성적</label>
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                        >
                          {Object.keys(gradeSystem).map(grade => (
                            <option key={grade} value={grade}>
                              {grade} ({gradeSystem[grade as keyof typeof gradeSystem]})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={calculateGPA}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaCalculator className="mr-2" />
                  GPA 계산하기
                </button>
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  초기화
                </button>
              </div>
            </div>
          )}

          {/* 목표 GPA 계산 */}
          {calculationType === "target" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">목표 GPA 계산</h3>
              
              {!result || result.type !== "basic" ? (
                <div className="text-center py-8 text-gray-500">
                  <FaBullseye className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>먼저 기본 GPA를 계산한 후 목표 GPA를 설정해주세요</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">목표 GPA</label>
                    <input
                      type="number"
                      value={targetGPA}
                      onChange={(e) => setTargetGPA(e.target.value)}
                      step="0.01"
                      min="0"
                      max="4.5"
                      placeholder="예: 3.5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">남은 학점</label>
                    <input
                      type="number"
                      value={remainingCredits}
                      onChange={(e) => setRemainingCredits(e.target.value)}
                      min="1"
                      placeholder="예: 30"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={calculateTargetGPA}
                  disabled={!result || result.type !== "basic"}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <FaBullseye className="mr-2" />
                  목표 계산하기
                </button>
              </div>
            </div>
          )}

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">계산 결과</h2>
              
              {result.type === "basic" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-3">
                      <FaTrophy className="text-2xl text-purple-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">GPA 결과</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">총 GPA:</span>
                        <span className="font-bold text-purple-600 text-2xl">{result.gpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">총 학점:</span>
                        <span className="font-bold text-purple-600">{result.totalCredits}학점</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">과목 수:</span>
                        <span className="font-bold text-purple-600">{result.totalCourses}과목</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaChartLine className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">성적 분포</h3>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(result.gradeDistribution).map(([grade, count]) => (
                        <div key={grade} className="flex justify-between">
                          <span className="text-gray-600">{grade}:</span>
                          <span className="font-bold text-blue-600">{count}과목</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {result.type === "target" && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                                         <FaBullseye className="text-2xl text-blue-500 mr-3" />
                     <h3 className="text-lg font-semibold text-gray-800">목표 GPA 분석</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">현재 GPA:</span>
                      <span className="font-bold text-blue-600">{result.currentGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">목표 GPA:</span>
                      <span className="font-bold text-blue-600">{result.targetGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">필요한 GPA:</span>
                      <span className="font-bold text-blue-600">{result.requiredGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">남은 학점:</span>
                      <span className="font-bold text-blue-600">{result.remainingCredits}학점</span>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-700">{result.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>기본 GPA 계산:</strong> 과목명, 학점, 성적을 입력하여 평균 GPA를 계산합니다</p>
              <p>• <strong>목표 GPA 계산:</strong> 원하는 GPA 달성에 필요한 성적을 계산합니다</p>
              <p>• <strong>4.5 만점 기준:</strong> 한국 대학의 표준 성적 체계를 사용합니다</p>
              <p>• <strong>가중 평균:</strong> 학점 수에 따른 가중치를 적용하여 정확한 GPA를 계산합니다</p>
              <p>• <strong>성적 분포:</strong> 각 성적별 과목 수를 확인할 수 있습니다</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
              </a>
              
              <a href="/standard-deviation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">표준편차 계산기</h4>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
              </a>
              
              <a href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 