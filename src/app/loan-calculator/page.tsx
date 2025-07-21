"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCalculator, FaMoneyBillWave, FaHome, FaChartLine, FaPercent, FaCalendarAlt } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanAmountDisplay, setLoanAmountDisplay] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [loanType, setLoanType] = useState<string>("mortgage");
  const [repaymentType, setRepaymentType] = useState<string>("equal_payment");
  const [graceMonth, setGraceMonth] = useState<string>("0");
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const totalMonths = parseFloat(loanTerm) * 12;
    const graceMonths = parseInt(graceMonth);

    if (principal > 0 && monthlyRate > 0 && totalMonths > 0) {
      let monthlyPayment = 0;
      let totalInterest = 0;
      let totalPayment = 0;

      if (repaymentType === "equal_payment") {
        // 원리금균등상환
        const paymentMonths = totalMonths - graceMonths;
        
        if (graceMonths > 0) {
          // 거치기간 동안의 이자
          const graceInterest = principal * monthlyRate * graceMonths;
          
          // 거치기간 후 상환
          monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, paymentMonths)) / 
                          (Math.pow(1 + monthlyRate, paymentMonths) - 1);
          
          totalPayment = (monthlyPayment * paymentMonths) + graceInterest;
          totalInterest = totalPayment - principal;
        } else {
          monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);
          totalPayment = monthlyPayment * totalMonths;
          totalInterest = totalPayment - principal;
        }
        
      } else if (repaymentType === "equal_principal") {
        // 원금균등상환
        const paymentMonths = totalMonths - graceMonths;
        const principalPayment = principal / paymentMonths;
        
        // 첫 달 상환금 (원금 + 이자)
        monthlyPayment = principalPayment + (principal * monthlyRate);
        
        // 총 이자 계산
        totalInterest = (principal * monthlyRate * (paymentMonths + 1)) / 2;
        
        if (graceMonths > 0) {
          totalInterest += principal * monthlyRate * graceMonths;
        }
        
        totalPayment = principal + totalInterest;
        
      } else if (repaymentType === "maturity") {
        // 만기일시상환
        monthlyPayment = principal * monthlyRate; // 매월 이자만
        totalInterest = monthlyPayment * totalMonths;
        totalPayment = principal + totalInterest;
      }

      setResult({
        monthlyPayment,
        totalInterest,
        totalPayment
      });
    }
  };

  const clear = () => {
    setLoanAmount("");
    setLoanAmountDisplay("");
    setInterestRate("");
    setLoanTerm("");
    setLoanType("mortgage");
    setRepaymentType("equal_payment");
    setGraceMonth("0");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatNumber = (value: string) => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (!numericValue) return '';
    
    // 콤마 추가
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setLoanAmount(numericValue);
    setLoanAmountDisplay(formatNumber(value));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaMoneyBillWave className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">대출 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">월 상환금액과 총 이자를 계산하여 대출 계획을 세워보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">대출 정보 입력</h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaHome className="inline mr-2 text-black" />
                  대출종류
                </label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="mortgage">주택담보대출</option>
                  <option value="credit">신용대출</option>
                  <option value="auto">자동차대출</option>
                  <option value="jeonse">전세대출</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-black" />
                  상환방식
                </label>
                <select
                  value={repaymentType}
                  onChange={(e) => setRepaymentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="equal_payment">원리금균등상환</option>
                  <option value="equal_principal">원금균등상환</option>
                  <option value="maturity">만기일시상환</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  거치기간 (개월)
                </label>
                <select
                  value={graceMonth}
                  onChange={(e) => setGraceMonth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="0">없음</option>
                  <option value="6">6개월</option>
                  <option value="12">12개월</option>
                  <option value="24">24개월</option>
                  <option value="36">36개월</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  대출금액 (원)
                </label>
                <input
                  type="text"
                  value={loanAmountDisplay}
                  onChange={handleLoanAmountChange}
                  placeholder="예: 300,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  연이율 (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="예: 3.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  대출기간 (년)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="예: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateLoan}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={clear}
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
              
              {/* 선택된 옵션 표시 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-700 text-center">
                  <span className="font-semibold">
                    {loanType === "mortgage" && "주택담보대출"}
                    {loanType === "credit" && "신용대출"}
                    {loanType === "auto" && "자동차대출"}
                    {loanType === "jeonse" && "전세대출"}
                  </span>
                  {" · "}
                  <span className="font-semibold">
                    {repaymentType === "equal_payment" && "원리금균등상환"}
                    {repaymentType === "equal_principal" && "원금균등상환"}
                    {repaymentType === "maturity" && "만기일시상환"}
                  </span>
                  {graceMonth !== "0" && (
                    <>
                      {" · "}
                      <span className="font-semibold text-black">거치기간 {graceMonth}개월</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">
                      {repaymentType === "equal_principal" ? "첫 달 상환금액" : 
                       repaymentType === "maturity" ? "월 이자" : "월 상환금액"}
                    </h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.monthlyPayment)}
                  </div>
                  {repaymentType === "equal_principal" && (
                    <div className="text-xs text-gray-500 mt-2">
                      (매월 감소)
                    </div>
                  )}
                  {repaymentType === "maturity" && (
                    <div className="text-xs text-gray-500 mt-2">
                      (원금은 만기에 일시상환)
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 이자</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.totalInterest)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 상환금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatCurrency(result.totalPayment)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 대출 계산기 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">대출 계산기란?</h3>
            <div className="space-y-4 text-gray-600">
              <p>대출 계산기는 대출 원금, 이자율, 상환 기간을 입력하여 월 상환금액과 총 이자를 미리 계산해볼 수 있는 도구입니다.</p>
              <p>주택담보대출, 신용대출, 자동차대출 등 다양한 대출 상품의 상환 계획을 세우는 데 도움이 됩니다.</p>
              <p>대출을 받기 전에 미리 상환 능력을 검토하고, 여러 은행의 조건을 비교해보실 수 있습니다.</p>
            </div>
          </div>

          {/* 대출 상환 방식 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">대출 상환 방식</h3>
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
              <Link href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">주택 구매</p>
              </Link>
              
              <Link href="/car-loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 대출</h4>
                <p className="text-xs text-gray-600">차량 구매</p>
              </Link>
              
              <Link href="/interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이자 계산기</h4>
                <p className="text-xs text-gray-600">이자율 계산</p>
              </Link>
              
              <Link href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
