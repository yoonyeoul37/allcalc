"use client";

import { useState } from "react";
import { FaClock, FaPlus, FaMinus, FaGlobe, FaCalculator, FaExchangeAlt, FaStopwatch, FaCalendarAlt } from "react-icons/fa";
import Header from '../../components/ui/Header';

export default function TimeCalculator() {
  const [calculationType, setCalculationType] = useState("converter");
  const [seconds, setSeconds] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");
  const [days, setDays] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [timezone1, setTimezone1] = useState("Asia/Seoul");
  const [timezone2, setTimezone2] = useState("America/New_York");
  const [result, setResult] = useState<any>(null);

  const timezones = [
    { value: "Asia/Seoul", label: "서울 (UTC+9)" },
    { value: "America/New_York", label: "뉴욕 (UTC-5)" },
    { value: "Europe/London", label: "런던 (UTC+0)" },
    { value: "Asia/Tokyo", label: "도쿄 (UTC+9)" },
    { value: "America/Los_Angeles", label: "로스앤젤레스 (UTC-8)" },
    { value: "Europe/Paris", label: "파리 (UTC+1)" },
    { value: "Australia/Sydney", label: "시드니 (UTC+10)" },
    { value: "Asia/Shanghai", label: "상하이 (UTC+8)" }
  ];

  const convertTime = () => {
    let totalSeconds = 0;
    
    if (seconds) totalSeconds += parseInt(seconds);
    if (minutes) totalSeconds += parseInt(minutes) * 60;
    if (hours) totalSeconds += parseInt(hours) * 3600;
    if (days) totalSeconds += parseInt(days) * 86400;

    if (totalSeconds === 0) {
      alert("시간을 입력해주세요.");
      return;
    }

    const days_result = Math.floor(totalSeconds / 86400);
    const hours_result = Math.floor((totalSeconds % 86400) / 3600);
    const minutes_result = Math.floor((totalSeconds % 3600) / 60);
    const seconds_result = totalSeconds % 60;

    setResult({
      type: "converter",
      totalSeconds,
      days: days_result,
      hours: hours_result,
      minutes: minutes_result,
      seconds: seconds_result,
      formatted: `${days_result}일 ${hours_result}시간 ${minutes_result}분 ${seconds_result}초`
    });
  };

  const calculateTimeDifference = () => {
    if (!time1 || !time2) {
      alert("두 시간을 모두 입력해주세요.");
      return;
    }

    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    let diffMinutes = (hours2 * 60 + minutes2) - (hours1 * 60 + minutes1);
    
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // 다음날로 가정
    }

    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    setResult({
      type: "difference",
      time1: `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`,
      time2: `${hours2.toString().padStart(2, '0')}:${minutes2.toString().padStart(2, '0')}`,
      diffHours,
      diffMinutes: remainingMinutes,
      totalMinutes: diffMinutes,
      formatted: `${diffHours}시간 ${remainingMinutes}분`
    });
  };

  const addSubtractTime = () => {
    if (!time1 || !time2) {
      alert("시간을 입력해주세요.");
      return;
    }

    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;
    const totalMinutes = totalMinutes1 + totalMinutes2;

    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;

    setResult({
      type: "addSubtract",
      time1: `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`,
      time2: `${hours2.toString().padStart(2, '0')}:${minutes2.toString().padStart(2, '0')}`,
      resultHours,
      resultMinutes,
      totalMinutes,
      formatted: `${resultHours}시간 ${resultMinutes}분`
    });
  };

  const convertTimezone = () => {
    const now = new Date();
    const seoulTime = new Date(now.toLocaleString("en-US", { timeZone: timezone1 }));
    const targetTime = new Date(now.toLocaleString("en-US", { timeZone: timezone2 }));

    const timeDiff = targetTime.getTime() - seoulTime.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    setResult({
      type: "timezone",
      timezone1: timezones.find(tz => tz.value === timezone1)?.label || timezone1,
      timezone2: timezones.find(tz => tz.value === timezone2)?.label || timezone2,
      hoursDiff,
      minutesDiff,
      formatted: `${hoursDiff}시간 ${Math.abs(minutesDiff)}분`
    });
  };

  const resetCalculator = () => {
    setSeconds("");
    setMinutes("");
    setHours("");
    setDays("");
    setTime1("");
    setTime2("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaClock className="text-4xl text-orange-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">시간 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">시간 변환, 시간 계산, 시간대 변환</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setCalculationType("converter")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "converter"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <FaExchangeAlt className="text-2xl mx-auto mb-2" />
                <span className="font-semibold text-sm">시간 변환</span>
              </button>
              
              <button
                onClick={() => setCalculationType("difference")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "difference"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaMinus className="text-2xl mx-auto mb-2" />
                <span className="font-semibold text-sm">시간 차이</span>
              </button>
              
              <button
                onClick={() => setCalculationType("addSubtract")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "addSubtract"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <FaPlus className="text-2xl mx-auto mb-2" />
                <span className="font-semibold text-sm">시간 더하기</span>
              </button>
              
              <button
                onClick={() => setCalculationType("timezone")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "timezone"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <FaGlobe className="text-2xl mx-auto mb-2" />
                <span className="font-semibold text-sm">시간대 변환</span>
              </button>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {calculationType === "converter" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">시간 변환</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">일</label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">시간</label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">분</label>
                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">초</label>
                    <input
                      type="number"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {calculationType === "difference" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">시간 차이 계산</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">시작 시간</label>
                    <input
                      type="time"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">종료 시간</label>
                    <input
                      type="time"
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {calculationType === "addSubtract" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">시간 더하기</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">시간 1</label>
                    <input
                      type="time"
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">시간 2</label>
                    <input
                      type="time"
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {calculationType === "timezone" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">시간대 변환</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">원본 시간대</label>
                    <select
                      value={timezone1}
                      onChange={(e) => setTimezone1(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">대상 시간대</label>
                    <select
                      value={timezone2}
                      onChange={(e) => setTimezone2(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={
                  calculationType === "converter" ? convertTime :
                  calculationType === "difference" ? calculateTimeDifference :
                  calculationType === "addSubtract" ? addSubtractTime :
                  convertTimezone
                }
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">계산 결과</h2>
              
              {result.type === "converter" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center mb-3">
                      <FaClock className="text-2xl text-orange-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">변환 결과</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">총 초:</span>
                        <span className="font-bold text-orange-600 text-xl">{result.totalSeconds.toLocaleString()}초</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">일:</span>
                        <span className="font-bold text-orange-600">{result.days}일</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">시간:</span>
                        <span className="font-bold text-orange-600">{result.hours}시간</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">분:</span>
                        <span className="font-bold text-orange-600">{result.minutes}분</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">초:</span>
                        <span className="font-bold text-orange-600">{result.seconds}초</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaStopwatch className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">포맷된 결과</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.formatted}</div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === "difference" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaMinus className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">시간 정보</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">시작:</span>
                        <span className="font-bold text-blue-600">{result.time1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">종료:</span>
                        <span className="font-bold text-blue-600">{result.time2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaClock className="text-2xl text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">차이</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.formatted}</div>
                      <div className="text-sm text-gray-600 mt-2">총 {result.totalMinutes}분</div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === "addSubtract" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <FaPlus className="text-2xl text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">입력 시간</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">시간 1:</span>
                        <span className="font-bold text-green-600">{result.time1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">시간 2:</span>
                        <span className="font-bold text-green-600">{result.time2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center mb-3">
                      <FaCalculator className="text-2xl text-orange-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">결과</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{result.formatted}</div>
                      <div className="text-sm text-gray-600 mt-2">총 {result.totalMinutes}분</div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === "timezone" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center mb-3">
                      <FaGlobe className="text-2xl text-purple-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">시간대 정보</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">원본:</span>
                        <span className="font-bold text-purple-600 ml-2">{result.timezone1}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">대상:</span>
                        <span className="font-bold text-purple-600 ml-2">{result.timezone2}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center mb-3">
                      <FaClock className="text-2xl text-blue-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">시간 차이</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.formatted}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>시간 변환:</strong> 초, 분, 시간, 일 단위를 서로 변환합니다</p>
              <p>• <strong>시간 차이:</strong> 두 시간 사이의 정확한 차이를 계산합니다</p>
              <p>• <strong>시간 더하기:</strong> 두 시간을 더해서 총 시간을 계산합니다</p>
              <p>• <strong>시간대 변환:</strong> 서로 다른 시간대 간의 차이를 계산합니다</p>
              <p>• <strong>24시간 형식:</strong> 모든 시간은 24시간 형식으로 표시됩니다</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/date-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalendarAlt className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">날짜 계산기</h4>
              </a>
              
              <a href="/age-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-pink-300 cursor-pointer">
                <div className="w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaClock className="text-xl text-pink-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">나이 계산기</h4>
              </a>
              
              <a href="/pace-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaStopwatch className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">페이스 계산기</h4>
              </a>
              
              <a href="/calorie-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">칼로리 계산기</h4>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 