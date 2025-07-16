"use client";

import { useState } from "react";
import { FaHeart, FaCalculator, FaCalendar, FaBaby, FaHospital } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">임신 수정 계산기</h1>
            <p className="text-lg text-gray-600">초음파 검사 결과를 바탕으로 임신 주수를 정확하게 수정해보세요</p>
          </div>

          {/* 임신 수정 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 기본 정보 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">마지막 월경일</label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">초음파 검사일</label>
                  <input
                    type="date"
                    value={ultrasoundDate}
                    onChange={(e) => setUltrasoundDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 초음파 결과 입력 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">초음파 검사 결과</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임신 주수</label>
                  <input
                    type="number"
                    value={ultrasoundWeek}
                    onChange={(e) => setUltrasoundWeek(e.target.value)}
                    placeholder="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">임신 일수</label>
                  <input
                    type="number"
                    value={ultrasoundDay}
                    onChange={(e) => setUltrasoundDay(e.target.value)}
                    placeholder="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 임신 수정 계산기 설명 */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">임신 수정 계산이란?</h4>
              <p className="text-sm text-gray-600">
                초음파 검사 결과와 마지막 월경일 기준 계산이 다를 때, 실제 태아 발달 상태에 맞춰 임신 주수를 수정합니다. 
                이는 더 정확한 출산 예정일과 임신 주수 계산을 위해 필요합니다.
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateAdjustment}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
              <div className="border border-gray-200 p-6 rounded-lg">
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
                        {result.adjustmentDays > 0 ? '+' : ''}{result.adjustmentDays}일
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

                {/* 수정 필요성 안내 */}
                {Math.abs(result.adjustmentDays) > 7 && (
                  <div className="mt-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 수정 권장</h4>
                    <p className="text-sm text-yellow-700">
                      초음파 결과와 마지막 월경일 기준 계산의 차이가 7일 이상입니다. 
                      산부인과에서 임신 주수 수정을 권장받으셨다면, 이 결과를 참고하여 산전 관리를 계획하세요.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🏥 산부인과 예약 서비스</h3>
                    <p className="text-sm mb-3">초음파 검사, 산전 검진 예약 편리하게</p>
                    <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      예약하기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">📱 임신 관리 앱</h3>
                  <p className="text-gray-600 mb-3">임신 주수 추적, 산전 검진 알림, 태아 발달 정보</p>
                  <div className="flex gap-2">
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">무료</span>
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">4.8★</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105">
                    다운로드
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* 메인 콘텐츠 */}
            <div className="flex-1 max-w-4xl">
          
          {/* 임신 수정이란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">임신 수정이란?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                임신 수정은 초음파 검사 결과와 마지막 월경일 기준 계산 사이의 차이를 보정하는 과정입니다. 
                월경 주기가 불규칙하거나 배란일이 예상과 다른 경우, 초음파 검사가 더 정확한 임신 주수를 제공합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                초음파 검사는 태아의 실제 크기와 발달 상태를 측정하므로, 마지막 월경일 기준 계산보다 더 정확합니다. 
                특히 월경 주기가 불규칙한 임신부에게 매우 유용합니다.
              </p>
            </div>
          </section>

          {/* 수정이 필요한 경우 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">수정이 필요한 경우</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">월경 주기 불규칙</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 28일이 아닌 다른 주기</li>
                  <li>• 배란일이 예상과 다른 경우</li>
                  <li>• 월경일을 정확히 기억하지 못하는 경우</li>
                  <li>• 피임약 복용 후 임신</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">초음파 결과와 차이</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 초음파와 월경일 기준 차이가 7일 이상</li>
                  <li>• 의사가 수정을 권장한 경우</li>
                  <li>• 태아 발달이 예상과 다른 경우</li>
                  <li>• 산전 검진 일정 조정 필요</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 수정 계산 공식 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">수정 계산 공식</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800 mb-4">
                  수정 일수 = 초음파 임신 일수 - 마지막 월경일 기준 일수
                </div>
                <div className="text-gray-700">
                  <p className="mb-2"><strong>예시:</strong> 마지막 월경일 2024년 1월 1일, 초음파 검사일 2024년 2월 15일</p>
                  <p>초음파 결과: 8주 2일 (58일)</p>
                  <p>마지막 월경일 기준: 45일</p>
                  <p>수정 일수: 58일 - 45일 = +13일</p>
                </div>
              </div>
            </div>
          </section>

          {/* 광고 3: 정보 섹션 중간 */}
          <div className="my-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">광고</div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">📊 임신 주수별 정보</h3>
                <p className="text-sm mb-3">각 주수별 태아 발달 상태와 산모 변화</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  정보 보기 →
                </button>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🏥 의료진과 상담</h3>
                <p className="text-gray-600">임신 주수 수정은 의료진의 판단에 따라 결정됩니다. 이 계산기는 참고용이며, 최종 결정은 산부인과 의사와 상담 후 결정하세요.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📅 산전 검진 일정</h3>
                <p className="text-gray-600">임신 주수가 수정되면 산전 검진 일정도 함께 조정될 수 있습니다. 수정된 주수에 맞춰 산전 검진 일정을 재조정하세요.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📱 기록 관리</h3>
                <p className="text-gray-600">수정된 임신 주수와 출산 예정일을 기록해두고, 향후 산전 검진 시 참고할 수 있도록 관리하세요.</p>
              </div>
            </div>
          </section>
            </div>

            {/* 사이드바 */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">관련 계산기</h3>
                <div className="space-y-3">
                  <a href="/pregnancy-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBaby className="text-pink-500" />
                      <div>
                        <div className="font-medium text-gray-800">임신 계산기</div>
                        <div className="text-sm text-gray-600">기본 임신 주수 계산</div>
                      </div>
                    </div>
                  </a>
                  <a href="/due-date-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBaby className="text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-800">출산 예정일 계산기</div>
                        <div className="text-sm text-gray-600">정확한 출산 예정일</div>
                      </div>
                    </div>
                  </a>
                  <a href="/bmi-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaHeart className="text-red-500" />
                      <div>
                        <div className="font-medium text-gray-800">BMI 계산기</div>
                        <div className="text-sm text-gray-600">체질량지수 계산</div>
                      </div>
                    </div>
                  </a>
                  <a href="/calorie-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaCalculator className="text-green-500" />
                      <div>
                        <div className="font-medium text-gray-800">칼로리 계산기</div>
                        <div className="text-sm text-gray-600">임신부 칼로리 섭취</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-200 p-6 mt-8 text-sm text-gray-700 leading-relaxed">
          <p className="mb-4">
            임신 수정 계산기는 초음파 검사 결과를 바탕으로 임신 주수를 정확하게 수정하는데 도움을 주는 도구입니다. 
            마지막 월경일 기준 계산과 초음파 결과 사이의 차이를 보정하여 더 정확한 임신 주수와 출산 예정일을 계산할 수 있습니다.
          </p>
          <p className="mb-4">
            이 계산기는 의료진의 판단을 대체하지 않으며, 참고용으로만 사용하시기 바랍니다. 
            최종적인 임신 주수 수정은 산부인과 의사와 상담 후 결정하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            우리에 대해 | 사이트맵 | 이용 약관 | 개인정보 보호정책 © 2008 - 2025 calculator.net
          </div>
        </div>
      </div>
    </div>
  );
} 