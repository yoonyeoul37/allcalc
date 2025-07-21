"use client";

import { useState } from "react";
import Link from "next/link";
import { FaCar, FaCalculator, FaMoneyBillWave, FaGasPump, FaShieldAlt, FaExchangeAlt, FaPercent, FaCalendarAlt, FaHome } from "react-icons/fa";
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
    if (!carPrice || !interestRate || !loanTerm) {
      alert('차량 가격, 이자율, 대출 기간을 입력해주세요.');
      return;
    }

    const vehiclePrice = parseFloat(carPrice);
    const downPay = parseFloat(downPayment) || 0;
    const principal = vehiclePrice - downPay;
    const months = parseFloat(loanTerm);
    
    if (vehiclePrice <= 0 || principal <= 0) {
      alert('올바른 차량 가격과 계약금을 입력해주세요.');
      return;
    }

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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaCar className="mr-3 text-[#003366]" />
              자동차 대출 계산기
            </h1>
            
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
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
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  계약금 (원)
                </label>
                <input
                  type="text"
                  value={downPaymentDisplay}
                  onChange={handleDownPaymentChange}
                  placeholder="예: 5,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  이자율 (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder={getRecommendedRate()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  대출 기간 (개월)
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="12">12개월</option>
                  <option value="24">24개월</option>
                  <option value="36">36개월</option>
                  <option value="48">48개월</option>
                  <option value="60">60개월</option>
                  <option value="72">72개월</option>
                </select>
              </div>
            </div>

            {/* 금융 타입 선택 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금융 타입
                </label>
                <select
                  value={financeType}
                  onChange={(e) => setFinanceType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="installment">할부</option>
                  <option value="loan">대출</option>
                  <option value="balloon">잔가설정형 할부</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={isZeroInterest}
                    onChange={(e) => setIsZeroInterest(e.target.checked)}
                    className="mr-2"
                  />
                  무이자 할부
                </label>
              </div>
            </div>

            {financeType === "balloon" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  잔가 비율 (%)
                </label>
                <input
                  type="number"
                  value={balloonPercent}
                  onChange={(e) => setBalloonPercent(e.target.value)}
                  placeholder="30"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateCarLoan}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
              >
                계산하기
              </button>
              <button
                onClick={clear}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                초기화
              </button>
            </div>

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">월 상환금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {formatCurrency(result.monthlyPayment)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 상환금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {formatCurrency(result.totalPayment)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 이자</p>
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>
                </div>
                {result.finalBalloonPayment && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">최종 잔가</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(result.finalBalloonPayment)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/automobile-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
              
              <Link href="/automobile-fuel-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGasPump className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">자동차 연비/유류비</h4>
                <p className="text-xs text-gray-600">연비 계산</p>
              </Link>
              
              <Link href="/acquisition-transfer-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/등록세</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
              
              <Link href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
