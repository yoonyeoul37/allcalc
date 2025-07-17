"use client";

import { useState } from "react";
import { FaCar, FaCalculator, FaMoneyBillWave, FaChartLine, FaPercent, FaCalendarAlt, FaHome } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface CarLoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  finalBalloonPayment?: number;
  comparisonData?: {
    installment: {
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
    };
    loan: {
      monthlyPayment: number;
      totalPayment: number;
      totalInterest: number;
    };
  };
}

export default function CarLoanCalculator() {
  const [carPrice, setCarPrice] = useState<string>("");
  const [carPriceDisplay, setCarPriceDisplay] = useState<string>("");
  const [downPayment, setDownPayment] = useState<string>("");
  const [downPaymentDisplay, setDownPaymentDisplay] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("60");
  const [carType, setCarType] = useState<string>("new");
  const [financeType, setFinanceType] = useState<string>("installment");
  const [balloonPercent, setBalloonPercent] = useState<string>("30");
  const [isZeroInterest, setIsZeroInterest] = useState<boolean>(false);
  const [result, setResult] = useState<CarLoanResult | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleCarPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setCarPrice(numericValue);
    setCarPriceDisplay(formatNumber(value));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setDownPayment(numericValue);
    setDownPaymentDisplay(formatNumber(value));
  };

  const calculateCarLoan = () => {
    const vehiclePrice = parseFloat(carPrice);
    const downPay = parseFloat(downPayment) || 0;
    const principal = vehiclePrice - downPay;
    const months = parseFloat(loanTerm);
    
    if (vehiclePrice <= 0 || principal <= 0) return;

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;
    let finalBalloonPayment = 0;

    if (isZeroInterest) {
      // 무이자 할부
      if (financeType === "balloon") {
        const balloonAmount = principal * (parseFloat(balloonPercent) / 100);
        const remainingPrincipal = principal - balloonAmount;
        monthlyPayment = remainingPrincipal / months;
        finalBalloonPayment = balloonAmount;
        totalPayment = principal + downPay;
        totalInterest = 0;
      } else {
        monthlyPayment = principal / months;
        totalPayment = principal + downPay;
        totalInterest = 0;
      }
    } else {
      // 유이자 할부/대출
      const monthlyRate = parseFloat(interestRate) / 100 / 12;
      
      if (financeType === "balloon") {
        // 잔가설정형 할부
        const balloonAmount = principal * (parseFloat(balloonPercent) / 100);
        const financingAmount = principal - balloonAmount;
        
        if (monthlyRate > 0) {
          monthlyPayment = (financingAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
        } else {
          monthlyPayment = financingAmount / months;
        }
        
        finalBalloonPayment = balloonAmount;
        totalPayment = (monthlyPayment * months) + balloonAmount + downPay;
        totalInterest = totalPayment - vehiclePrice;
      } else {
        // 일반 할부/대출
        if (monthlyRate > 0) {
          monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
        } else {
          monthlyPayment = principal / months;
        }
        
        totalPayment = (monthlyPayment * months) + downPay;
        totalInterest = totalPayment - vehiclePrice;
      }
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      finalBalloonPayment: financeType === "balloon" ? finalBalloonPayment : undefined
    });
  };

  const calculateComparison = () => {
    const vehiclePrice = parseFloat(carPrice);
    const downPay = parseFloat(downPayment) || 0;
    const principal = vehiclePrice - downPay;
    const months = parseFloat(loanTerm);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    
    if (vehiclePrice <= 0 || principal <= 0) return;

    // 할부 계산 (일반적으로 캐피탈사 금리가 약간 높음)
    const installmentRate = monthlyRate * 1.1; // 할부가 대출보다 약간 높다고 가정
    const installmentMonthly = (principal * installmentRate * Math.pow(1 + installmentRate, months)) / 
                              (Math.pow(1 + installmentRate, months) - 1);
    const installmentTotal = (installmentMonthly * months) + downPay;
    const installmentInterest = installmentTotal - vehiclePrice;

    // 대출 계산
    const loanMonthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
    const loanTotal = (loanMonthly * months) + downPay;
    const loanInterest = loanTotal - vehiclePrice;

    setResult({
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      comparisonData: {
        installment: {
          monthlyPayment: installmentMonthly,
          totalPayment: installmentTotal,
          totalInterest: installmentInterest
        },
        loan: {
          monthlyPayment: loanMonthly,
          totalPayment: loanTotal,
          totalInterest: loanInterest
        }
      }
    });
  };

  const clear = () => {
    setCarPrice("");
    setCarPriceDisplay("");
    setDownPayment("");
    setDownPaymentDisplay("");
    setInterestRate("");
    setLoanTerm("60");
    setCarType("new");
    setFinanceType("installment");
    setBalloonPercent("30");
    setIsZeroInterest(false);
    setResult(null);
  };

  const getRecommendedRate = () => {
    if (carType === "new") {
      return financeType === "installment" ? "4.5" : "3.8";
    } else {
      return financeType === "installment" ? "6.2" : "5.5";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaCar className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">자동차 금융 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">할부 vs 대출, 잔가설정형 할부까지 한번에 비교해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">차량 정보 입력</h3>
            
            {/* 차량 기본 정보 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  차량 가격 (원)
                </label>
                <input
                  type="text"
                  value={carPriceDisplay}
                  onChange={handleCarPriceChange}
                  placeholder="예: 35,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCar className="inline mr-2 text-black" />
                  차량 종류
                </label>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="new">신차</option>
                  <option value="used">중고차</option>
                </select>
              </div>
            </div>

            {/* 금융 옵션 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaChartLine className="inline mr-2 text-black" />
                  금융 종류
                </label>
                <select
                  value={financeType}
                  onChange={(e) => setFinanceType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="installment">할부 (캐피탈)</option>
                  <option value="loan">대출 (은행)</option>
                  <option value="balloon">잔가설정형 할부</option>
                  <option value="comparison">할부 vs 대출 비교</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  할부 기간
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="24">24개월 (2년)</option>
                  <option value="36">36개월 (3년)</option>
                  <option value="48">48개월 (4년)</option>
                  <option value="60">60개월 (5년)</option>
                  <option value="72">72개월 (6년)</option>
                  <option value="84">84개월 (7년)</option>
                </select>
              </div>
              {financeType === "balloon" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPercent className="inline mr-2 text-black" />
                    잔가 비율 (%)
                  </label>
                  <select
                    value={balloonPercent}
                    onChange={(e) => setBalloonPercent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  >
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                  </select>
                </div>
              )}
            </div>

            {/* 금액 설정 */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  계약금/선수금 (원)
                </label>
                <input
                  type="text"
                  value={downPaymentDisplay}
                  onChange={handleDownPaymentChange}
                  placeholder="예: 5,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={isZeroInterest}
                    onChange={(e) => setIsZeroInterest(e.target.checked)}
                    className="mr-2"
                  />
                  무이자 할부
                </label>
                {!isZeroInterest && (
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder={`권장: ${getRecommendedRate()}%`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  />
                )}
                {isZeroInterest && (
                  <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    0% (무이자)
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600 pt-6">
                <p><strong>권장 금리 ({carType === "new" ? "신차" : "중고차"}):</strong></p>
                <p>• 할부: {carType === "new" ? "4~5%" : "6~7%"}</p>
                <p>• 대출: {carType === "new" ? "3~4%" : "5~6%"}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={financeType === "comparison" ? calculateComparison : calculateCarLoan}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
              >
                <FaCalculator className="mr-2" />
                {financeType === "comparison" ? "할부 vs 대출 비교하기" : "계산하기"}
              </button>
              <button
                onClick={clear}
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
              
              {financeType === "comparison" && result.comparisonData ? (
                // 비교 결과
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">할부 (캐피탈)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>월 납입금:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.installment.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 납입금액:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.installment.totalPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 이자:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.installment.totalInterest)}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 border border-gray-200 rounded text-sm bg-white">
                      <p>✓ 딜러에서 즉시 신청</p>
                      <p>✓ 승인이 빠름</p>
                      <p>✗ 완납 시까지 소유권 이전 불가</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">대출 (은행)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>월 상환금:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.loan.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 상환금액:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.loan.totalPayment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>총 이자:</span>
                        <span className="font-bold text-black">{formatCurrency(result.comparisonData.loan.totalInterest)}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 border border-gray-200 rounded text-sm bg-white">
                      <p>✓ 소유권 즉시 이전</p>
                      <p>✓ 조기상환 가능</p>
                      <p>✗ 승인 과정이 복잡</p>
                    </div>
                  </div>
                </div>
              ) : (
                // 일반 결과
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <FaMoneyBillWave className="text-2xl text-black mr-3" />
                      <h4 className="text-lg font-semibold text-gray-800">
                        {financeType === "balloon" ? "월 납입금" : "월 상환금"}
                      </h4>
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {formatCurrency(result.monthlyPayment)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <FaChartLine className="text-2xl text-black mr-3" />
                      <h4 className="text-lg font-semibold text-gray-800">총 납입금액</h4>
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {formatCurrency(result.totalPayment)}
                    </div>
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
                </div>
              )}

              {financeType === "balloon" && result.finalBalloonPayment && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">잔가 납입금</h4>
                  <div className="text-xl font-bold text-black">
                    {formatCurrency(result.finalBalloonPayment)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    할부 종료 후 한 번에 납입하는 금액입니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 자동차 금융 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">자동차 금융이란?</h3>
            <div className="space-y-4 text-gray-600">
              <p>자동차 금융은 차량 구매 시 현금으로 전액 지불하지 않고, 할부나 대출을 통해 차량을 구매하는 방법입니다.</p>
              <p>할부는 캐피탈사를 통해 진행되며, 대출은 은행을 통해 진행됩니다. 각각의 장단점이 있으므로 본인의 상황에 맞는 방법을 선택하세요.</p>
            </div>
          </div>

          {/* 금융 종류 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">금융 종류별 특징</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">할부 (캐피탈)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 딜러에서 즉시 신청 가능</li>
                  <li>• 승인 과정이 빠름</li>
                  <li>• 완납 시까지 소유권 이전 불가</li>
                  <li>• 일반적으로 금리가 높음</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">대출 (은행)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 소유권 즉시 이전</li>
                  <li>• 조기상환 가능</li>
                  <li>• 승인 과정이 복잡</li>
                  <li>• 일반적으로 금리가 낮음</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">잔가설정형 할부</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 월 납입금이 낮음</li>
                  <li>• 만기 시 잔가 납입</li>
                  <li>• 차량 교체 시 유리</li>
                  <li>• 잔가 부담 필요</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 금융 조건은 업체마다 다를 수 있습니다.</p>
              <p>• <strong>신용도:</strong> 개인 신용도에 따라 금리가 달라질 수 있습니다.</p>
              <p>• <strong>차량 가격:</strong> 실제 계약 가격과 다를 수 있습니다.</p>
              <p>• <strong>부대비용:</strong> 보험료, 등록비, 취득세 등이 추가로 발생할 수 있습니다.</p>
              <p>• <strong>조기상환:</strong> 일정 기간 후 조기상환이 가능하지만 수수료가 발생할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 