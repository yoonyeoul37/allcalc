"use client";

import { useState } from "react";
import { FaHeart, FaCalculator, FaCalendar, FaBaby } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">임신 계산기</h1>
            <p className="text-lg text-gray-600">출산 예정일과 현재 임신 주수를 계산해보세요</p>
          </div>

          {/* 임신 계산기 */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">월경 주기 (일)</label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    placeholder="28"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 임신 계산기 설명 */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">임신 주수 계산이란?</h4>
              <p className="text-sm text-gray-600">
                마지막 월경일을 기준으로 현재 임신 주수와 출산 예정일을 계산합니다. 
                의학적으로는 마지막 월경일을 임신 0주 0일로 계산합니다.
              </p>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculatePregnancy}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
              <div className="border border-gray-200 p-6 rounded-lg">
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

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">👶 임신부 영양제 추천</h3>
                    <p className="text-sm mb-3">엽산, 철분, 칼슘 등 임신부 필수 영양소</p>
                    <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      상품 보기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">👶 임신부 의류 특가</h3>
                  <p className="text-gray-600 mb-3">임신부복, 속옷, 수유복 최대 50% 할인</p>
                  <div className="flex gap-2">
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">50% OFF</span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">무료배송</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105">
                    지금 쇼핑하기
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
          
          {/* 임신 주수란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">임신 주수란?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                임신 주수는 마지막 월경일을 기준으로 계산됩니다. 의학적으로는 마지막 월경일을 임신 0주 0일로 계산하며, 
                이는 배란과 수정이 일어나기 전의 시점입니다. 실제 임신은 배란 후 약 2주 후에 시작되지만, 
                의학적 편의를 위해 마지막 월경일을 기준으로 계산합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                임신 주수는 태아의 발달 단계를 파악하고 산전 관리를 계획하는데 매우 중요한 지표입니다. 
                각 주수별로 태아의 발달 상태와 산모의 신체 변화가 다르므로 정확한 주수 파악이 필요합니다.
              </p>
            </div>
          </section>

          {/* 임신 주수 계산 공식 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">임신 주수 계산 공식</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800 mb-4">
                  임신 주수 = (오늘 날짜 - 마지막 월경일) ÷ 7
                </div>
                <div className="text-gray-700">
                  <p className="mb-2"><strong>예시:</strong> 마지막 월경일이 2024년 1월 1일인 경우</p>
                  <p>2024년 3월 1일 기준: (60일 ÷ 7) = 약 8주 4일</p>
                </div>
              </div>
            </div>
          </section>

          {/* 삼분기별 특징 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">삼분기별 특징</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">첫 번째 삼분기 (1-12주)</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 태아의 주요 기관 형성</li>
                  <li>• 입덧, 피로감</li>
                  <li>• 유산 위험 최고조</li>
                  <li>• 엽산 섭취 중요</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">두 번째 삼분기 (13-26주)</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 태동 시작</li>
                  <li>• 입덧 완화</li>
                  <li>• 안정기</li>
                  <li>• 태아 성별 확인</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">세 번째 삼분기 (27-40주)</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• 태아 성장 급속도</li>
                  <li>• 자궁 수축</li>
                  <li>• 분만 준비</li>
                  <li>• 산모 체중 증가</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 광고 3: 정보 섹션 중간 */}
          <div className="my-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">광고</div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">📱 임신 관리 앱</h3>
                <p className="text-sm mb-3">임신 주수별 정보, 체크리스트, 산부인과 예약</p>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  무료 다운로드 →
                </button>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">주의사항</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">⚠️ 정확한 계산을 위해</h3>
                <p className="text-gray-600">마지막 월경일을 정확히 기억하고 입력해주세요. 월경 주기가 규칙적이지 않은 경우 산부인과에서 초음파 검사를 통해 정확한 주수를 확인하는 것이 좋습니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🏥 산전 검진</h3>
                <p className="text-gray-600">임신 주수에 따라 필요한 산전 검진이 다릅니다. 정기적인 산부인과 방문을 통해 태아와 산모의 건강을 확인하세요.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📅 출산 예정일</h3>
                <p className="text-gray-600">출산 예정일은 참고용이며, 실제 출산은 예정일 전후 2주 내에 이루어지는 것이 정상입니다. 태아의 성숙도와 산모의 상태에 따라 달라질 수 있습니다.</p>
              </div>
            </div>
          </section>
            </div>

            {/* 사이드바 */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">관련 계산기</h3>
                <div className="space-y-3">
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
                  <a href="/pregnancy-adjustment-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBaby className="text-purple-500" />
                      <div>
                        <div className="font-medium text-gray-800">임신 수정 계산기</div>
                        <div className="text-sm text-gray-600">초음파 기준 주수 조정</div>
                      </div>
                    </div>
                  </a>
                  <a href="/due-date-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBaby className="text-pink-500" />
                      <div>
                        <div className="font-medium text-gray-800">출산 예정일 계산기</div>
                        <div className="text-sm text-gray-600">정확한 출산 예정일</div>
                      </div>
                    </div>
                  </a>
                  <a href="/bmr-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaBaby className="text-pink-500" />
                      <div>
                        <div className="font-medium text-gray-800">BMR 계산기</div>
                        <div className="text-sm text-gray-600">기초대사율 계산</div>
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
            임신 계산기는 임신부가 현재 임신 주수와 출산 예정일을 파악하는데 도움을 주는 도구입니다. 
            정확한 임신 주수 계산을 통해 체계적인 산전 관리를 계획하고, 건강한 임신 생활을 할 수 있습니다.
          </p>
          <p className="mb-4">
            이 계산기는 마지막 월경일을 기준으로 임신 주수를 계산하며, 출산 예정일은 마지막 월경일로부터 280일 후로 계산됩니다. 
            임신 초기부터 분만까지 모든 임신부에게 유용한 도구입니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            우리에 대해 | 사이트맵 | 이용 약관 | 개인정보 보호정책 © 2008 - 2025 calculator.net
          </div>
        </div>
      </div>
    </div>
  );
} 