"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface DateResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  workDays: number;
  holidays: number;
}

export default function DateCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<DateResult | null>(null);

  const calculateDate = () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 입력해주세요.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("시작일은 종료일보다 이전이어야 합니다.");
      return;
    }

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 년, 월 계산
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const weeks = Math.floor(diffDays / 7);
    const totalMonths = years * 12 + months;

    // 근무일 계산 (주말 제외)
    let workDays = 0;
    let holidays = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 일요일(0)과 토요일(6) 제외
        workDays++;
      } else {
        holidays++;
      }
      current.setDate(current.getDate() + 1);
    }

    setResult({
      days: diffDays,
      weeks,
      months: totalMonths,
      years,
      workDays,
      holidays
    });
  };

  const resetCalculator = () => {
    setStartDate("");
    setEndDate("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaCalendarAlt className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">날짜 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">두 날짜 사이의 기간을 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">날짜 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0 text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateDate}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 일수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.days.toLocaleString()}일
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 주수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.weeks}주
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 개월수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.months}개월
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">근무일</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.workDays}일
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">주말/휴일</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.holidays}일
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 년수</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.years}년
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">날짜 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>총 일수:</strong> 시작일부터 종료일까지의 총 일수</div>
                  <div>• <strong>근무일:</strong> 주말을 제외한 근무 가능한 일수</div>
                  <div>• <strong>주말/휴일:</strong> 토요일, 일요일을 포함한 휴일</div>
                  <div>• <strong>정확한 계산:</strong> 윤년을 고려한 정확한 계산</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">사용 예시</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>시작일:</strong> 2024년 1월 1일</div>
                  <div>• <strong>종료일:</strong> 2024년 12월 31일</div>
                  <div>• <strong>총 일수:</strong> 365일</div>
                  <div>• <strong>근무일:</strong> 약 261일</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/age-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">나이 계산기</h4>
                <p className="text-xs text-gray-600">나이 계산</p>
              </Link>
              
              <Link href="/time-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">시간 계산기</h4>
                <p className="text-xs text-gray-600">시간 계산</p>
              </Link>
              
              <Link href="/holiday-work-days-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근무일 계산기</h4>
                <p className="text-xs text-gray-600">근무일 계산</p>
              </Link>
              
              <Link href="/pregnancy-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">임신 계산기</h4>
                <p className="text-xs text-gray-600">임신 기간</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 
