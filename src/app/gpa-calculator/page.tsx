"use client";

import { useState } from "react";
import { FaCalculator, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface Course {
  name: string;
  credits: number;
  grade: string;
}

interface GPAResult {
  totalCredits: number;
  totalGradePoints: number;
  gpa: number;
  courses: Course[];
}

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: "", credits: 0, grade: "A" }
  ]);
  const [result, setResult] = useState<GPAResult | null>(null);

  const gradePoints: { [key: string]: number } = {
    "A+": 4.5,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0.0
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", credits: 0, grade: "A" }]);
  };

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      if (course.name && course.credits > 0) {
        totalCredits += course.credits;
        totalGradePoints += course.credits * gradePoints[course.grade];
      }
    });

    if (totalCredits === 0) {
      alert("과목명과 학점을 입력해주세요.");
      return;
    }

    const gpa = totalGradePoints / totalCredits;

    setResult({
      totalCredits,
      totalGradePoints,
      gpa,
      courses: courses.filter(course => course.name && course.credits > 0)
    });
  };

  const resetCalculator = () => {
    setCourses([{ name: "", credits: 0, grade: "A" }]);
    setResult(null);
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 4.0) return "text-green-600";
    if (gpa >= 3.0) return "text-blue-600";
    if (gpa >= 2.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaGraduationCap className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">GPA 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">학점평점(Grade Point Average)을 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">과목 정보 입력</h3>
            
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      과목명
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(index, "name", e.target.value)}
                      placeholder="예: 수학"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      학점
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={course.credits}
                      onChange={(e) => updateCourse(index, "credits", parseFloat(e.target.value) || 0)}
                      placeholder="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      성적
                    </label>
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(index, "grade", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    >
                      <option value="A+">A+ (4.5)</option>
                      <option value="A">A (4.0)</option>
                      <option value="A-">A- (3.7)</option>
                      <option value="B+">B+ (3.3)</option>
                      <option value="B">B (3.0)</option>
                      <option value="B-">B- (2.7)</option>
                      <option value="C+">C+ (2.3)</option>
                      <option value="C">C (2.0)</option>
                      <option value="C-">C- (1.7)</option>
                      <option value="D+">D+ (1.3)</option>
                      <option value="D">D (1.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => removeCourse(index)}
                      className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={addCourse}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  과목 추가
                </button>
                
                <button
                  onClick={calculateGPA}
                  className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  style={{ backgroundColor: '#003366' }}
                >
                  <FaCalculator className="mr-2" />
                  GPA 계산하기
                </button>
                
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>

          {/* 계산 결과 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 학점</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalCredits}학점
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 평점</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalGradePoints.toFixed(1)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">GPA</h4>
                  </div>
                  <div className={`text-2xl font-bold ${getGPAColor(result.gpa)}`}>
                    {result.gpa.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* 과목별 상세 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">과목별 상세</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">과목명</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">학점</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">성적</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">평점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.courses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">{course.name}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{course.credits}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{course.grade}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{gradePoints[course.grade]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">GPA 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>GPA 공식:</strong> (학점 × 평점의 합) ÷ 총 학점</div>
                  <div>• <strong>평점 기준:</strong> A+ (4.5) ~ F (0.0)</div>
                  <div>• <strong>학점 입력:</strong> 0.5 단위로 입력 가능</div>
                  <div>• <strong>자동 계산:</strong> 실시간으로 GPA 업데이트</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">평점 기준표</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>A+ (4.5):</strong> 95점 이상</div>
                  <div>• <strong>A (4.0):</strong> 90-94점</div>
                  <div>• <strong>B+ (3.3):</strong> 85-89점</div>
                  <div>• <strong>B (3.0):</strong> 80-84점</div>
                  <div>• <strong>C (2.0):</strong> 70-79점</div>
                  <div>• <strong>F (0.0):</strong> 60점 미만</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/grade-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">성적 계산기</h4>
                <p className="text-xs text-gray-600">성적 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">백분율 계산</p>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </a>
              
              <a href="/standard-deviation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">표준편차 계산기</h4>
                <p className="text-xs text-gray-600">통계 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 