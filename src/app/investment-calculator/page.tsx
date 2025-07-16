"use client";

import { useState } from "react";
import { FaChartLine, FaCalculator, FaDollarSign, FaCalendarAlt, FaPercent, FaBullseye, FaHistory, FaChartBar } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaChartLine className="mr-3 text-blue-600" />
              투자 계산기
            </h1>
            <p className="text-gray-600 text-lg">
              투자 수익률, 복리 계산, 목표 금액 달성 기간 등을 계산해보세요
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg shadow-md p-2">
            <button
              onClick={() => setActiveTab('roi')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'roi' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaPercent className="inline mr-2" />
              투자 수익률
            </button>
            <button
              onClick={() => setActiveTab('compound')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'compound' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaChartBar className="inline mr-2" />
              복리 계산
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'target' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaBullseye className="inline mr-2" />
              목표 금액
            </button>
            <button
              onClick={() => setActiveTab('period')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'period' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              투자 기간
            </button>
          </div>

          {/* ROI Calculator */}
          {activeTab === 'roi' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaPercent className="mr-3 text-blue-600" />
                투자 수익률 계산
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    초기 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={roiInitialDisplay}
                    onChange={handleRoiInitialChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,000,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최종 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={roiFinalDisplay}
                    onChange={handleRoiFinalChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,500,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    투자 기간 (년)
                  </label>
                  <input
                    type="number"
                    value={roiPeriod}
                    onChange={(e) => setRoiPeriod(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 5"
                  />
                </div>
              </div>

              {roiResult && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">총 수익</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(roiResult.totalReturn)}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">총 수익률</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {roiResult.totalReturnPercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">연평균 수익률</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {roiResult.annualizedROIPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compound Interest Calculator */}
          {activeTab === 'compound' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="mr-3 text-blue-600" />
                복리 계산
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    초기 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={compoundInitialDisplay}
                    onChange={handleCompoundInitialChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,000,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={compoundMonthlyDisplay}
                    onChange={handleCompoundMonthlyChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 100,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연 수익률 (%)
                  </label>
                  <input
                    type="number"
                    value={compoundRate}
                    onChange={(e) => setCompoundRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 7"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    투자 기간 (년)
                  </label>
                  <input
                    type="number"
                    value={compoundYears}
                    onChange={(e) => setCompoundYears(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 10"
                  />
                </div>
              </div>

              {compoundResult && (
                <div className="mt-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">최종 금액</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(compoundResult.finalAmount)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">총 투자 금액</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(compoundResult.totalContributed)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">이자 수익</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(compoundResult.interestEarned)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">연도별 성장 현황</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">연도</th>
                            <th className="text-right py-2">잔액</th>
                            <th className="text-right py-2">연 이자</th>
                            <th className="text-right py-2">총 이자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compoundResult.schedule.map((row) => (
                            <tr key={row.year} className="border-b">
                              <td className="py-2">{row.year}년</td>
                              <td className="text-right py-2">{formatNumber(row.balance)}원</td>
                              <td className="text-right py-2">{formatNumber(row.interest)}원</td>
                              <td className="text-right py-2">{formatNumber(row.totalInterest)}원</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Target Amount Calculator */}
          {activeTab === 'target' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaBullseye className="mr-3 text-blue-600" />
              목표 금액 달성 기간 계산
            </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    초기 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={targetInitialDisplay}
                    onChange={handleTargetInitialChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,000,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={targetMonthlyDisplay}
                    onChange={handleTargetMonthlyChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 100,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연 수익률 (%)
                  </label>
                  <input
                    type="number"
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 7"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={targetAmountDisplay}
                    onChange={handleTargetAmountChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 10,000,000"
                  />
                </div>
              </div>

              {targetResult && (
                <div className="mt-6 p-6 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">필요한 투자 기간</p>
                      <p className="text-2xl font-bold text-green-600">
                        {targetResult.years.toFixed(1)}년
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">최종 잔액</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(targetResult.finalBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Investment Period Calculator */}
          {activeTab === 'period' && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaCalendarAlt className="mr-3 text-blue-600" />
                투자 기간 계산
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    초기 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={periodInitialDisplay}
                    onChange={handlePeriodInitialChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,000,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 투자 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={periodMonthlyDisplay}
                    onChange={handlePeriodMonthlyChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 100,000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연 수익률 (%)
                  </label>
                  <input
                    type="number"
                    value={periodRate}
                    onChange={(e) => setPeriodRate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 7"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 금액 (원)
                  </label>
                  <input
                    type="text"
                    value={periodTargetDisplay}
                    onChange={handlePeriodTargetChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 10,000,000"
                  />
                </div>
              </div>

              {periodResult && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">필요한 투자 기간</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {periodResult.years.toFixed(1)}년
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">최종 잔액</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(periodResult.finalBalance)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Calculators */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-blue-600" />
              관련 계산기
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDollarSign className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이자 계산기</h4>
                <p className="text-xs text-gray-600">단리/복리 이자</p>
              </a>
              
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">대출 상환</p>
              </a>
              
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">모기지 계산</p>
              </a>
              
              <a href="/retirement-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaBullseye className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">퇴직금 계산기</h4>
                <p className="text-xs text-gray-600">퇴직 계획</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 