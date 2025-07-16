"use client";

import { useState } from "react";
import { FaCalculator, FaHeart, FaMoneyBillWave, FaTools, FaRunning } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">페이스 계산기</h1>
            <p className="text-lg text-gray-600">러닝 페이스와 목표 시간을 계산하세요</p>
          </div>

          {/* 페이스 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">거리 입력</h3>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="거리 (km)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                      ? 'border-b-2 border-blue-500 text-blue-600' 
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
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  목표 시간 계산
                </button>
              </div>

              {/* 페이스 계산 모드 */}
              {activeTab === 'pace' && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">완주 시간 입력</h4>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                      <input
                        type="number"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">초</label>
                      <input
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 목표 시간 계산 모드 */}
              {activeTab === 'time' && (
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">목표 페이스 입력</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">분</label>
                      <input
                        type="number"
                        value={paceMinutes}
                        onChange={(e) => setPaceMinutes(e.target.value)}
                        placeholder="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">초</label>
                      <input
                        type="number"
                        value={paceSeconds}
                        onChange={(e) => setPaceSeconds(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={activeTab === 'pace' ? calculatePace : calculateTime}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
              <div className="bg-gray-50 p-6 rounded-lg">
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

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🏃‍♀️ 러닝 앱 추천</h3>
                    <p className="text-sm mb-3">GPS 추적, 페이스 분석, 훈련 계획 제공</p>
                    <button className="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      무료 다운로드 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">👟 러닝화 특가 세일</h3>
                  <p className="text-gray-600 mb-3">나이키, 아디다스, 뉴발란스 최대 70% 할인</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">70% OFF</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">무료배송</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
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
          
          {/* 페이스란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">페이스(Pace)란?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                페이스는 특정 거리를 완주하는데 걸린 시간을 의미합니다. 주로 러닝이나 마라톤에서 사용되며, 
                보통 "분:초/km" 형태로 표현됩니다. 예를 들어, 5분/km 페이스는 1km를 5분에 완주한다는 뜻입니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                페이스는 러너가 훈련 강도를 조절하고 목표를 설정하는데 매우 중요한 지표입니다. 
                현재 페이스를 정확히 파악하면 체계적인 훈련 계획을 세울 수 있습니다.
              </p>
            </div>
          </section>

          {/* 페이스 계산 공식 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">페이스 계산 공식</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800 mb-4">
                  페이스 = 완주시간 ÷ 거리
                </div>
                <div className="text-gray-700">
                  <p className="mb-2"><strong>예시:</strong> 10km를 50분에 완주한 경우</p>
                  <p>페이스 = 50분 ÷ 10km = 5분/km</p>
                </div>
              </div>
            </div>
          </section>

          {/* 일반적인 페이스 표 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">일반적인 러닝 페이스</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">페이스</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">속도</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">수준</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">10km 예상 시간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">3:30 /km</td>
                    <td className="border border-gray-300 px-4 py-3">17.1 km/h</td>
                    <td className="border border-gray-300 px-4 py-3 text-blue-600 font-semibold">엘리트</td>
                    <td className="border border-gray-300 px-4 py-3">35분</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3">4:00 /km</td>
                    <td className="border border-gray-300 px-4 py-3">15.0 km/h</td>
                    <td className="border border-gray-300 px-4 py-3 text-green-600 font-semibold">고급</td>
                    <td className="border border-gray-300 px-4 py-3">40분</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">5:00 /km</td>
                    <td className="border border-gray-300 px-4 py-3">12.0 km/h</td>
                    <td className="border border-gray-300 px-4 py-3 text-yellow-600 font-semibold">중급</td>
                    <td className="border border-gray-300 px-4 py-3">50분</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">6:00 /km</td>
                    <td className="border border-gray-300 px-4 py-3">10.0 km/h</td>
                    <td className="border border-gray-300 px-4 py-3 text-orange-600 font-semibold">초급</td>
                    <td className="border border-gray-300 px-4 py-3">1시간</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">7:00 /km</td>
                    <td className="border border-gray-300 px-4 py-3">8.6 km/h</td>
                    <td className="border border-gray-300 px-4 py-3 text-red-600 font-semibold">입문</td>
                    <td className="border border-gray-300 px-4 py-3">1시간 10분</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 광고 3: 정보 섹션 중간 */}
          <div className="my-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">광고</div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">📱 러닝 GPS 시계</h3>
                <p className="text-sm mb-3">정확한 페이스 측정, 심박수 모니터링</p>
                <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  상품 보기 →
                </button>
              </div>
            </div>
          </div>

          {/* 페이스 훈련 팁 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">페이스 훈련 팁</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">🏃‍♂️ 페이스 훈련</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 목표 페이스로 짧은 구간 반복</li>
                  <li>• 점진적으로 거리 늘리기</li>
                  <li>• 페이스 변화 구간 연습</li>
                  <li>• 정기적인 타임트라이얼</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 마라톤 준비</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 목표 페이스보다 10-15초 빠른 훈련</li>
                  <li>• 장거리 러닝으로 지구력 향상</li>
                  <li>• 페이스 변화에 적응하는 훈련</li>
                  <li>• 레이스 페이스 연습</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 자주 묻는 질문 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">자주 묻는 질문</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Q: 페이스와 속도의 차이는?</h3>
                <p className="text-gray-600">A: 페이스는 시간/거리(분/km), 속도는 거리/시간(km/h)입니다. 페이스가 낮을수록 빠른 것이고, 속도는 높을수록 빠른 것입니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Q: 마라톤 목표 시간을 어떻게 설정하나요?</h3>
                <p className="text-gray-600">A: 10km나 하프마라톤 기록을 바탕으로 예상 완주 시간을 계산할 수 있습니다. 일반적으로 10km 기록의 4.5배 정도가 마라톤 예상 시간입니다.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Q: 페이스 훈련은 얼마나 자주 해야 하나요?</h3>
                <p className="text-gray-600">A: 주 1-2회 정도가 적당합니다. 너무 자주 하면 과훈련의 위험이 있으므로 충분한 회복 시간을 가져야 합니다.</p>
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
                        <div className="text-sm text-gray-600">운동 칼로리 소모량</div>
                      </div>
                    </div>
                  </a>
                  <a href="/bmr-calculator" className="block p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FaTools className="text-blue-500" />
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
            페이스 계산기는 러너들이 훈련과 레이스에서 목표를 설정하고 달성하는데 도움을 주는 도구입니다. 
            정확한 페이스 계산을 통해 체계적인 훈련 계획을 세우고, 개선된 성과를 달성할 수 있습니다.
          </p>
          <p className="mb-4">
            이 계산기는 거리와 시간을 입력하여 페이스를 계산하거나, 목표 페이스와 거리를 입력하여 예상 완주 시간을 계산할 수 있습니다. 
            러닝 초보자부터 마라톤 준비자까지 모든 러너에게 유용한 도구입니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            우리에 대해 | 사이트맵 | 이용 약관 | 개인정보 보호정책 © 2008 - 2025 calculator.net
          </div>
        </div>
      </div>
    </div>
  );
} 