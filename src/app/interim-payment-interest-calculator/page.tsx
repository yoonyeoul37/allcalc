'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';

export default function InterimPaymentInterestCalculator() {
  const [interimAmount, setInterimAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interestAmount, setInterestAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [days, setDays] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateInterest = () => {
    const amount = parseNumber(interimAmount);
    const rate = parseFloat(interestRate) / 100;
    
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 일 단위 이자 계산
    const dailyInterest = amount * rate / 365;
    const totalInterest = dailyInterest * diffDays;
    const total = amount + totalInterest;
    
    setDays(diffDays);
    setInterestAmount(totalInterest);
    setTotalAmount(total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaMoneyBillWave className="mr-3 text-green-600" />
            중도금 이자 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            중도금에 대한 이자를 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중도금 (원)
              </label>
              <input
                type="text"
                value={interimAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setInterimAmount(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="예: 50,000,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연 이율 (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="예: 5.0"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중도금 지급일
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이자 계산 종료일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={calculateInterest}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6"
          >
            이자 계산하기
          </button>

          {interestAmount > 0 && (
            <div className="bg-green-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4">이자 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">계산 기간</p>
                  <p className="text-xl font-bold text-green-600">
                    {days}일
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">이자 금액</p>
                  <p className="text-xl font-bold text-green-600">
                    {interestAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">총 금액 (중도금 + 이자)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {totalAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">계산 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>중도금:</span>
                    <span>{parseNumber(interimAmount).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>일일 이자:</span>
                    <span>{(parseNumber(interimAmount) * parseFloat(interestRate) / 100 / 365).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이자 계산 기간:</span>
                    <span>{days}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 이자:</span>
                    <span>{interestAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-green-600" />
            중도금 이자 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">중도금이란?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 건설 중인 아파트 분양 시 지급하는 금액</li>
                <li>• 일반적으로 분양가의 10~20%</li>
                <li>• 입주 전까지 이자가 발생</li>
                <li>• 입주 시 잔금에서 차감</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">이자 계산 방법</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 일 단위로 이자 계산</li>
                <li>• 연 이율을 365일로 나누어 일일 이자율 계산</li>
                <li>• 일일 이자율 × 중도금 × 계산 기간</li>
                <li>• 일반적으로 3~6% 연 이율 적용</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">계산 공식</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>일일 이자:</strong> 중도금 × 연 이율 ÷ 365</p>
              <p><strong>총 이자:</strong> 일일 이자 × 계산 기간 (일)</p>
              <p><strong>총 금액:</strong> 중도금 + 총 이자</p>
              <p><strong>이율:</strong> 일반적으로 3~6% (시장 상황에 따라 조정)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 