'use client';

import { useState } from 'react';
import { FaCalculator, FaHome, FaMoneyBillWave, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [insuranceCost, setInsuranceCost] = useState('');
  const [managementFee, setManagementFee] = useState('');
  const [vacancyRate, setVacancyRate] = useState('5');
  const [annualYield, setAnnualYield] = useState(0);
  const [monthlyYield, setMonthlyYield] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateYield = () => {
    const value = parseNumber(propertyValue);
    const rent = parseNumber(monthlyRent);
    const maintenance = parseNumber(maintenanceCost);
    const tax = parseNumber(propertyTax);
    const insurance = parseNumber(insuranceCost);
    const management = parseNumber(managementFee);
    const vacancy = parseFloat(vacancyRate) / 100;

    // 연간 수익 계산
    const annualRent = rent * 12;
    const vacancyLoss = annualRent * vacancy;
    const effectiveRent = annualRent - vacancyLoss;

    // 연간 비용 계산
    const annualMaintenance = maintenance * 12;
    const annualTax = tax * 12;
    const annualInsurance = insurance * 12;
    const annualManagement = management * 12;
    const totalExpensesAnnual = annualMaintenance + annualTax + annualInsurance + annualManagement;

    // 순수익 계산
    const netIncomeAnnual = effectiveRent - totalExpensesAnnual;

    // 수익률 계산
    const yieldAnnual = (netIncomeAnnual / value) * 100;
    const yieldMonthly = yieldAnnual / 12;

    setAnnualYield(yieldAnnual);
    setMonthlyYield(yieldMonthly);
    setNetIncome(netIncomeAnnual);
    setTotalExpenses(totalExpensesAnnual);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaChartLine className="mr-3 text-gray-600" />
            임대수익률 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            부동산 임대 수익률을 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부동산 가액 (원)
              </label>
              <input
                type="text"
                value={propertyValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setPropertyValue(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="예: 500,000,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월세 (원)
              </label>
              <input
                type="text"
                value={monthlyRent}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setMonthlyRent(formatNumber(value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="예: 2,000,000"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">월간 비용</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관리비/유지보수비 (원)
                </label>
                <input
                  type="text"
                  value={maintenanceCost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setMaintenanceCost(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="예: 100,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재산세 (원)
                </label>
                <input
                  type="text"
                  value={propertyTax}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setPropertyTax(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="예: 50,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보험료 (원)
                </label>
                <input
                  type="text"
                  value={insuranceCost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setInsuranceCost(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="예: 30,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관리수수료 (원)
                </label>
                <input
                  type="text"
                  value={managementFee}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setManagementFee(formatNumber(value));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="예: 50,000"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공실률 (%)
            </label>
            <input
              type="number"
              value={vacancyRate}
              onChange={(e) => setVacancyRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="예: 5"
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <button
            onClick={calculateYield}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mt-6"
          >
            수익률 계산하기
          </button>

          {annualYield > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">수익률 계산 결과</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">연간 수익률</p>
                  <p className="text-xl font-bold text-gray-600">
                    {annualYield.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">월간 수익률</p>
                  <p className="text-xl font-bold text-gray-600">
                    {monthlyYield.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">연간 순수익</p>
                  <p className="text-xl font-bold text-gray-600">
                    {netIncome.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">연간 총 비용</p>
                  <p className="text-xl font-bold text-gray-600">
                    {totalExpenses.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">수익률 분석</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>연간 총 수익:</span>
                    <span>{(parseNumber(monthlyRent) * 12).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>공실 손실:</span>
                    <span>{(parseNumber(monthlyRent) * 12 * parseFloat(vacancyRate) / 100).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>실효 수익:</span>
                    <span>{((parseNumber(monthlyRent) * 12) - (parseNumber(monthlyRent) * 12 * parseFloat(vacancyRate) / 100)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>연간 총 비용:</span>
                    <span>{totalExpenses.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>연간 순수익:</span>
                    <span>{netIncome.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-gray-600" />
            임대수익률 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">수익률 기준</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3% 이하: 낮은 수익률</li>
                <li>• 3~5%: 보통 수익률</li>
                <li>• 5~8%: 높은 수익률</li>
                <li>• 8% 이상: 매우 높은 수익률</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">고려사항</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 부동산 가치 상승</li>
                <li>• 공실률 변동</li>
                <li>• 관리비 증가</li>
                <li>• 세금 부담</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">수익률 계산 공식</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 연간 총 수익 = 월세 × 12</p>
              <p>• 실효 수익 = 연간 총 수익 × (1 - 공실률)</p>
              <p>• 연간 총 비용 = (관리비 + 재산세 + 보험료 + 관리수수료) × 12</p>
              <p>• 연간 순수익 = 실효 수익 - 연간 총 비용</p>
              <p>• 수익률 = (연간 순수익 ÷ 부동산 가액) × 100</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 