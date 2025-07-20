"use client";

import { useState } from 'react';
import { FaCalculator, FaUser, FaMoneyBillWave, FaShieldAlt, FaChild, FaHeart, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    if (!age || !monthlyIncome) {
      alert('나이와 월 소득을 입력해주세요.');
      return;
    }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaUser className="mr-3 text-[#003366]" />
              개인회생 변제금 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  나이
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 3,000,000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {incomeTypes.map((type) => (
                    <option key={type.type} value={type.type}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가족 수
                </label>
                <select
                  value={familySize}
                  onChange={(e) => setFamilySize(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명 이상</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">추가 정보</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasStocks"
                    checked={hasStocks}
                    onChange={(e) => setHasStocks(e.target.checked)}
                    className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
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
                    className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
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
                    className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
                  />
                  <label htmlFor="isBasicLivelihood" className="text-sm font-medium text-gray-700">
                    기본생활수급자
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasDisability"
                    checked={hasDisability}
                    onChange={(e) => setHasDisability(e.target.checked)}
                    className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
                  />
                  <label htmlFor="hasDisability" className="text-sm font-medium text-gray-700">
                    장애인
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasMedicalExpenses"
                    checked={hasMedicalExpenses}
                    onChange={(e) => setHasMedicalExpenses(e.target.checked)}
                    className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]"
                  />
                  <label htmlFor="hasMedicalExpenses" className="text-sm font-medium text-gray-700">
                    의료비 지출
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={calculatePayment}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {monthlyPayment > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">월 변제금</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {monthlyPayment.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 채무금액</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {totalDebt.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">변제 기간</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {repaymentPeriod}년
                    </p>
                  </div>
                </div>
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
              <a href="/child-support-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChild className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">양육비 계산기</h4>
                <p className="text-xs text-gray-600">양육비 계산</p>
              </a>
              
              <a href="/alimony-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">위자료 계산기</h4>
                <p className="text-xs text-gray-600">위자료 계산</p>
              </a>
              
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </a>
              
              <a href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 