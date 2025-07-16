"use client";

import { useState } from "react";
import { FaCar, FaCalculator, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">자동차 금융 계산기</h1>
            <p className="text-lg text-gray-600">할부 vs 대출, 잔가설정형 할부까지 한번에 비교해보세요</p>
          </div>

          {/* 자동차 금융 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            
            {/* 차량 기본 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">차량 정보</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">차량 가격 (원)</label>
                  <input
                    type="text"
                    value={carPriceDisplay}
                    onChange={handleCarPriceChange}
                    placeholder="예: 35,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">차량 종류</label>
                  <select
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="new">신차</option>
                    <option value="used">중고차</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 금융 옵션 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">금융 옵션</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">금융 종류</label>
                  <select
                    value={financeType}
                    onChange={(e) => setFinanceType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  >
                    <option value="installment">할부 (캐피탈)</option>
                    <option value="loan">대출 (은행)</option>
                    <option value="balloon">잔가설정형 할부</option>
                    <option value="comparison">할부 vs 대출 비교</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">할부 기간</label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">잔가 비율 (%)</label>
                    <select
                      value={balloonPercent}
                      onChange={(e) => setBalloonPercent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                    >
                      <option value="20">20%</option>
                      <option value="30">30%</option>
                      <option value="40">40%</option>
                      <option value="50">50%</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* 금액 설정 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">금액 설정</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">계약금/선수금 (원)</label>
                  <input
                    type="text"
                    value={downPaymentDisplay}
                    onChange={handleDownPaymentChange}
                    placeholder="예: 5,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                    />
                  )}
                  {isZeroInterest && (
                    <div className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-lg">
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
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={financeType === "comparison" ? calculateComparison : calculateCarLoan}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {financeType === "comparison" ? "할부 vs 대출 비교하기" : "계산하기"}
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
                {financeType === "comparison" && result.comparisonData ? (
                  // 비교 결과
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">할부 vs 대출 비교</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">할부 (캐피탈)</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>월 납입금:</span>
                            <span className="font-bold">{formatCurrency(result.comparisonData.installment.monthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>총 납입금액:</span>
                            <span className="font-bold">{formatCurrency(result.comparisonData.installment.totalPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>총 이자:</span>
                            <span className="font-bold text-red-600">{formatCurrency(result.comparisonData.installment.totalInterest)}</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 border border-gray-200 rounded text-sm">
                          <p>✓ 딜러에서 즉시 신청</p>
                          <p>✓ 승인이 빠름</p>
                          <p>✗ 완납 시까지 소유권 이전 불가</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">대출 (은행)</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>월 상환금:</span>
                            <span className="font-bold">{formatCurrency(result.comparisonData.loan.monthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>총 상환금액:</span>
                            <span className="font-bold">{formatCurrency(result.comparisonData.loan.totalPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>총 이자:</span>
                            <span className="font-bold text-red-600">{formatCurrency(result.comparisonData.loan.totalInterest)}</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 border border-gray-200 rounded text-sm">
                          <p>✓ 낮은 금리</p>
                          <p>✓ 즉시 소유권 이전</p>
                          <p>✗ 별도 대출 신청 필요</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-lg font-bold text-green-700">
                        절약 금액: {formatCurrency(result.comparisonData.installment.totalPayment - result.comparisonData.loan.totalPayment)}
                        <span className="text-sm font-normal"> (대출이 유리)</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  // 일반 계산 결과
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">계산 결과</h3>
                    
                    {/* 선택 옵션 표시 */}
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-700 text-center">
                        <span className="font-semibold">
                          {carType === "new" ? "신차" : "중고차"} • 
                          {financeType === "installment" && " 할부"}
                          {financeType === "loan" && " 대출"}
                          {financeType === "balloon" && " 잔가설정형 할부"}
                        </span>
                        {" • "}
                        <span className="font-semibold">{loanTerm}개월</span>
                        {isZeroInterest && (
                          <>
                            {" • "}
                            <span className="font-semibold text-green-600">무이자</span>
                          </>
                        )}
                        {financeType === "balloon" && (
                          <>
                            {" • "}
                            <span className="font-semibold text-gray-700">잔가 {balloonPercent}%</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">월 납입금</div>
                        <div className="text-2xl font-bold text-gray-800">
                          {formatCurrency(result.monthlyPayment)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">총 이자</div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(result.totalInterest)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border">
                        <div className="text-sm text-gray-600 mb-1">총 납입금액</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(result.totalPayment)}
                        </div>
                      </div>
                    </div>

                    {/* 잔가설정형 할부 추가 정보 */}
                    {financeType === "balloon" && result.finalBalloonPayment && (
                      <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                        <h4 className="font-bold text-gray-700 mb-2">계약 만료 시 선택사항</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white p-3 rounded">
                            <p className="font-semibold">1. 잔가 지불 후 소유</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(result.finalBalloonPayment!)}</p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-semibold">2. 차량 반납</p>
                            <p className="text-gray-600">추가 비용 없음 (정상 마모 시)</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 광고 1: 계산 결과 바로 아래 */}
            {result && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">광고</div>
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">🚗 자동차 보험 비교</h3>
                    <p className="text-sm mb-3">국내 모든 보험사 보험료 실시간 비교</p>
                    <button className="bg-white text-gray-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                      보험료 비교하기 →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 광고 2: 계산기와 정보 섹션 사이 */}
      <div className="w-full px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-gray-500 mb-3">스폰서 광고</div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">🏎️ 중고차 매매 플랫폼</h3>
                  <p className="text-gray-600 mb-3">전국 중고차 실시간 시세 조회 + 무료 차량 진단</p>
                  <div className="flex gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">실시간 시세</span>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">무료 진단</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                    차량 조회하기
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
          
          {/* 자동차 금융이란? */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">자동차 금융 완전 가이드</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                자동차를 구매할 때 현금 일시불이 어려우면 할부나 대출을 이용할 수 있습니다. 
                한국에서는 할부금융사(캐피탈)를 통한 할부가 가장 일반적이며, 은행 대출보다 절차가 간단합니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                각각의 장단점을 비교해보고 본인 상황에 맞는 최적의 방법을 선택하세요.
              </p>
            </div>
          </section>

          {/* 할부 vs 대출 비교 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">할부 vs 대출 완벽 비교</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">할부 (캐피탈)</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>딜러에서 즉시 신청 가능</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>승인이 빠름 (당일 가능)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>신용등급 조건이 관대</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>금리가 상대적으로 높음</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>완납 전까지 소유권 제한</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">대출 (은행)</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>금리가 상대적으로 낮음</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>즉시 차량 소유권 취득</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>중도상환 수수료 없음</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>별도 대출 신청 필요</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">✗</span>
                    <span>신용등급 요구사항 높음</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 잔가설정형 할부 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">잔가설정형 할부란?</h2>
            <div className="p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4">
                <strong>잔가설정형 할부</strong>는 계약 만료 시점의 차량 예상 가치(잔가)를 미리 정하고, 
                차량 가격에서 잔가를 뺀 금액만 할부로 납입하는 방식입니다.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">장점</h4>
                  <ul className="space-y-2">
                    <li>• 월 납입금이 저렴함</li>
                    <li>• 초기 부담 적음</li>
                    <li>• 신차 교체 주기가 짧은 분에게 유리</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">주의사항</h4>
                  <ul className="space-y-2">
                    <li>• 계약 만료 시 잔가 지불 또는 반납 선택</li>
                    <li>• 차량 상태에 따른 추가 비용 발생 가능</li>
                    <li>• 주행거리 제한 있음</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 무이자 할부 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">무이자 할부 이벤트</h2>
            <div className="p-6 rounded-lg border border-gray-200">
              <p className="text-gray-700 mb-4">
                자동차 제조사에서 판매 촉진을 위해 무이자 할부 이벤트를 진행하는 경우가 있습니다. 
                이자 부담이 없어 매우 유리하지만 몇 가지 조건이 있습니다.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">무이자 할부 조건</h4>
                  <ul className="space-y-2">
                    <li>• 특정 차종에만 적용</li>
                    <li>• 할부 기간 제한 (보통 24~60개월)</li>
                    <li>• 최소 계약금 조건</li>
                    <li>• 이벤트 기간 한정</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">체크 포인트</h4>
                  <ul className="space-y-2">
                    <li>• 차량 가격 할인 vs 무이자 할부 비교</li>
                    <li>• 유이자 할부 + 현금 할인과 비교</li>
                    <li>• 중도해지 시 수수료 확인</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 광고 3: 정보 섹션 중간 */}
          <div className="mb-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-4">Google AdSense</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔧</div>
                    <h4 className="font-semibold text-gray-800 mb-1">자동차 정비소</h4>
                    <p className="text-sm text-gray-600 mb-2">믿을 수 있는 정비소 찾기</p>
                    <div className="text-orange-600 text-sm font-semibold">예약하기</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⛽</div>
                    <h4 className="font-semibold text-gray-800 mb-1">주유소 할인</h4>
                    <p className="text-sm text-gray-600 mb-2">전국 주유소 실시간 가격</p>
                    <div className="text-green-600 text-sm font-semibold">할인받기</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 금리 정보 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">2024년 자동차 금융 금리</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">구분</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">신차</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">중고차</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">특징</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">할부 (캐피탈)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">연 4~6%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">연 6~8%</td>
                    <td className="border border-gray-300 px-4 py-2">딜러 직접 신청</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">은행 대출</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">연 3~5%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">연 5~7%</td>
                    <td className="border border-gray-300 px-4 py-2">신용등급별 차등</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">무이자 할부</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">0%</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                    <td className="border border-gray-300 px-4 py-2">제조사 이벤트</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              * 금리는 신용등급, 소득, 차량 가격 등에 따라 달라질 수 있습니다.
            </p>
          </section>

          {/* 관련 계산기 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">관련 계산기</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FaMoneyBillWave className="text-2xl text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">대출 계산기</h3>
                  <p className="text-sm text-gray-600">주택, 신용대출 계산</p>
                </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaChartLine className="text-2xl text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">복리 계산기</h3>
                <p className="text-sm text-gray-600">투자 수익률 계산</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                      <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaCalculator className="text-2xl text-gray-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">세금 계산기</h3>
                <p className="text-sm text-gray-600">취득세, 등록세 계산</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaCar className="text-2xl text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">차량 유지비 계산기</h3>
                <p className="text-sm text-gray-600">연간 유지비 계산</p>
              </div>
            </div>
          </section>
            </div>
            
            {/* 사이드바 광고 (데스크톱 전용) */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-8 space-y-6">
                {/* 광고 4: 사이드바 배너 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-3">추천 광고</div>
                    <div className="bg-gradient-to-b from-orange-400 to-red-500 text-white p-6 rounded-lg mb-4">
                      <h4 className="font-bold text-lg mb-2">🚙 렌터카</h4>
                      <p className="text-sm mb-3">전국 렌터카 최저가 비교</p>
                      <button className="bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-semibold w-full">
                        예약하기
                      </button>
                    </div>
                  </div>
                </div>

                {/* 광고 5: 네이티브 광고 */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <div className="text-xs text-gray-500 mb-4">스폰서</div>
                  <div className="space-y-4">
                                         <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                       <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                         🏦
                       </div>
                       <div className="flex-1">
                         <h5 className="font-semibold text-sm">자동차 대출</h5>
                         <p className="text-xs text-gray-600">최저금리 3.5%</p>
                       </div>
                     </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        🛡️
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">자동차 보험</h5>
                        <p className="text-xs text-gray-600">보험료 50% 할인</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                         🔍
                       </div>
                       <div className="flex-1">
                         <h5 className="font-semibold text-sm">차량 조회</h5>
                         <p className="text-xs text-gray-600">사고이력 무료 조회</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-200 p-6 text-sm text-gray-700 leading-relaxed">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4">
            이 자동차 금융 계산기는 일반적인 할부 및 대출 조건을 기준으로 계산됩니다. 
            실제 금리와 조건은 금융사별, 개인 신용등급별로 다를 수 있으므로 정확한 조건은 해당 금융기관에 문의하시기 바랍니다.
          </p>
          <div className="text-center text-xs text-gray-500">
            © 2025 AllCalc - 무료 온라인 계산기
          </div>
        </div>
      </div>
    </div>
  );
} 