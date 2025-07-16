"use client";

import { useState } from "react";
import { FaCalendarAlt, FaPlus, FaMinus, FaClock, FaCalculator, FaBirthdayCake, FaHeart, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import Header from '../../components/ui/Header';

export default function DateCalculator() {
  const [calculationType, setCalculationType] = useState("difference");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysToAdd, setDaysToAdd] = useState("");
  const [result, setResult] = useState<any>(null);

  const calculateDateDifference = () => {
    if (!date1 || !date2) {
      alert("두 날짜를 모두 입력해주세요.");
      return;
    }

    const startDate = new Date(date1);
    const endDate = new Date(date2);
    
    if (startDate > endDate) {
      alert("시작 날짜가 종료 날짜보다 늦을 수 없습니다.");
      return;
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // 년, 월, 일 계산
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // 평일 계산 (주말 제외)
    let weekdays = 0;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0=일요일, 6=토요일
        weekdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 주말 계산
    const weekends = daysDiff - weekdays;

    setResult({
      type: "difference",
      totalDays: daysDiff,
      years,
      months,
      days,
      weekdays,
      weekends,
      startDate: startDate.toLocaleDateString('ko-KR'),
      endDate: endDate.toLocaleDateString('ko-KR')
    });
  };

  const calculateDateAddSubtract = () => {
    if (!baseDate || !daysToAdd) {
      alert("기준 날짜와 일수를 입력해주세요.");
      return;
    }

    const base = new Date(baseDate);
    const days = parseInt(daysToAdd);
    
    if (isNaN(days)) {
      alert("올바른 일수를 입력해주세요.");
      return;
    }

    const resultDate = new Date(base);
    resultDate.setDate(base.getDate() + days);

    setResult({
      type: "addSubtract",
      baseDate: base.toLocaleDateString('ko-KR'),
      daysAdded: days,
      resultDate: resultDate.toLocaleDateString('ko-KR'),
      dayOfWeek: resultDate.toLocaleDateString('ko-KR', { weekday: 'long' })
    });
  };

  const calculateSpecialDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // 다음 생일까지 (예시: 1990년 5월 15일)
    const birthday = new Date(currentYear, 4, 15); // 5월 15일
    if (birthday < today) {
      birthday.setFullYear(currentYear + 1);
    }
    const daysUntilBirthday = Math.ceil((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // 결혼기념일 (예시: 2020년 6월 20일)
    const weddingDate = new Date(2020, 5, 20);
    const marriageDays = Math.floor((today.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24));

    // 입사일 (예시: 2018년 3월 1일)
    const hireDate = new Date(2018, 2, 1);
    const workDays = Math.floor((today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));

    // 졸업일 (예시: 2015년 2월 28일)
    const graduationDate = new Date(2015, 1, 28);
    const graduationDays = Math.floor((today.getTime() - graduationDate.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      type: "special",
      daysUntilBirthday,
      marriageDays,
      workDays,
      graduationDays,
      today: today.toLocaleDateString('ko-KR')
    });
  };

  const resetCalculator = () => {
    setDate1("");
    setDate2("");
    setBaseDate(new Date().toISOString().split('T')[0]);
    setDaysToAdd("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaCalendarAlt className="text-4xl text-blue-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">날짜 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">날짜 차이, 날짜 더하기/빼기, 특별한 날짜 계산</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setCalculationType("difference")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "difference"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaMinus className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">날짜 차이 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("addSubtract")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "addSubtract"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <FaPlus className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">날짜 더하기/빼기</span>
              </button>
              
              <button
                onClick={() => setCalculationType("special")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "special"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <FaHeart className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">특별한 날짜</span>
              </button>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {calculationType === "difference" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">날짜 차이 계산</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-blue-500" />
                      시작 날짜
                    </label>
                    <input
                      type="date"
                      value={date1}
                      onChange={(e) => setDate1(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-green-500" />
                      종료 날짜
                    </label>
                    <input
                      type="date"
                      value={date2}
                      onChange={(e) => setDate2(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {calculationType === "addSubtract" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">날짜 더하기/빼기</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-blue-500" />
                      기준 날짜
                    </label>
                    <input
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaPlus className="inline mr-2 text-green-500" />
                      더할/뺄 일수
                    </label>
                    <input
                      type="number"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(e.target.value)}
                      placeholder="예: 100 또는 -30"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {calculationType === "special" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">특별한 날짜 계산</h3>
                <p className="text-gray-600 mb-4">오늘 기준으로 특별한 날짜들을 계산합니다.</p>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={
                  calculationType === "difference" ? calculateDateDifference :
                  calculationType === "addSubtract" ? calculateDateAddSubtract :
                  calculateSpecialDates
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">계산 결과</h2>
              
              {result.type === "difference" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">총 기간</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">총 일수:</span>
                        <span className="font-bold text-blue-600 text-xl">{result.totalDays}일</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">년:</span>
                        <span className="font-bold text-blue-600">{result.years}년</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">월:</span>
                        <span className="font-bold text-blue-600">{result.months}개월</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">일:</span>
                        <span className="font-bold text-blue-600">{result.days}일</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaClock className="text-2xl text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">평일/주말</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">평일:</span>
                        <span className="font-bold text-green-600">{result.weekdays}일</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">주말:</span>
                        <span className="font-bold text-green-600">{result.weekends}일</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="text-2xl text-purple-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">날짜 정보</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">시작:</span>
                        <span className="font-bold text-purple-600 ml-2">{result.startDate}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">종료:</span>
                        <span className="font-bold text-purple-600 ml-2">{result.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === "addSubtract" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">계산 정보</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">기준 날짜:</span>
                        <span className="font-bold text-blue-600">{result.baseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">더한 일수:</span>
                        <span className="font-bold text-blue-600">{result.daysAdded}일</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaPlus className="text-2xl text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">결과</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">결과 날짜:</span>
                        <span className="font-bold text-green-600 text-xl">{result.resultDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">요일:</span>
                        <span className="font-bold text-green-600">{result.dayOfWeek}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === "special" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                    <div className="flex items-center mb-3">
                      <FaBirthdayCake className="text-2xl text-pink-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">생일</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{result.daysUntilBirthday}</div>
                      <div className="text-sm text-gray-600">일 후</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                    <div className="flex items-center mb-3">
                      <FaHeart className="text-2xl text-red-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">결혼기념일</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{result.marriageDays}</div>
                      <div className="text-sm text-gray-600">일째</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaBriefcase className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">입사일</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.workDays}</div>
                      <div className="text-sm text-gray-600">일째</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaGraduationCap className="text-2xl text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">졸업일</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.graduationDays}</div>
                      <div className="text-sm text-gray-600">일째</div>
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
              <p>• <strong>날짜 차이 계산:</strong> 두 날짜 사이의 정확한 기간을 계산합니다</p>
              <p>• <strong>날짜 더하기/빼기:</strong> 특정 날짜에 일정 기간을 더하거나 뺍니다</p>
              <p>• <strong>특별한 날짜:</strong> 생일, 결혼기념일, 입사일 등 특별한 날짜를 계산합니다</p>
              <p>• <strong>평일/주말 구분:</strong> 주말을 제외한 평일만 계산할 수 있습니다</p>
              <p>• <strong>윤년 고려:</strong> 윤년을 자동으로 고려하여 정확한 계산을 제공합니다</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/age-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaBirthdayCake className="text-xl text-pink-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">나이 계산기</h4>
              </a>
              
              <a href="/due-date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">예정일 계산기</h4>
              </a>
              
              <a href="/pregnancy-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-red-300 cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임신 계산기</h4>
              </a>
              
              <a href="/pregnancy-adjustment-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임신 수정 계산기</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 