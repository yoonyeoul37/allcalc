'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaInfoCircle, FaUser, FaChartLine, FaDice, FaHandHoldingHeart } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface AgeGroup {
  range: string;
  multiplier: number;
  description: string;
}

interface IncomeType {
  type: string;
  rate: number;
  description: string;
}

const ageGroups: AgeGroup[] = [
  { range: '20세 미만', multiplier: 0.8, description: '미성년자 감경 20%' },
  { range: '20-29세', multiplier: 1.0, description: '기본 배율' },
  { range: '30-39세', multiplier: 1.1, description: '성인 배율 10% 증가' },
  { range: '40-49세', multiplier: 1.2, description: '중년 배율 20% 증가' },
  { range: '50-59세', multiplier: 1.3, description: '장년 배율 30% 증가' },
  { range: '60세 이상', multiplier: 1.4, description: '고령 배율 40% 증가' }
];

const incomeTypes: IncomeType[] = [
  { type: '일반근로소득', rate: 0.25, description: '일반 근로소득 25%' },
  { type: '사업소득', rate: 0.3, description: '사업소득 30%' },
  { type: '이자소득', rate: 0.2, description: '이자소득 20%' },
  { type: '배당소득', rate: 0.2, description: '배당소득 20%' },
  { type: '임대소득', rate: 0.35, description: '임대소득 35%' },
  { type: '기타소득', rate: 0.25, description: '기타소득 25%' }
];

