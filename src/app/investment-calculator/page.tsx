"use client";

import { useState } from "react";
import { FaChartLine, FaCalculator, FaDollarSign, FaCalendarAlt, FaPercent, FaBullseye, FaHistory, FaChartBar, FaHome, FaMoneyBillWave } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface InvestmentResult {
  initialAmount: number;
  finalAmount: number;
  totalReturn: number;
  totalReturnPercent: number;
  interestEarned: number;
  years: number;
}

interface CompoundResult {
  year: number;
  balance: number;
  interest: number;
  totalInterest: number;
}

export default function InvestmentCalculator() {
  const [activeTab, setActiveTab] = useState('roi');
  const [roiInitial, setRoiInitial] = useState('');
  const [roiFinal, setRoiFinal] = useState('');
  const [roiPeriod, setRoiPeriod] = useState('');
  const [compoundInitial, setCompoundInitial] = useState('');
  const [compoundMonthly, setCompoundMonthly] = useState('');
  const [compoundRate, setCompoundRate] = useState('');
  const [compoundYears, setCompoundYears] = useState('');
  const [targetInitial, setTargetInitial] = useState('');
  const [targetMonthly, setTargetMonthly] = useState('');
  const [targetRate, setTargetRate] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [periodInitial, setPeriodInitial] = useState('');
  const [periodMonthly, setPeriodMonthly] = useState('');
  const [periodRate, setPeriodRate] = useState('');
  const [periodTarget, setPeriodTarget] = useState('');

  // 입력 필드용 상태 (콤마 표시용)
  const [roiInitialDisplay, setRoiInitialDisplay] = useState('');
  const [roiFinalDisplay, setRoiFinalDisplay] = useState('');
  const [compoundInitialDisplay, setCompoundInitialDisplay] = useState('');
  const [compoundMonthlyDisplay, setCompoundMonthlyDisplay] = useState('');
  const [targetInitialDisplay, setTargetInitialDisplay] = useState('');
  const [targetMonthlyDisplay, setTargetMonthlyDisplay] = useState('');
  const [targetAmountDisplay, setTargetAmountDisplay] = useState('');
  const [periodInitialDisplay, setPeriodInitialDisplay] = useState('');
  const [periodMonthlyDisplay, setPeriodMonthlyDisplay] = useState('');
  const [periodTargetDisplay, setPeriodTargetDisplay] = useState('');

  const calculateROI = () => {
    if (!roiInitial || !roiFinal || !roiPeriod) return null;
    
    const initial = parseFloat(roiInitial);
    const final = parseFloat(roiFinal);
    const period = parseFloat(roiPeriod);
    
    if (initial <= 0 || period <= 0) return null;
    
    const totalReturn = final - initial;
    const totalReturnPercent = (totalReturn / initial) * 100;
    const annualizedROI = Math.pow(final / initial, 1 / period) - 1;
    const annualizedROIPercent = annualizedROI * 100;
    
    return {
      totalReturn,
      totalReturnPercent,
      annualizedROI,
      annualizedROIPercent
    };
  };

  const calculateCompoundInterest = () => {
    if (!compoundInitial || !compoundMonthly || !compoundRate || !compoundYears) return null;
    
    const initial = parseFloat(compoundInitial);
    const monthly = parseFloat(compoundMonthly);
    const rate = parseFloat(compoundRate) / 100;
    const years = parseFloat(compoundYears);
    
    if (initial < 0 || monthly < 0 || rate < 0 || years < 0) return null;
    
    const monthlyRate = rate / 12;
    const months = years * 12;
    
    // Future value of initial investment
    const futureValueInitial = initial * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    const futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const finalAmount = futureValueInitial + futureValueMonthly;
    const totalContributed = initial + (monthly * months);
    const interestEarned = finalAmount - totalContributed;
    
    const schedule: CompoundResult[] = [];
    let balance = initial;
    let totalInterest = 0;
    
    for (let year = 1; year <= years; year++) {
      const yearStartBalance = balance;
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + monthly;
      }
      const yearInterest = balance - yearStartBalance - (monthly * 12);
      totalInterest += yearInterest;
      schedule.push({
        year,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round(yearInterest * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100
      });
    }
    
    return {
      finalAmount: Math.round(finalAmount * 100) / 100,
      totalContributed: Math.round(totalContributed * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      schedule
    };
  };

  const calculateTargetAmount = () => {
    if (!targetInitial || !targetMonthly || !targetRate || !targetAmount) return null;
    
    const initial = parseFloat(targetInitial);
    const monthly = parseFloat(targetMonthly);
    const rate = parseFloat(targetRate) / 100;
    const target = parseFloat(targetAmount);
    
    if (initial < 0 || monthly < 0 || rate < 0 || target < 0) return null;
    
    const monthlyRate = rate / 12;
    
    // Calculate required years using iterative approach
    let years = 0;
    let balance = initial;
    const maxYears = 100;
    
    while (balance < target && years < maxYears) {
      years++;
      balance = balance * (1 + monthlyRate) + monthly;
    }
    
    if (years >= maxYears) return null;
    
    return {
      years: Math.round(years * 100) / 100,
      finalBalance: Math.round(balance * 100) / 100
    };
  };

  const calculateInvestmentPeriod = () => {
    if (!periodInitial || !periodMonthly || !periodRate || !periodTarget) return null;
    
    const initial = parseFloat(periodInitial);
    const monthly = parseFloat(periodMonthly);
    const rate = parseFloat(periodRate) / 100;
    const target = parseFloat(periodTarget);
    
    if (initial < 0 || monthly < 0 || rate < 0 || target < 0) return null;
    
    const monthlyRate = rate / 12;
    
    // Calculate required years using iterative approach
    let years = 0;
    let balance = initial;
    const maxYears = 100;
    
    while (balance < target && years < maxYears) {
      years++;
      balance = balance * (1 + monthlyRate) + monthly;
    }
    
    if (years >= maxYears) return null;
    
    return {
      years: Math.round(years * 100) / 100,
      finalBalance: Math.round(balance * 100) / 100
    };
  };

  const roiResult = calculateROI();
  const compoundResult = calculateCompoundInterest();
  const targetResult = calculateTargetAmount();
  const periodResult = calculateInvestmentPeriod();

  // 금액 포맷팅 함수
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 입력 필드 핸들러 함수들
  const formatInputNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleRoiInitialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setRoiInitial(numericValue);
    setRoiInitialDisplay(formatInputNumber(value));
  };

  const handleRoiFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setRoiFinal(numericValue);
    setRoiFinalDisplay(formatInputNumber(value));
  };

  const handleCompoundInitialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setCompoundInitial(numericValue);
    setCompoundInitialDisplay(formatInputNumber(value));
  };

  const handleCompoundMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setCompoundMonthly(numericValue);
    setCompoundMonthlyDisplay(formatInputNumber(value));
  };

  const handleTargetInitialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setTargetInitial(numericValue);
    setTargetInitialDisplay(formatInputNumber(value));
  };

  const handleTargetMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setTargetMonthly(numericValue);
    setTargetMonthlyDisplay(formatInputNumber(value));
  };

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setTargetAmount(numericValue);
    setTargetAmountDisplay(formatInputNumber(value));
  };

  const handlePeriodInitialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPeriodInitial(numericValue);
    setPeriodInitialDisplay(formatInputNumber(value));
  };

  const handlePeriodMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPeriodMonthly(numericValue);
    setPeriodMonthlyDisplay(formatInputNumber(value));
  };

  const handlePeriodTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setPeriodTarget(numericValue);
    setPeriodTargetDisplay(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaChartLine className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">투자 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">ROI, 복리, 목표금액, 투자기간 계산</p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('roi')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'roi' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ROI 계산
              </button>
              <button
                onClick={() => setActiveTab('compound')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'compound' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                복리 계산
              </button>
              <button
                onClick={() => setActiveTab('target')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'target' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                목표금액 계산
              </button>
              <button
                onClick={() => setActiveTab('period')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'period' 
                    ? 'bg-[#003366] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                투자기간 계산
              </button>
            </div>

            {/* ROI 계산 탭 */}
            {activeTab === 'roi' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">ROI (투자수익률) 계산</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      초기 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={roiInitialDisplay}
                      onChange={handleRoiInitialChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 1,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      최종 금액 (원)
                    </label>
                    <input
                      type="text"
                      value={roiFinalDisplay}
                      onChange={handleRoiFinalChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 1,200,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-black" />
                      투자 기간 (년)
                    </label>
                    <input
                      type="number"
                      value={roiPeriod}
                      onChange={(e) => setRoiPeriod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 복리 계산 탭 */}
            {activeTab === 'compound' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">복리 계산</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      초기 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={compoundInitialDisplay}
                      onChange={handleCompoundInitialChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 1,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      월 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={compoundMonthlyDisplay}
                      onChange={handleCompoundMonthlyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 100,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPercent className="inline mr-2 text-black" />
                      연 이율 (%)
                    </label>
                    <input
                      type="number"
                      value={compoundRate}
                      onChange={(e) => setCompoundRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2 text-black" />
                      투자 기간 (년)
                    </label>
                    <input
                      type="number"
                      value={compoundYears}
                      onChange={(e) => setCompoundYears(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 목표금액 계산 탭 */}
            {activeTab === 'target' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">목표금액 달성 기간 계산</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      초기 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={targetInitialDisplay}
                      onChange={handleTargetInitialChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 1,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      월 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={targetMonthlyDisplay}
                      onChange={handleTargetMonthlyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 100,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPercent className="inline mr-2 text-black" />
                      연 이율 (%)
                    </label>
                    <input
                      type="number"
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBullseye className="inline mr-2 text-black" />
                      목표금액 (원)
                    </label>
                    <input
                      type="text"
                      value={targetAmountDisplay}
                      onChange={handleTargetAmountChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 50,000,000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 투자기간 계산 탭 */}
            {activeTab === 'period' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">투자기간 계산</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      초기 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={periodInitialDisplay}
                      onChange={handlePeriodInitialChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 1,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2 text-black" />
                      월 투자금액 (원)
                    </label>
                    <input
                      type="text"
                      value={periodMonthlyDisplay}
                      onChange={handlePeriodMonthlyChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 100,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPercent className="inline mr-2 text-black" />
                      연 이율 (%)
                    </label>
                    <input
                      type="number"
                      value={periodRate}
                      onChange={(e) => setPeriodRate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBullseye className="inline mr-2 text-black" />
                      목표금액 (원)
                    </label>
                    <input
                      type="text"
                      value={periodTargetDisplay}
                      onChange={handlePeriodTargetChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                      placeholder="예: 50,000,000"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 계산 결과 */}
          {activeTab === 'roi' && roiResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">ROI 계산 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaDollarSign className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 수익</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(roiResult.totalReturn)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">수익률</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{roiResult.totalReturnPercent.toFixed(2)}%</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">연평균 수익률</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{roiResult.annualizedROIPercent.toFixed(2)}%</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">투자 기간</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{parseFloat(roiPeriod)}년</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compound' && compoundResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">복리 계산 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaDollarSign className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">최종 금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(compoundResult.finalAmount)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 투자금액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(compoundResult.totalContributed)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">이자 수익</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(compoundResult.interestEarned)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">투자 기간</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{parseFloat(compoundYears)}년</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">연도별 상세 내역</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">연도</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">잔액</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">연간 이자</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">누적 이자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compoundResult.schedule.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{item.year}년</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.balance)}원</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.interest)}원</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.totalInterest)}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'target' && targetResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">목표금액 달성 기간 계산 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">필요 투자 기간</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{targetResult.years}년</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaDollarSign className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">최종 잔액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(targetResult.finalBalance)}원</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'period' && periodResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">투자기간 계산 결과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">필요 투자 기간</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{periodResult.years}년</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaDollarSign className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">최종 잔액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(periodResult.finalBalance)}원</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 
