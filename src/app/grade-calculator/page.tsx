"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaGraduationCap, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface GradeResult {
  totalScore: number;
  averageScore: number;
  grade: string;
  gradePoint: number;
  courses: Array<{
    name: string;
    score: number;
    grade: string;
    gradePoint: number;
  }>;
}

export default function GradeCalculator() {
  const [courses, setCourses] = useState<Array<{ name: string; score: number }>>([
    { name: "", score: 0 }
  ]);
  const [result, setResult] = useState<GradeResult | null>(null);

  const gradeSystem: { [key: string]: { min: number; max: number; grade: string; point: number } } = {
    "A+": { min: 95, max: 100, grade: "A+", point: 4.5 },
    "A": { min: 90, max: 94, grade: "A", point: 4.0 },
    "B+": { min: 85, max: 89, grade: "B+", point: 3.5 },
    "B": { min: 80, max: 84, grade: "B", point: 3.0 },
    "C+": { min: 75, max: 79, grade: "C+", point: 2.5 },
    "C": { min: 70, max: 74, grade: "C", point: 2.0 },
    "D+": { min: 65, max: 69, grade: "D+", point: 1.5 },
    "D": { min: 60, max: 64, grade: "D", point: 1.0 },
    "F": { min: 0, max: 59, grade: "F", point: 0.0 }
  };

  const getGrade = (score: number) => {
    for (const gradeInfo of Object.values(gradeSystem)) {
      if (score >= gradeInfo.min && score <= gradeInfo.max) {
        return gradeInfo;
      }
    }
    return gradeSystem["F"];
  };

  const addCourse = () => {
    setCourses([...courses, { name: "", score: 0 }]);
  };

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index: number, field: "name" | "score", value: string | number) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const calculateGrade = () => {
    const validCourses = courses.filter(course => course.name && course.score > 0);
    
    if (validCourses.length === 0) {
      alert("과목명과 점수를 입력해주세요.");
      return;
    }

    const courseResults = validCourses.map(course => {
      const gradeInfo = getGrade(course.score);
      return {
        name: course.name,
        score: course.score,
        grade: gradeInfo.grade,
        gradePoint: gradeInfo.point
      };
    });

    const totalScore = courseResults.reduce((sum, course) => sum + course.score, 0);
    const averageScore = totalScore / courseResults.length;
    const averageGradeInfo = getGrade(averageScore);
    const totalGradePoints = courseResults.reduce((sum, course) => sum + course.gradePoint, 0);
    const averageGradePoint = totalGradePoints / courseResults.length;

    setResult({
      totalScore,
      averageScore,
      grade: averageGradeInfo.grade,
      gradePoint: averageGradePoint,
      courses: courseResults
    });
  };

  const resetCalculator = () => {
    setCourses([{ name: "", score: 0 }]);
    setResult(null);
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("A")) return "text-green-600";
    if (grade.includes("B")) return "text-blue-600";
    if (grade.includes("C")) return "text-yellow-600";
    if (grade.includes("D")) return "text-orange-600";
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
              <h1 className="text-4xl font-bold text-gray-800">성적 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">점수를 성적으로 변환하고 평균을 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">과목 정보 입력</h3>
            
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      과목명
                    </label>
                    <input
                      type="text"
                      value={course.name}
                      onChange={(e) => updateCourse(index, "name", e.target.value)}
                      placeholder="예: 수학"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                      style={{ color: '#000000 !important' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      점수 (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={course.score}
                      onChange={(e) => updateCourse(index, "score", parseFloat(e.target.value) || 0)}
                      placeholder="85"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                      style={{ color: '#000000 !important' }}
                    />
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
                  onClick={calculateGrade}
                  className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  style={{ backgroundColor: '#003366' }}
                >
                  <FaCalculator className="mr-2" />
                  성적 계산하기
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총점</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalScore}점
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">평균점수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.averageScore.toFixed(1)}점
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">평균 성적</h4>
                  </div>
                  <div className={`text-2xl font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaGraduationCap className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">평균 평점</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.gradePoint.toFixed(2)}
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
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">점수</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">성적</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">평점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.courses.map((course, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">{course.name}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{course.score}점</td>
                          <td className={`border border-gray-200 px-4 py-2 text-center font-semibold ${getGradeColor(course.grade)}`}>
                            {course.grade}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{course.gradePoint}</td>
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
              <h2 className="text-xl font-bold text-gray-800">성적 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">성적 기준</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>A+ (4.5):</strong> 95-100점</div>
                  <div>• <strong>A (4.0):</strong> 90-94점</div>
                  <div>• <strong>B+ (3.5):</strong> 85-89점</div>
                  <div>• <strong>B (3.0):</strong> 80-84점</div>
                  <div>• <strong>C+ (2.5):</strong> 75-79점</div>
                  <div>• <strong>C (2.0):</strong> 70-74점</div>
                  <div>• <strong>D+ (1.5):</strong> 65-69점</div>
                  <div>• <strong>D (1.0):</strong> 60-64점</div>
                  <div>• <strong>F (0.0):</strong> 0-59점</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>평균점수:</strong> 모든 과목 점수의 평균</div>
                  <div>• <strong>평균 성적:</strong> 평균점수에 따른 성적 등급</div>
                  <div>• <strong>평균 평점:</strong> 모든 과목 평점의 평균</div>
                  <div>• <strong>자동 변환:</strong> 점수를 성적으로 자동 변환</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/gpa-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGraduationCap className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">GPA 계산기</h4>
                <p className="text-xs text-gray-600">GPA 계산</p>
              </Link>
              
              <Link href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">백분율 계산</p>
              </Link>
              
              <Link href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </Link>
              
              <Link href="/standard-deviation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">표준편차 계산기</h4>
                <p className="text-xs text-gray-600">통계 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
