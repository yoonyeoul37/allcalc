"use client";

import { useState } from "react";
import { FaPercent, FaCalculator, FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaClock } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaPercent className="text-4xl text-black mr-3" />
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
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  원금 (원)
                </label>
                <input
                  type="text"
                  value={principalDisplay}
                  onChange={handlePrincipalChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 1,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  연 이자율 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 5.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2 text-black" />
                  기간
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                    placeholder="예: 5"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  >
                    <option value="years">년</option>
                    <option value="months">개월</option>
                    <option value="days">일</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-black" />
                  복리 주기
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="annually">연 1회</option>
                  <option value="semi-annually">연 2회(반기)</option>
                  <option value="quarterly">연 4회(분기)</option>
                  <option value="monthly">매월</option>
                  <option value="daily">매일</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateInterest}
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
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <FaMoneyBillWave className="text-2xl text-black mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">원금</h4>
                </div>
                <div className="text-2xl font-bold text-black">
                  {formatCurrency(Number(principal))}원
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <FaPercent className="text-2xl text-black mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">총 이자</h4>
                </div>
                <div className="text-2xl font-bold text-black">
                  {formatCurrency(result?.interestEarned ?? 0)}원
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <FaChartLine className="text-2xl text-black mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">총 수령액</h4>
                </div>
                <div className="text-2xl font-bold text-black">
                  {formatCurrency(result?.totalAmount ?? 0)}원
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <FaCalculator className="text-2xl text-black mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">복리/단리 비교</h4>
                </div>
                <div className="text-base text-gray-700">
                  <span className="font-semibold">단리:</span> {formatCurrency(result?.simpleInterest ?? 0)}원<br />
                  <span className="font-semibold">복리:</span> {formatCurrency(result?.compoundInterest ?? 0)}원
                </div>
              </div>
            </div>

            {/* 월별 상세 내역 */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">월별 복리 내역 (최대 12개월)</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">월</th>
                      <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">원금</th>
                      <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">이자</th>
                      <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">누적금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result?.monthlyBreakdown.map((item) => (
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

          {/* 이자 계산 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">이자 계산 공식</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>단리:</strong> 원금에만 이자가 붙는 방식<br />
                <span className="text-sm">원리금 = 원금 + (원금 × 이자율 × 기간)</span></p>
              <p>• <strong>복리:</strong> 이자가 원금에 더해져 다시 이자를 받는 방식<br />
                <span className="text-sm">원리금 = 원금 × (1 + 이자율/복리주기)<sup>복리주기×기간</sup></span></p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 이자율 및 조건은 금융기관마다 다를 수 있습니다.</p>
              <p>• <strong>세금:</strong> 이자소득세 등 세금이 발생할 수 있습니다.</p>
              <p>• <strong>복리주기:</strong> 실제 상품의 복리주기를 확인하세요.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
