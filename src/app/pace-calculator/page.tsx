"use client";

import { useState } from "react";
import { FaCalculator, FaHeart, FaMoneyBillWave, FaTools, FaRunning, FaHome, FaClock, FaTachometerAlt, FaRoute } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function PaceCalculator() {
  const [activeTab, setActiveTab] = useState<'pace' | 'time'>('pace');
  const [distance, setDistance] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("");
  const [paceMinutes, setPaceMinutes] = useState<string>("");
  const [paceSeconds, setPaceSeconds] = useState<string>("");
  const [result, setResult] = useState<{
    pace: string;
    speed: string;
    time: string;
  } | null>(null);

  const calculatePace = () => {
    const distanceValue = parseFloat(distance);
    const totalMinutes = (parseInt(hours) * 60) + parseInt(minutes) + (parseInt(seconds) / 60);
    
    if (distanceValue > 0 && totalMinutes > 0) {
      const pacePerKm = totalMinutes / distanceValue;
      const paceMinutesValue = Math.floor(pacePerKm);
      const paceSecondsValue = Math.round((pacePerKm - paceMinutesValue) * 60);
      
      const speedKmh = (distanceValue / totalMinutes) * 60;
      
      setResult({
        pace: `${paceMinutesValue}:${paceSecondsValue.toString().padStart(2, '0')} /km`,
        speed: `${speedKmh.toFixed(2)} km/h`,
        time: `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
      });
    }
  };

  const calculateTime = () => {
    const distanceValue = parseFloat(distance);
    const paceMinutesValue = parseInt(paceMinutes);
    const paceSecondsValue = parseInt(paceSeconds);
    
    if (distanceValue > 0 && (paceMinutesValue > 0 || paceSecondsValue > 0)) {
      const pacePerKm = paceMinutesValue + (paceSecondsValue / 60);
      const totalMinutes = distanceValue * pacePerKm;
      
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = Math.floor(totalMinutes % 60);
      const remainingSeconds = Math.round((totalMinutes % 1) * 60);
      
      setResult({
        pace: `${paceMinutesValue}:${paceSecondsValue.toString().padStart(2, '0')} /km`,
        speed: `${(60 / pacePerKm).toFixed(2)} km/h`,
        time: `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      });
    }
  };

  const clear = () => {
    setDistance("");
    setHours("");
    setMinutes("");
    setSeconds("");
    setPaceMinutes("");
    setPaceSeconds("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">페이스 계산기</h1>
            <p className="text-lg text-gray-600">러닝 페이스와 목표 시간을 계산하세요</p>
          </div>

          {/* 페이스 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaRoute className="text-black" />
                거리 입력
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="거리 (km)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none text-lg"
                />
                <span className="text-gray-600 font-medium">km</span>
              </div>
            </div>

            {/* 탭 스타일 계산 모드 */}
            <div className="mb-6">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => {
                    setActiveTab('pace');
                    setResult(null);
                  }}
                  className={`flex-1 py-2 px-4 text-center font-semibold transition-colors ${
                    activeTab === 'pace' 
                      ? 'border-b-2 border-[#003366] text-[#003366]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  페이스 계산
                </button>
                <button
                  onClick={() => {
                    setActiveTab('time');
                    setResult(null);
                  }}
                  className={`flex-1 py-2 px-4 text-center font-semibold transition-colors ${
                    activeTab === 'time' 
                      ? 'border-b-2 border-[#003366] text-[#003366]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  목표 시간 계산
                </button>
              </div>

              {/* 페이스 계산 모드 */}
              {activeTab === 'pace' && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FaClock className="text-black" />
                    완주 시간 입력
                  </h4>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                      <input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">초</label>
                      <input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 목표 시간 계산 모드 */}
              {activeTab === 'time' && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FaTachometerAlt className="text-black" />
                    목표 페이스 입력
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                      <input
                        type="number"
                        value={paceMinutes}
                        onChange={(e) => setPaceMinutes(e.target.value)}
                        placeholder="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">초</label>
                      <input
                        type="number"
                        value={paceSeconds}
                        onChange={(e) => setPaceSeconds(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={activeTab === 'pace' ? calculatePace : calculateTime}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                {activeTab === 'pace' ? '페이스 계산하기' : '목표 시간 계산하기'}
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
              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">페이스</div>
                    <div className="text-2xl font-bold text-blue-600">{result.pace}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">속도</div>
                    <div className="text-2xl font-bold text-green-600">{result.speed}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">완주 시간</div>
                    <div className="text-2xl font-bold text-orange-600">{result.time}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">관련 계산기</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="/bmi-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCalculator className="text-blue-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">BMI 계산기</h4>
                <p className="text-sm text-gray-600">체질량지수 계산</p>
              </a>
              
              <a href="/calorie-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaClock className="text-green-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">칼로리 계산기</h4>
                <p className="text-sm text-gray-600">일일 칼로리 계산</p>
              </a>
              
              <a href="/bmr-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTachometerAlt className="text-orange-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">기초대사량 계산기</h4>
                <p className="text-sm text-gray-600">BMR 계산</p>
              </a>
              
              <a href="/ideal-weight-calculator" className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaRunning className="text-purple-600 text-xl" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">이상체중 계산기</h4>
                <p className="text-sm text-gray-600">목표 체중 계산</p>
              </a>
            </div>
          </div>

          {/* 설명 및 주의사항 */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalculator className="text-black" />
                페이스란?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 페이스는 1km를 주파하는 데 걸리는 시간을 의미합니다.</p>
                <p>• 예: 5:30/km는 1km를 5분 30초에 주파한다는 뜻입니다.</p>
                <p>• 마라톤, 하프마라톤 등 장거리 달리기에서 중요한 지표입니다.</p>
                <p>• 개인의 체력과 목표에 맞는 페이스를 설정하는 것이 중요합니다.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaHeart className="text-black" />
                주의사항
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 처음에는 무리하지 말고 천천히 시작하세요.</p>
                <p>• 충분한 휴식과 스트레칭이 중요합니다.</p>
                <p>• 개인의 체력과 건강 상태를 고려하여 목표를 설정하세요.</p>
                <p>• 전문가와 상담 후 훈련 계획을 세우는 것을 권장합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 