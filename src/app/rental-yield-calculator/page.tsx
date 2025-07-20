"use client";

import { useState } from 'react';
import { FaCalculator, FaHome, FaMoneyBillWave, FaChartLine, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
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
    if (!propertyValue || !monthlyRent) {
      alert('부동산 가액과 월세를 입력해주세요.');
      return;
    }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="mr-3 text-[#003366]" />
              임대수익률 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 2,000,000"
                />
              </div>
            </div>

            <div className="mb-6">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                    placeholder="예: 50,000"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공실률 (%)
              </label>
              <input
                type="number"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                placeholder="예: 5"
                step="0.1"
                min="0"
                max="100"
              />
            </div>

            <button
              onClick={calculateYield}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {annualYield > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">연간 수익률</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {annualYield.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">월간 수익률</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {monthlyYield.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">연간 순수익</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {netIncome.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">연간 총 비용</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {totalExpenses.toLocaleString()}원
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
              <a href="/jeonse-monthly-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">전세/월세 전환</h4>
                <p className="text-xs text-gray-600">전환 계산</p>
              </a>
              
              <a href="/interim-payment-interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">중도금 이자 계산기</h4>
                <p className="text-xs text-gray-600">이자 계산</p>
              </a>
              
              <a href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
              
              <a href="/real-estate-registration-cost-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부동산 등기비용</h4>
                <p className="text-xs text-gray-600">등기비용 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 