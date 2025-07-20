"use client";

import { useState } from "react";
import { FaHome, FaCalculator, FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaPercent } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [paymentType, setPaymentType] = useState("equal"); // equal, principal, balloon
  const [result, setResult] = useState<MortgageResult | null>(null);
  
  // 입력 필드용 상태 (콤마 표시용)
  const [loanAmountDisplay, setLoanAmountDisplay] = useState("");

  const calculateMortgage = () => {
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
    const amortizationSchedule = [];

    if (paymentType === "equal") {
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

        amortizationSchedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPaid,
          interest,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
    } else if (paymentType === "principal") {
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

        amortizationSchedule.push({
          month,
          payment,
          principal: monthlyPrincipal,
          interest,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
      monthlyPayment = amortizationSchedule[0].payment;
    } else {
      // 만기일시상환
      monthlyPayment = principal * monthlyRate;
      totalPayment = monthlyPayment * totalMonths + principal;
      totalInterest = monthlyPayment * totalMonths;

      const remainingBalance = principal;
      for (let month = 1; month <= Math.min(totalMonths, 12); month++) {
        const interest = remainingBalance * monthlyRate;
        const principalPaid = month === totalMonths ? remainingBalance : 0;

        amortizationSchedule.push({
          month,
          payment: interest + principalPaid,
          principal: principalPaid,
          interest,
          remainingBalance: Math.max(0, remainingBalance - principalPaid)
        });
      }
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal,
      amortizationSchedule
    });
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setLoanAmountDisplay("");
    setInterestRate("");
    setLoanTerm("30");
    setPaymentType("equal");
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaHome className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">주택담보대출 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">월 상환금, 총 이자, 상환 스케줄 계산</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">대출 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  대출금액 (원)
                </label>
                <input
                  type="text"
                  value={loanAmountDisplay}
                  onChange={handleLoanAmountChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 300,000,000"
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
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 3.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  대출기간 (년)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="5">5년</option>
                  <option value="10">10년</option>
                  <option value="15">15년</option>
                  <option value="20">20년</option>
                  <option value="25">25년</option>
                  <option value="30">30년</option>
                  <option value="35">35년</option>
                  <option value="40">40년</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-black" />
                  상환 방식
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="equal">원리금균등상환</option>
                  <option value="principal">원금균등상환</option>
                  <option value="balloon">만기일시상환</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateMortgage}
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
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">월 상환금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.monthlyPayment)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 상환금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.totalPayment)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 이자</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.totalInterest)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaHome className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">대출원금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
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
                      {result.amortizationSchedule.map((item) => (
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
            <h3 className="text-xl font-bold text-gray-800 mb-6">상환 방식 설명</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">원리금균등상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 동일한 금액 상환</li>
                  <li>• 초기에는 이자 비중이 높음</li>
                  <li>• 후기에는 원금 비중이 높아짐</li>
                  <li>• 가장 일반적인 상환 방식</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">원금균등상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 동일한 원금 상환</li>
                  <li>• 이자는 잔액에 따라 감소</li>
                  <li>• 총 이자가 적게 발생</li>
                  <li>• 초기 상환금이 높음</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">만기일시상환</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매월 이자만 상환</li>
                  <li>• 원금은 만기에 일시 상환</li>
                  <li>• 월 상환금이 가장 낮음</li>
                  <li>• 만기 시 큰 금액 필요</li>
                </ul>
              </div>
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
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">일반 대출</p>
              </a>
              
              <a href="/car-loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 대출</h4>
                <p className="text-xs text-gray-600">차량 구매</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">이자율 계산</p>
              </a>
              
              <a href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">통화 변환</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 