'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface Holiday {
  name: string;
  date: string;
  type: 'fixed' | 'lunar';
}

export default function HolidayWorkDaysCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [customHolidays, setCustomHolidays] = useState('');
  const [result, setResult] = useState<{
    totalDays: number;
    weekends: number;
    holidays: number;
    workDays: number;
    workHours: number;
  } | null>(null);

  // 2024년 한국 공휴일 목록
  const koreanHolidays2024: Holiday[] = [
    { name: '신정', date: '2024-01-01', type: 'fixed' },
    { name: '설날', date: '2024-02-09', type: 'fixed' },
    { name: '설날', date: '2024-02-10', type: 'fixed' },
    { name: '설날', date: '2024-02-11', type: 'fixed' },
    { name: '삼일절', date: '2024-03-01', type: 'fixed' },
    { name: '대통령선거일', date: '2024-04-10', type: 'fixed' },
    { name: '부처님오신날', date: '2024-05-15', type: 'lunar' },
    { name: '어린이날', date: '2024-05-05', type: 'fixed' },
    { name: '현충일', date: '2024-06-06', type: 'fixed' },
    { name: '제헌절', date: '2024-07-17', type: 'fixed' },
    { name: '광복절', date: '2024-08-15', type: 'fixed' },
    { name: '추석', date: '2024-09-16', type: 'lunar' },
    { name: '추석', date: '2024-09-17', type: 'lunar' },
    { name: '추석', date: '2024-09-18', type: 'lunar' },
    { name: '개천절', date: '2024-10-03', type: 'fixed' },
    { name: '한글날', date: '2024-10-09', type: 'fixed' },
    { name: '크리스마스', date: '2024-12-25', type: 'fixed' }
  ];

  const calculateWorkDays = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      alert('시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    let totalDays = 0;
    let weekends = 0;
    let holidays = 0;
    const customHolidayList = customHolidays.split(',').map(d => d.trim()).filter(d => d);

    const currentDate = new Date(start);
    while (currentDate <= end) {
      totalDays++;
      
      const dayOfWeek = currentDate.getDay();
      const dateString = currentDate.toISOString().split('T')[0];
      
      // 주말 체크
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends++;
      }
      
      // 공휴일 체크
      const isHoliday = koreanHolidays2024.some(holiday => holiday.date === dateString) ||
                       customHolidayList.includes(dateString);
      
      if (isHoliday) {
        holidays++;
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const workDays = totalDays - weekends - holidays;
    const workHours = workDays * 8; // 하루 8시간 근무 기준

    setResult({
      totalDays,
      weekends,
      holidays,
      workDays,
      workHours
    });
  };

  const resetCalculator = () => {
    setStartDate('');
    setEndDate('');
    setIncludeWeekends(false);
    setCustomHolidays('');
    setResult(null);
  };

  const getCurrentYearHolidays = () => {
    const currentYear = new Date().getFullYear();
    return koreanHolidays2024.map(holiday => ({
      ...holiday,
      date: holiday.date.replace('2024', currentYear.toString())
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">공휴일 근무일수 계산기</h1>
            <p className="text-lg text-gray-600">
              특정 기간의 공휴일과 주말을 제외한 실제 근무일수를 계산해보세요
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeWeekends}
                    onChange={(e) => setIncludeWeekends(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">주말 포함 (토요일, 일요일)</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 공휴일 (YYYY-MM-DD 형식, 쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={customHolidays}
                  onChange={(e) => setCustomHolidays(e.target.value)}
                  placeholder="예: 2024-01-15, 2024-02-20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={calculateWorkDays}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                계산하기
              </Button>
              <Button
                onClick={resetCalculator}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                초기화
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 일수</p>
                    <p className="text-xl font-bold text-blue-600">{result.totalDays}일</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">주말</p>
                    <p className="text-xl font-bold text-orange-600">{result.weekends}일</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">공휴일</p>
                    <p className="text-xl font-bold text-red-600">{result.holidays}일</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">근무일수</p>
                    <p className="text-xl font-bold text-green-600">{result.workDays}일</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">근무시간</p>
                    <p className="text-xl font-bold text-green-600">{result.workHours}시간</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">공휴일 근무일수란?</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                공휴일 근무일수는 특정 기간에서 주말과 공휴일을 제외한 실제 근무 가능한 일수를 의미합니다. 
                이는 업무 계획 수립, 인력 배치, 프로젝트 일정 관리 등에 활용됩니다.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">계산 기준</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>주말: 토요일, 일요일 (선택적으로 포함 가능)</li>
                <li>공휴일: 법정 공휴일 및 추가 공휴일</li>
                <li>근무시간: 하루 8시간 기준</li>
                <li>기간: 시작일부터 종료일까지 (종료일 포함)</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2024년 주요 공휴일</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentYearHolidays().map((holiday, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-semibold text-gray-800">{holiday.name}</p>
                  <p className="text-sm text-gray-600">{holiday.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">사용 가이드</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. 기간 설정</h3>
                <p className="text-gray-700">
                  계산하고자 하는 시작일과 종료일을 선택하세요. 종료일은 포함됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. 주말 포함 여부</h3>
                <p className="text-gray-700">
                  주말을 근무일로 포함할지 선택하세요. 체크하면 주말도 근무일로 계산됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. 추가 공휴일</h3>
                <p className="text-gray-700">
                  회사별 공휴일이나 특별한 휴일이 있다면 추가로 입력하세요.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">관련 계산기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/date-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">날짜 계산기</h3>
                <p className="text-sm text-gray-600">날짜 간격 계산</p>
              </a>
              <a
                href="/time-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">시간 계산기</h3>
                <p className="text-sm text-gray-600">시간 계산</p>
              </a>
              <a
                href="/salary-calculator"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800">급여 계산기</h3>
                <p className="text-sm text-gray-600">실수령액 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 