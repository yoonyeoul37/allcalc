"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaCalendarAlt, FaUser, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    if (!birthDate || !targetDate) {
      alert("생년월일과 기준일을 모두 입력해주세요.");
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      alert("생년월일은 기준일보다 이전이어야 합니다.");
      return;
    }

    const diffTime = target.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 년, 월, 일 계산
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(diffDays / 7);

    setResult({
      years,
      months,
      days,
      totalDays: diffDays,
      totalMonths,
      totalWeeks
    });
  };

  const resetCalculator = () => {
    setBirthDate("");
    setTargetDate("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaUser className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">나이 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">정확한 나이와 기간을 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">날짜 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  생년월일
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  기준일
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateAge}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
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

          {/* 계산 결과 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaUser className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">나이</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.years}년 {result.months}개월 {result.days}일
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 일수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalDays.toLocaleString()}일
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 개월수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalMonths}개월
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 주수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalWeeks}주
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">나이 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>정확한 나이:</strong> 생년월일부터 기준일까지의 정확한 기간</div>
                  <div>• <strong>만 나이:</strong> 생일이 지나면 1살 증가</div>
                  <div>• <strong>세는 나이:</strong> 태어난 해부터 1살로 계산</div>
                  <div>• <strong>일수 계산:</strong> 윤년을 고려한 정확한 일수</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">사용 예시</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>생년월일:</strong> 1990년 3월 15일</div>
                  <div>• <strong>기준일:</strong> 2024년 1월 20일</div>
                  <div>• <strong>결과:</strong> 33년 10개월 5일</div>
                  <div>• <strong>총 일수:</strong> 12,345일</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">날짜 계산기</h4>
                <p className="text-xs text-gray-600">날짜 계산</p>
              </Link>
              
              <Link href="/time-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">시간 계산기</h4>
                <p className="text-xs text-gray-600">시간 계산</p>
              </Link>
              
              <Link href="/pregnancy-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUser className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임신 계산기</h4>
                <p className="text-xs text-gray-600">임신 기간</p>
              </Link>
              
              <Link href="/due-date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">출산예정일</h4>
                <p className="text-xs text-gray-600">출산일 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
