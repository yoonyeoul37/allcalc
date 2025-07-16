"use client";

import { useState } from "react";
import { FaMoneyBillWave, FaCalculator, FaChartLine, FaPercent, FaCalendarAlt, FaClock } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface RepaymentResult {
  totalPayment: number;
  totalInterest: number;
  monthlyPayment: number;
  principal: number;
  repaymentSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

export default function RepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [repaymentType, setRepaymentType] = useState("equal"); // equal, principal, balloon
  const [result, setResult] = useState<RepaymentResult | null>(null);
  
  // 입력 필드용 상태 (콤마 표시용)
  const [loanAmountDisplay, setLoanAmountDisplay] = useState("");

  const calculateRepayment = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const years = parseInt(loanTerm);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(years)) {
      alert("올바른 숫자를 입력해주세요.");
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;
    const repaymentSchedule = [];

    if (repaymentType === "equal") {
      // 원리금균등상환
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);
      totalPayment = monthlyPayment * totalMonths;
      totalInterest = totalPayment - principal;

      // 상환 스케줄 계산
      let remainingBalance = principal;
      for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
        const interest = remainingBalance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        remainingBalance -= principalPaid;

        repaymentSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPaid,
          interest,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
    } else if (repaymentType === "principal") {
      // 원금균등상환
      const monthlyPrincipal = principal / totalMonths;
      totalPayment = 0;
      totalInterest = 0;

      let remainingBalance = principal;
      for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
        const interest = remainingBalance * monthlyRate;
        const payment = monthlyPrincipal + interest;
        remainingBalance -= monthlyPrincipal;

        totalPayment += payment;
        totalInterest += interest;

        repaymentSchedule.push({
          month,
          payment,
          principal: monthlyPrincipal,
          interest,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
      monthlyPayment = repaymentSchedule[0].payment;
    } else {
      // 만기일시상환
      monthlyPayment = principal * monthlyRate;
      totalPayment = monthlyPayment * totalMonths + principal;
      totalInterest = monthlyPayment * totalMonths;

      let remainingBalance = principal;
      for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
        const interest = remainingBalance * monthlyRate;
        const principalPaid = month === totalMonths ? remainingBalance : 0;

        repaymentSchedule.push({
          month,
          payment: interest + principalPaid,
          principal: principalPaid,
          interest,
          remainingBalance: Math.max(0, remainingBalance - principalPaid)
        });
      }
    }

    setResult({
      totalPayment,
      totalInterest,
      monthlyPayment,
      principal,
      repaymentSchedule
    });
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setLoanAmountDisplay("");
    setInterestRate("");
    setLoanTerm("30");
    setRepaymentType("equal");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(amount));
  };

  // 입력 필드 핸들러 함수
  const formatInputNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setLoanAmount(numericValue);
    setLoanAmountDisplay(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaMoneyBillWave className="text-4xl text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">상환 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">원리금균등상환, 원금균등상환, 만기일시상환 계산</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">대출 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  대출금액 (원)
                </label>
                <input
                  type="text"
                  value={loanAmountDisplay}
                  onChange={handleLoanAmountChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 10,000,000"
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
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 5.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-purple-500" />
                  대출기간 (년)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">1년</option>
                  <option value="2">2년</option>
                  <option value="3">3년</option>
                  <option value="5">5년</option>
                  <option value="7">7년</option>
                  <option value="10">10년</option>
                  <option value="15">15년</option>
                  <option value="20">20년</option>
                  <option value="25">25년</option>
                  <option value="30">30년</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-orange-500" />
                  상환 방식
                </label>
                <select
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="equal">원리금균등상환</option>
                  <option value="principal">원금균등상환</option>
                  <option value="balloon">만기일시상환</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateRepayment}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">상환 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-green-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">월 상환금</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.monthlyPayment)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-blue-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 상환금</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.totalPayment)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-red-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 이자</h4>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.totalInterest)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-purple-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">대출원금</h4>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.principal)}원
                  </div>
                </div>
              </div>

              {/* 상환 스케줄 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">상환 스케줄 (12개월)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">월</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">상환금</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">원금</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">이자</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">잔액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.repaymentSchedule.map((item) => (
                        <tr key={item.month} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.month}개월</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.payment)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.principal)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.interest)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.remainingBalance)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 상환 방식 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">상환 방식별 특징</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">원리금균등상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 동일한 금액 상환</li>
                  <li>• 초기에는 이자 비중이 높음</li>
                  <li>• 후기에는 원금 비중이 높아짐</li>
                  <li>• 가장 일반적인 상환 방식</li>
                  <li>• 월 상환금이 일정하여 계획 수립 용이</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">원금균등상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 동일한 원금 상환</li>
                  <li>• 이자는 잔액에 따라 감소</li>
                  <li>• 총 이자가 적게 발생</li>
                  <li>• 초기 상환금이 높음</li>
                  <li>• 후기로 갈수록 상환금 감소</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">만기일시상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 이자만 상환</li>
                  <li>• 원금은 만기에 일시 상환</li>
                  <li>• 월 상환금이 가장 낮음</li>
                  <li>• 만기 시 큰 금액 필요</li>
                  <li>• 투자나 사업자 대출에 적합</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 상환 방식별 비교 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">상환 방식별 비교</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">구분</th>
                    <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">원리금균등상환</th>
                    <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">원금균등상환</th>
                    <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">만기일시상환</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">월 상환금</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">일정</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">감소</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">최소</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">총 이자</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">중간</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">최소</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">최대</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">초기 부담</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">중간</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">높음</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">낮음</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">적합한 경우</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">일반 대출</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">이자 절약</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">투자/사업</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 대출 조건은 은행마다 다를 수 있습니다.</p>
              <p>• <strong>대출 한도:</strong> 소득, 신용도, 담보가치에 따라 결정됩니다.</p>
              <p>• <strong>이자율:</strong> 시장 상황에 따라 변동될 수 있습니다.</p>
              <p>• <strong>부대비용:</strong> 중개수수료, 등록세, 인지세 등이 추가로 발생할 수 있습니다.</p>
              <p>• <strong>조기상환:</strong> 일정 기간 후 조기상환이 가능하지만 수수료가 발생할 수 있습니다.</p>
              <p>• <strong>상환 계획:</strong> 자신의 소득과 지출을 고려하여 적절한 상환 방식을 선택하세요.</p>
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
                <p className="text-xs text-gray-600">주택 대출</p>
              </a>
              
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">일반 대출</p>
              </a>
              
              <a href="/interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPercent className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이자 계산기</h4>
                <p className="text-xs text-gray-600">이자 계산</p>
              </a>
              
              <a href="/car-loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 대출</h4>
                <p className="text-xs text-gray-600">차량 구매</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 