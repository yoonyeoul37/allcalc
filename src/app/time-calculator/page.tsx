"use client";

import { useState } from "react";
import { FaCalculator, FaClock, FaInfoCircle } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface TimeResult {
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function TimeCalculator() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [result, setResult] = useState<TimeResult | null>(null);

  const calculateTime = () => {
    if (!startTime || !endTime) {
      alert("시작 시간과 종료 시간을 모두 입력해주세요.");
      return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    // 종료 시간이 시작 시간보다 작으면 다음 날로 계산
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    setResult({
      totalHours,
      totalMinutes,
      totalSeconds,
      days,
      hours,
      minutes,
      seconds
    });
  };

  const resetCalculator = () => {
    setStartTime("");
    setEndTime("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaClock className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">시간 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">두 시간 사이의 차이를 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">시간 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-black" />
                  시작 시간
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-black" />
                  종료 시간
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateTime}
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
                    <FaClock className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 시간</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalHours}시간
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 분</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalMinutes}분
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 초</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {result.totalSeconds.toLocaleString()}초
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaClock className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">상세 시간</h4>
                  </div>
                  <div className="text-lg font-bold text-black">
                    {result.days > 0 && `${result.days}일 `}
                    {result.hours}시간 {result.minutes}분 {result.seconds}초
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 안내 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center mb-4">
              <FaInfoCircle className="text-2xl text-black mr-3" />
              <h2 className="text-xl font-bold text-gray-800">시간 계산기 안내</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">계산 방법</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>24시간 형식:</strong> 00:00 ~ 23:59 형식으로 입력</div>
                  <div>• <strong>자동 계산:</strong> 종료 시간이 시작 시간보다 작으면 다음 날로 계산</div>
                  <div>• <strong>정확한 계산:</strong> 시간, 분, 초 단위까지 정확히 계산</div>
                  <div>• <strong>다양한 표시:</strong> 총 시간, 상세 시간 등 다양한 형태로 표시</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">사용 예시</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• <strong>시작 시간:</strong> 09:00</div>
                  <div>• <strong>종료 시간:</strong> 17:30</div>
                  <div>• <strong>결과:</strong> 8시간 30분</div>
                  <div>• <strong>총 분:</strong> 510분</div>
                </div>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/age-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaClock className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">나이 계산기</h4>
                <p className="text-xs text-gray-600">나이 계산</p>
              </a>
              
              <a href="/date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaClock className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">날짜 계산기</h4>
                <p className="text-xs text-gray-600">날짜 계산</p>
              </a>
              
              <a href="/pace-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaClock className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">페이스 계산기</h4>
                <p className="text-xs text-gray-600">페이스 계산</p>
              </a>
              
              <a href="/holiday-work-days-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaClock className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근무일 계산기</h4>
                <p className="text-xs text-gray-600">근무일 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 