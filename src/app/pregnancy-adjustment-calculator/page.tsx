"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHeart, FaCalculator, FaCalendar, FaBaby, FaHospital, FaHome, FaUser, FaClock, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface PregnancyAdjustmentResult {
  originalWeek: number;
  originalDay: number;
  adjustedWeek: number;
  adjustedDay: number;
  adjustmentDays: number;
  adjustedDueDate: string;
  currentAdjustedWeek: number;
  currentAdjustedDay: number;
}

export default function PregnancyAdjustmentCalculator() {
  const [lastPeriodDate, setLastPeriodDate] = useState<string>("");
  const [ultrasoundDate, setUltrasoundDate] = useState<string>("");
  const [ultrasoundWeek, setUltrasoundWeek] = useState<string>("");
  const [ultrasoundDay, setUltrasoundDay] = useState<string>("");
  const [result, setResult] = useState<PregnancyAdjustmentResult | null>(null);

  const calculateAdjustment = () => {
    if (!lastPeriodDate || !ultrasoundDate || !ultrasoundWeek) return;

    const lastPeriod = new Date(lastPeriodDate);
    const ultrasound = new Date(ultrasoundDate);
    const today = new Date();
    
    // 초음파 검사일 기준 마지막 월경일로부터의 일수
    const daysSinceLastPeriodAtUltrasound = Math.floor((ultrasound.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    
    // 초음파에서 측정된 임신 주수 (일수로 변환)
    const ultrasoundDays = (parseInt(ultrasoundWeek) * 7) + parseInt(ultrasoundDay || "0");
    
    // 수정값 계산 (초음파 결과 - 마지막 월경일 기준)
    const adjustmentDays = ultrasoundDays - daysSinceLastPeriodAtUltrasound;
    
    // 수정된 마지막 월경일
    const adjustedLastPeriod = new Date(lastPeriod.getTime() + (adjustmentDays * 24 * 60 * 60 * 1000));
    
    // 수정된 출산 예정일
    const adjustedDueDate = new Date(adjustedLastPeriod.getTime() + (280 * 24 * 60 * 60 * 1000));
    
    // 현재 수정된 임신 주수
    const currentDaysSinceAdjusted = Math.floor((today.getTime() - adjustedLastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const currentAdjustedWeek = Math.floor(currentDaysSinceAdjusted / 7);
    const currentAdjustedDay = currentDaysSinceAdjusted % 7;
    
    // 원래 계산된 임신 주수
    const originalDaysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
    const originalWeek = Math.floor(originalDaysSinceLastPeriod / 7);
    const originalDay = originalDaysSinceLastPeriod % 7;

    setResult({
      originalWeek,
      originalDay,
      adjustedWeek: currentAdjustedWeek,
      adjustedDay: currentAdjustedDay,
      adjustmentDays,
      adjustedDueDate: adjustedDueDate.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
      currentAdjustedWeek: currentAdjustedWeek,
      currentAdjustedDay: currentAdjustedDay
    });
  };

  const clear = () => {
    setLastPeriodDate("");
    setUltrasoundDate("");
    setUltrasoundWeek("");
    setUltrasoundDay("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">임신 수정 계산기</h1>
            <p className="text-lg text-gray-600">초음파 검사 결과를 바탕으로 임신 주수를 정확하게 수정해보세요</p>
          </div>

          {/* 임신 수정 계산기 */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">초음파 검사일</label>
                  <input
                    type="date"
                    value={ultrasoundDate}
                    onChange={(e) => setUltrasoundDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>
            </div>

            {/* 초음파 결과 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHospital className="text-black" />
                초음파 검사 결과
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임신 주수</label>
                  <input
                    type="number"
                    value={ultrasoundWeek}
                    onChange={(e) => setUltrasoundWeek(e.target.value)}
                    placeholder="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임신 일수</label>
                  <input
                    type="number"
                    value={ultrasoundDay}
                    onChange={(e) => setUltrasoundDay(e.target.value)}
                    placeholder="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateAdjustment}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                임신 주수 수정하기
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">임신 수정 계산 결과</h3>
                
                {/* 기본 정보 표시 */}
                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">
                      마지막 월경일: {lastPeriodDate} • 초음파 검사일: {ultrasoundDate}
                    </span>
                  </div>
                </div>

                {/* 수정 전후 비교 */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">수정 전 임신 주수</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {result.originalWeek}주 {result.originalDay}일
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      마지막 월경일 기준
                    </div>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg bg-blue-50">
                    <div className="text-sm text-gray-600 mb-1">수정 후 임신 주수</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.adjustedWeek}주 {result.adjustedDay}일
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      초음파 결과 기준
                    </div>
                  </div>
                </div>

                {/* 수정 정보 */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">수정 정보</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">수정 일수</div>
                      <div className="text-xl font-bold text-purple-600">
                        {result.adjustmentDays}일
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {result.adjustmentDays > 0 ? '앞당겨짐' : '늦춰짐'}
                      </div>
                    </div>
                    <div className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">수정된 출산 예정일</div>
                      <div className="text-lg font-bold text-green-600">
                        {result.adjustedDueDate}
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
                임신 수정 계산이란?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 초음파 검사 결과와 마지막 월경일 기준 계산이 다를 때 사용합니다.</p>
                <p>• 실제 태아 발달 상태에 맞춰 임신 주수를 수정합니다.</p>
                <p>• 더 정확한 출산 예정일과 임신 주수 계산을 위해 필요합니다.</p>
                <p>• 산부인과에서 제공하는 초음파 결과를 바탕으로 계산합니다.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeart className="text-black" />
                주의사항
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 이 계산기는 참고용이며, 정확한 진단은 의사와 상담하세요.</p>
                <p>• 초음파 검사 결과는 정확한 날짜와 주수를 입력해야 합니다.</p>
                <p>• 정기적인 산전 검진을 받는 것이 중요합니다.</p>
                <p>• 개인의 건강 상태에 따라 결과가 달라질 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">관련 계산기</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/pregnancy-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaBaby className="text-pink-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">임신 계산기</h4>
                <p className="text-sm text-gray-600">기본 임신 주수 계산</p>
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
