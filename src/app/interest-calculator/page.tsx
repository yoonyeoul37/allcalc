"use client";

import { useState } from "react";
import { FaPercent, FaCalculator, FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaClock } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface InterestResult {
  simpleInterest: number;
  compoundInterest: number;
  totalAmount: number;
  interestEarned: number;
  monthlyBreakdown: Array<{
    month: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [timeUnit, setTimeUnit] = useState("years");
  const [compoundFrequency, setCompoundFrequency] = useState("monthly");
  const [result, setResult] = useState<InterestResult | null>(null);
  
  // 입력 필드용 상태 (콤마 표시용)
  const [principalDisplay, setPrincipalDisplay] = useState("");

  const calculateInterest = () => {
    if (!principal || !rate || !time) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      alert("올바른 숫자를 입력해주세요.");
      return;
    }

    // 시간을 연 단위로 변환
    let timeInYears = t;
    if (timeUnit === "months") {
      timeInYears = t / 12;
    } else if (timeUnit === "days") {
      timeInYears = t / 365;
    }

    // 단리 이자 계산
    const simpleInterest = p * (r / 100) * timeInYears;
    const simpleTotal = p + simpleInterest;

    // 복리 이자 계산
    let compoundInterest = 0;
    let compoundTotal = 0;

    if (compoundFrequency === "annually") {
      compoundTotal = p * Math.pow(1 + r / 100, timeInYears);
    } else if (compoundFrequency === "semi-annually") {
      compoundTotal = p * Math.pow(1 + r / 200, timeInYears * 2);
    } else if (compoundFrequency === "quarterly") {
      compoundTotal = p * Math.pow(1 + r / 400, timeInYears * 4);
    } else if (compoundFrequency === "monthly") {
      compoundTotal = p * Math.pow(1 + r / 1200, timeInYears * 12);
    } else if (compoundFrequency === "daily") {
      compoundTotal = p * Math.pow(1 + r / 36500, timeInYears * 365);
    }

    compoundInterest = compoundTotal - p;

    // 월별 상세 내역 (복리 기준)
    const monthlyBreakdown = [];
    const months = Math.ceil(timeInYears * 12);
    let currentPrincipal = p;
    const monthlyRate = r / 1200;

    for (let month = 1; month <= Math.min(months, 12); month++) {
      const monthlyInterest = currentPrincipal * monthlyRate;
      currentPrincipal += monthlyInterest;

      monthlyBreakdown.push({
        month,
        principal: currentPrincipal - monthlyInterest,
        interest: monthlyInterest,
        total: currentPrincipal
      });
    }

    setResult({
      simpleInterest,
      compoundInterest,
      totalAmount: compoundTotal,
      interestEarned: compoundInterest,
      monthlyBreakdown
    });
  };

  const resetCalculator = () => {
    setPrincipal("");
    setPrincipalDisplay("");
    setRate("");
    setTime("");
    setTimeUnit("years");
    setCompoundFrequency("monthly");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(amount));
  };

  const formatPercentage = (rate: number) => {
    return rate.toFixed(2);
  };

  // 입력 필드 핸들러 함수
  const formatInputNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPrincipal(numericValue);
    setPrincipalDisplay(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaPercent className="text-4xl text-blue-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">이자 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">단리/복리 이자, 원리금 계산</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">이자 계산 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  원금 (원)
                </label>
                <input
                  type="text"
                  value={principalDisplay}
                  onChange={handlePrincipalChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 1,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-blue-500" />
                  연 이자율 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 5.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-purple-500" />
                  기간
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="예: 5"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="years">년</option>
                    <option value="months">개월</option>
                    <option value="days">일</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-orange-500" />
                  복리 주기
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="annually">연 1회</option>
                  <option value="semi-annually">반기 1회</option>
                  <option value="quarterly">분기 1회</option>
                  <option value="monthly">월 1회</option>
                  <option value="daily">일 1회</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateInterest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-green-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">원금</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(parseFloat(principal))}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-blue-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">이자</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.interestEarned)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-purple-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.totalAmount)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">수익률</h4>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercentage((result.interestEarned / parseFloat(principal)) * 100)}%
                  </div>
                </div>
              </div>

              {/* 단리 vs 복리 비교 */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">단리 이자</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이자:</span>
                      <span className="font-semibold">{formatCurrency(result.simpleInterest)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 금액:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(principal) + result.simpleInterest)}원</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">복리 이자</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이자:</span>
                      <span className="font-semibold">{formatCurrency(result.compoundInterest)}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 금액:</span>
                      <span className="font-semibold">{formatCurrency(result.totalAmount)}원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 월별 상세 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">월별 상세 내역 (복리)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">월</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">원금</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">이자</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">총액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.monthlyBreakdown.map((item) => (
                        <tr key={item.month} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.month}개월</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.principal)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.interest)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.total)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 이자 계산 방식 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">이자 계산 방식</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">단리 이자</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 원금에 대해서만 이자 계산</li>
                  <li>• 매년 동일한 이자 발생</li>
                  <li>• 공식: 이자 = 원금 × 이자율 × 기간</li>
                  <li>• 예금, 적금 등에서 사용</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">복리 이자</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 원금 + 이자에 대해 이자 계산</li>
                  <li>• 시간이 지날수록 이자 증가</li>
                  <li>• 공식: 총액 = 원금 × (1 + 이자율)^기간</li>
                  <li>• 투자, 예금 등에서 사용</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 복리 주기 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">복리 주기별 차이</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">월 복리</h4>
                <p className="text-sm text-gray-600">매월 이자가 원금에 추가되어 다음 달 이자 계산에 반영됩니다. 가장 일반적인 복리 방식입니다.</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">연 복리</h4>
                <p className="text-sm text-gray-600">1년에 한 번 이자가 원금에 추가됩니다. 복리 주기가 길수록 총 이자가 적어집니다.</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">일 복리</h4>
                <p className="text-sm text-gray-600">매일 이자가 원금에 추가됩니다. 복리 주기가 짧을수록 총 이자가 많아집니다.</p>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 금융상품의 이자율과 조건은 다를 수 있습니다.</p>
              <p>• <strong>세금:</strong> 이자소득세가 적용될 수 있습니다 (일정 금액 초과 시).</p>
              <p>• <strong>수수료:</strong> 은행 수수료, 관리비 등이 추가로 발생할 수 있습니다.</p>
              <p>• <strong>이자율 변동:</strong> 시장 상황에 따라 이자율이 변동될 수 있습니다.</p>
              <p>• <strong>조기 해지:</strong> 만기 전 해지 시 이자율이 낮아질 수 있습니다.</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 이자</p>
              </a>
              
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">원리금 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
              
              <a href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">통화 변환</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 