export default function PersonalRehabilitationCalculator() {
  const [age, setAge] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [incomeType, setIncomeType] = useState('일반근로소득');
  const [hasStocks, setHasStocks] = useState(false);
  const [stockValue, setStockValue] = useState('');
  const [hasGambling, setHasGambling] = useState(false);
  const [gamblingAmount, setGamblingAmount] = useState('');
  const [isBasicLivelihood, setIsBasicLivelihood] = useState(false);
  const [familySize, setFamilySize] = useState('1');
  const [hasDisability, setHasDisability] = useState(false);
  const [hasMedicalExpenses, setHasMedicalExpenses] = useState(false);
  const [medicalExpenses, setMedicalExpenses] = useState('');
  const [totalDebtAmount, setTotalDebtAmount] = useState('');
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [repaymentPeriod, setRepaymentPeriod] = useState(0);
  const [adjustedIncome, setAdjustedIncome] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculatePayment = () => {
    const ageNum = parseInt(age);
    const income = parseNumber(monthlyIncome);
    const stocks = parseNumber(stockValue);
    const gambling = parseNumber(gamblingAmount);
    const medical = parseNumber(medicalExpenses);
    const family = parseInt(familySize);
    const debtAmount = parseNumber(totalDebtAmount);

    // 나이 배율 계산
    let ageMultiplier = 1.0;
    if (ageNum < 20) ageMultiplier = 0.8;
    else if (ageNum < 30) ageMultiplier = 1.0;
    else if (ageNum < 40) ageMultiplier = 1.1;
    else if (ageNum < 50) ageMultiplier = 1.2;
    else if (ageNum < 60) ageMultiplier = 1.3;
    else ageMultiplier = 1.4;

    // 소득 유형별 배율
    const incomeRate = incomeTypes.find(t => t.type === incomeType)?.rate || 0.25;

    // 기본 변제금 계산
    let basePayment = income * incomeRate * ageMultiplier;

    // 주식 보유 시 추가 변제금
    if (hasStocks && stocks > 0) {
      basePayment += stocks * 0.1; // 주식 가치의 10%
    }

    // 도박 이력 시 추가 변제금
    if (hasGambling && gambling > 0) {
      basePayment += gambling * 0.15; // 도박 금액의 15%
    }

    // 기본생활수급자 감경
    if (isBasicLivelihood) {
      basePayment *= 0.5; // 50% 감경
    }

    // 가족 수에 따른 조정
    const familyAdjustment = 1 + (family - 1) * 0.1; // 가족 1명당 10% 증가
    basePayment *= familyAdjustment;

    // 장애인 감경
    if (hasDisability) {
      basePayment *= 0.7; // 30% 감경
    }

    // 의료비 공제
    if (hasMedicalExpenses && medical > 0) {
      basePayment -= medical * 0.5; // 의료비의 50% 공제
    }

    // 최저생계비 보장 (월 150만원)
    const minimumLivingCost = 1500000;
    if (basePayment < minimumLivingCost) {
      basePayment = minimumLivingCost;
    }

    // 채무금액이 입력된 경우 실제 채무금액 사용, 없으면 추정
    const actualDebt = debtAmount > 0 ? debtAmount : basePayment * 36; // 3년치 추정
    const repaymentPeriodYears = Math.ceil(actualDebt / (basePayment * 12));

    setMonthlyPayment(basePayment);
    setTotalDebt(actualDebt);
    setRepaymentPeriod(repaymentPeriodYears);
    setAdjustedIncome(income);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaUser className="mr-3 text-black" />
            개인회생 변제금 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            개인회생 변제금을 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                나이
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 35"
                min="1"
                max="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 소득 (원)
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setMonthlyIncome(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 3,000,000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                총 채무금액 (원)
              </label>
              <input
                type="text"
                value={totalDebtAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setTotalDebtAmount(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 50,000,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소득 유형
              </label>
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {incomeTypes.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가족 수
              </label>
              <select
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="1">1명</option>
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5">5명 이상</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">추가 정보</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasStocks"
                  checked={hasStocks}
                  onChange={(e) => setHasStocks(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="hasStocks" className="text-sm font-medium text-gray-700">
                  주식 보유
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasGambling"
                  checked={hasGambling}
                  onChange={(e) => setHasGambling(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="hasGambling" className="text-sm font-medium text-gray-700">
                  도박 이력
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isBasicLivelihood"
                  checked={isBasicLivelihood}
                  onChange={(e) => setIsBasicLivelihood(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="isBasicLivelihood" className="text-sm font-medium text-gray-700">
                  기초생활수급자
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasDisability"
                  checked={hasDisability}
                  onChange={(e) => setHasDisability(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="hasDisability" className="text-sm font-medium text-gray-700">
                  장애인
                </label>
              </div>
            </div>
          </div>

          {hasStocks && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주식 가치 (원)
              </label>
              <input
                type="text"
                value={stockValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setStockValue(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 5,000,000"
              />
            </div>
          )}

          {hasGambling && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                도박 금액 (원)
              </label>
              <input
                type="text"
                value={gamblingAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setGamblingAmount(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="예: 1,000,000"
              />
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="checkbox"
                id="hasMedicalExpenses"
                checked={hasMedicalExpenses}
                onChange={(e) => setHasMedicalExpenses(e.target.checked)}
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="hasMedicalExpenses" className="text-sm font-medium text-gray-700">
                의료비 공제
              </label>
            </div>
            {hasMedicalExpenses && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월 의료비 (원)
                </label>
                <input
                  type="text"
                  value={medicalExpenses}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMedicalExpenses(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="예: 200,000"
                />
              </div>
            )}
          </div>

          <button
            onClick={calculatePayment}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors mt-6"
          >
            변제금 계산하기
          </button>

          {monthlyPayment > 0 && (
            <div className="bg-orange-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-black mb-4">변제금 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">월 변제금</p>
                  <p className="text-2xl font-bold text-black">
                    {monthlyPayment.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {parseNumber(totalDebtAmount) > 0 ? '실제 총 채무' : '추정 총 채무'}
                  </p>
                  <p className="text-xl font-bold text-black">
                    {totalDebt.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">상세 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>월 소득:</span>
                    <span>{adjustedIncome.toLocaleString()}원</span>
                  </div>
                  {parseNumber(totalDebtAmount) > 0 && (
                    <div className="flex justify-between">
                      <span>입력된 총 채무:</span>
                      <span>{parseNumber(totalDebtAmount).toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>소득 유형 배율:</span>
                    <span>{(incomeTypes.find(t => t.type === incomeType)?.rate || 0.25) * 100}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>나이 배율:</span>
                    <span>{ageGroups.find(g => {
                      const ageNum = parseInt(age);
                      if (ageNum < 20) return g.range === '20세 미만';
                      else if (ageNum < 30) return g.range === '20-29세';
                      else if (ageNum < 40) return g.range === '30-39세';
                      else if (ageNum < 50) return g.range === '40-49세';
                      else if (ageNum < 60) return g.range === '50-59세';
                      else return g.range === '60세 이상';
                    })?.multiplier || 1.0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>가족 수 조정:</span>
                    <span>{parseInt(familySize)}명</span>
                  </div>
                  {hasStocks && (
                    <div className="flex justify-between">
                      <span>주식 추가 변제금:</span>
                      <span>{(parseNumber(stockValue) * 0.1).toLocaleString()}원</span>
                    </div>
                  )}
                  {hasGambling && (
                    <div className="flex justify-between">
                      <span>도박 추가 변제금:</span>
                      <span>{(parseNumber(gamblingAmount) * 0.15).toLocaleString()}원</span>
                    </div>
                  )}
                  {isBasicLivelihood && (
                    <div className="flex justify-between">
                      <span>기초생활수급자 감경:</span>
                      <span>50%</span>
                    </div>
                  )}
                  {hasDisability && (
                    <div className="flex justify-between">
                      <span>장애인 감경:</span>
                      <span>30%</span>
                    </div>
                  )}
                  {hasMedicalExpenses && (
                    <div className="flex justify-between">
                      <span>의료비 공제:</span>
                      <span>{(parseNumber(medicalExpenses) * 0.5).toLocaleString()}원</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>최종 월 변제금:</span>
                    <span className="text-black">{monthlyPayment.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">예상 변제 기간</p>
                  <p className="text-lg font-bold text-black">
                    {repaymentPeriod}년
                  </p>
                </div>
                {parseNumber(totalDebtAmount) > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>• 실제 채무금액 기준으로 계산된 변제 기간입니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-black" />
            개인회생 변제금 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">변제금 계산 요소</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 나이: 연령대별 배율 적용</li>
                <li>• 소득 유형: 근로/사업/이자/배당/임대/기타</li>
                <li>• 주식 보유: 주식 가치의 10% 추가</li>
                <li>• 도박 이력: 도박 금액의 15% 추가</li>
                <li>• 기초생활수급자: 50% 감경</li>
                <li>• 장애인: 30% 감경</li>
              </ul>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">주의사항</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 최저생계비 보장 (월 150만원)</li>
                <li>• 가족 수에 따른 조정</li>
                <li>• 의료비 공제 가능</li>
                <li>• 실제 변제금은 법원이 결정</li>
                <li>• 변제 기간은 보통 3-5년</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">개인회생이란?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 개인회생은 채무자가 일정 기간 동안 변제 계획에 따라 채무를 변제하면 나머지 채무를 면제받는 제도입니다.</p>
              <p>• 변제금은 채무자의 소득, 재산, 가족 상황 등을 종합적으로 고려하여 결정됩니다.</p>
              <p>• 주식이나 도박 이력이 있으면 추가 변제금이 부과될 수 있습니다.</p>
              <p>• 기초생활수급자나 장애인은 특별한 감경 혜택을 받을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 