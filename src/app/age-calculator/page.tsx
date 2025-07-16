"use client";

import { useState } from "react";
import { FaBirthdayCake, FaCalendarAlt, FaClock, FaHeart, FaCalculator } from "react-icons/fa";
import Header from '../../components/ui/Header';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert("생년월일을 입력해주세요.");
      return;
    }

    const birth = new Date(birthDate);
    const current = new Date(currentDate);
    
    // 만 나이 계산 (한국식)
    let koreanAge = current.getFullYear() - birth.getFullYear();
    const monthDiff = current.getMonth() - birth.getMonth();
    const dayDiff = current.getDate() - birth.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      koreanAge--;
    }

    // 세는 나이 계산 (한국식)
    const countingAge = koreanAge + 1;

    // 정확한 나이 계산 (년, 월, 일)
    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // 다음 생일까지 남은 일수 계산
    const nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < current) {
      nextBirthday.setFullYear(current.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    // 지금까지 살아온 일수
    const daysLived = Math.floor((current.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // 윤년 계산
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const leapYears = Array.from({ length: current.getFullYear() - birth.getFullYear() + 1 }, (_, i) => birth.getFullYear() + i)
      .filter(year => isLeapYear(year)).length;

    setResult({
      koreanAge,
      countingAge,
      years,
      months,
      days,
      daysUntilBirthday,
      daysLived,
      leapYears,
      birthDate: birth.toLocaleDateString('ko-KR'),
      currentDate: current.toLocaleDateString('ko-KR')
    });
  };

  const resetCalculator = () => {
    setBirthDate("");
    setCurrentDate(new Date().toISOString().split('T')[0]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaBirthdayCake className="text-4xl text-pink-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">나이 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">한국 기준으로 정확한 나이를 계산해보세요</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-blue-500" />
                  생년월일
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={currentDate}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-green-500" />
                  기준 날짜
                </label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={birthDate}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateAge}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaCalculator className="mr-2" />
                나이 계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">계산 결과</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 한국식 나이 */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200">
                  <div className="flex items-center mb-3">
                    <FaHeart className="text-2xl text-pink-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">한국식 나이</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">만 나이:</span>
                      <span className="font-bold text-pink-600 text-xl">{result.koreanAge}세</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">세는 나이:</span>
                      <span className="font-bold text-pink-600 text-xl">{result.countingAge}세</span>
                    </div>
                  </div>
                </div>

                {/* 정확한 나이 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FaBirthdayCake className="text-2xl text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">정확한 나이</h3>
                  </div>
                  <div className="space-y-2">
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

                {/* 생일 정보 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-green-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-800">생일 정보</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">다음 생일까지:</span>
                      <span className="font-bold text-green-600">{result.daysUntilBirthday}일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">살아온 일수:</span>
                      <span className="font-bold text-green-600">{result.daysLived.toLocaleString()}일</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">상세 정보</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="font-semibold">생년월일:</span> {result.birthDate}</p>
                    <p><span className="font-semibold">기준 날짜:</span> {result.currentDate}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">윤년 포함:</span> {result.leapYears}년</p>
                    <p><span className="font-semibold">계산 방식:</span> 한국식 만 나이 기준</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>만 나이:</strong> 생년월일부터 현재까지의 정확한 나이</p>
              <p>• <strong>세는 나이:</strong> 한국에서 주로 사용하는 나이 계산 방식 (만 나이 + 1)</p>
              <p>• <strong>정확한 나이:</strong> 년, 월, 일 단위로 정확한 나이 표시</p>
              <p>• <strong>다음 생일까지:</strong> 현재부터 다음 생일까지 남은 일수</p>
              <p>• <strong>살아온 일수:</strong> 태어난 날부터 현재까지 살아온 총 일수</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/due-date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-pink-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">예정일 계산기</h4>
              </a>
              
              <a href="/pregnancy-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임신 계산기</h4>
              </a>
              
              <a href="/bmi-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMI 계산기</h4>
              </a>
              
              <a href="/bmr-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">BMR 계산기</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 