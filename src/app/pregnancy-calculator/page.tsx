"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaCalculator, FaCalendar, FaBaby, FaHome, FaUser, FaClock, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface PregnancyResult {
  dueDate: string;
  currentWeek: number;
  currentDay: number;
  trimester: string;
  weeksRemaining: number;
  daysRemaining: number;
}

export default function PregnancyCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
  const [cycleLength, setCycleLength] = useState<string>("28");
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const calculatePregnancy = () => {
    if (!lastPeriodDate) return;

    const lastPeriod = new Date(lastPeriodDate);
    const today = new Date();
    
    // 마지막 월경일로부터 오늘까지의 일수
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    // 임신 주수 계산 (월경일 기준)
    const currentWeek = Math.floor(daysSinceLastPeriod / 7);
    const currentDay = daysSinceLastPeriod % 7;
    
    // 예정일 계산 (마지막 월경일 + 280일)
    const dueDate = new Date(lastPeriod.getTime() + (280 * 24 * 60 * 60 * 1000));
    
    // 삼분기 계산
    let trimester = "";
    if (currentWeek < 13) {
      trimester = "첫 번째 삼분기 (1-12주)";
    } else if (currentWeek < 27) {
      trimester = "두 번째 삼분기 (13-26주)";
    } else {
      trimester = "세 번째 삼분기 (27-40주)";
    }
    
    // 남은 일수 계산
    const daysRemaining = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.floor(daysRemaining / 7);
    const remainingDays = daysRemaining % 7;

    setResult({
      dueDate: dueDate.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
      currentWeek,
      currentDay,
      trimester,
      weeksRemaining,
      daysRemaining: remainingDays
    });
  };

  const clear = () => {
    setLastPeriodDate("");
    setCycleLength("28");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">임신 계산기</h1>
            <p className="text-lg text-gray-600">출산 예정일과 현재 임신 주수를 계산해보세요</p>
          </div>

          {/* 임신 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-black" />
                기본 정보
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마지막 월경일</label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">월경 주기 (일)</label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    placeholder="28"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculatePregnancy}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                임신 주수 계산하기
              </button>
              <button
                onClick={clear}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                초기화
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="border border-gray-200 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">임신 계산 결과</h3>
                
                {/* 기본 정보 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      마지막 월경일: {lastPeriodDate} • 월경 주기: {cycleLength}일
                    </span>
                  </div>
                </div>

                {/* 주요 결과 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">출산 예정일</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.dueDate}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      마지막 월경일 + 280일
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">현재 임신 주수</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.currentWeek}주 {result.currentDay}일
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      마지막 월경일 기준
                    </div>
                  </div>
                </div>

                {/* 삼분기 정보 */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">현재 삼분기</h4>
                  <div className="text-center p-4 border border-gray-200 rounded-lg bg-pink-50">
                    <div className="text-lg font-bold text-pink-600">
                      {result.trimester}
                    </div>
                  </div>
                </div>

                {/* 남은 기간 */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">출산까지 남은 기간</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">남은 주수</div>
                      <div className="text-xl font-bold text-orange-600">
                        {result.weeksRemaining}주
                      </div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">남은 일수</div>
                      <div className="text-xl font-bold text-orange-600">
                        {result.daysRemaining}일
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 설명 및 주의사항 */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalculator className="text-black" />
                임신 주수 계산이란?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 마지막 월경일을 기준으로 현재 임신 주수와 출산 예정일을 계산합니다.</p>
                <p>• 의학적으로는 마지막 월경일을 임신 0주 0일로 계산합니다.</p>
                <p>• 정확한 계산을 위해 정확한 마지막 월경일을 입력하세요.</p>
                <p>• 월경 주기가 28일이 아닌 경우 해당 값을 입력하세요.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeart className="text-black" />
                주의사항
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 이 계산기는 참고용이며, 정확한 진단은 의사와 상담하세요.</p>
                <p>• 실제 출산일은 계산된 예정일과 다를 수 있습니다.</p>
                <p>• 정기적인 산전 검진을 받는 것이 중요합니다.</p>
                <p>• 개인의 건강 상태에 따라 결과가 달라질 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">관련 계산기</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/pregnancy-adjustment-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBaby className="text-pink-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">임신 수정 계산기</h4>
                <p className="text-sm text-gray-600">초음파 결과 기반 수정</p>
              </Link>
              
              <Link href="/due-date-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCalendar className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">출산 예정일 계산기</h4>
                <p className="text-sm text-gray-600">정확한 출산일 계산</p>
              </Link>
              
              <Link href="/bmi-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCalculator className="text-green-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">BMI 계산기</h4>
                <p className="text-sm text-gray-600">임신 중 체중 관리</p>
              </Link>
              
              <Link href="/calorie-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHeart className="text-orange-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">칼로리 계산기</h4>
                <p className="text-sm text-gray-600">임신 중 영양 관리</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 
