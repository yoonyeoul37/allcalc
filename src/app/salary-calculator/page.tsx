'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface SalaryResult {
  grossSalary: number;
  netSalary: number;
  totalDeductions: number;
  totalTax: number;
  nationalPension: number;
  healthInsurance: number;
  employmentInsurance: number;
  incomeTax: number;
  localTax: number;
  breakdown: {
    basicSalary: number;
    allowances: number;
    overtimePay: number;
    bonuses: number;
  };
}

export default function SalaryCalculator() {
  const [basicSalary, setBasicSalary] = useState('');
  const [basicSalaryDisplay, setBasicSalaryDisplay] = useState('');
  const [allowances, setAllowances] = useState('');
  const [allowancesDisplay, setAllowancesDisplay] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('1.5');
  const [bonuses, setBonuses] = useState('');
  const [bonusesDisplay, setBonusesDisplay] = useState('');
  const [workDays, setWorkDays] = useState('22');
  const [workHours, setWorkHours] = useState('8');
  const [result, setResult] = useState<SalaryResult | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleBasicSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBasicSalary(value);
      setBasicSalaryDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleAllowancesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAllowances(value);
      setAllowancesDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleBonusesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBonuses(value);
      setBonusesDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateSalary = () => {
    const baseSalary = parseFloat(basicSalary.replace(/,/g, ''));
    const allowanceAmount = parseFloat(allowances.replace(/,/g, ''));
    const overtimeHoursWorked = parseFloat(overtimeHours);
    const overtimeMultiplier = parseFloat(overtimeRate);
    const bonusAmount = parseFloat(bonuses.replace(/,/g, ''));
    const monthlyWorkDays = parseFloat(workDays);
    const dailyWorkHours = parseFloat(workHours);

    if (isNaN(baseSalary) || baseSalary <= 0) return;

    // 시급 계산
    const hourlyRate = (baseSalary / monthlyWorkDays) / dailyWorkHours;
    
    // 초과근무수당 계산
    const overtimePay = overtimeHoursWorked * hourlyRate * overtimeMultiplier;
    
    // 총 급여 (세전)
    const grossSalary = baseSalary + allowanceAmount + overtimePay + bonusAmount;

    // 4대보험 계산 (2024년 기준)
    const nationalPensionRate = 0.045; // 4.5%
    const healthInsuranceRate = 0.0343; // 3.43%
    const employmentInsuranceRate = 0.008; // 0.8%

    const nationalPension = Math.round(grossSalary * nationalPensionRate);
    const healthInsurance = Math.round(grossSalary * healthInsuranceRate);
    const employmentInsurance = Math.round(grossSalary * employmentInsuranceRate);

    // 소득세 계산 (간이세율표 기준)
    let incomeTax = 0;
    if (grossSalary <= 12000000) {
      incomeTax = Math.round(grossSalary * 0.06);
    } else if (grossSalary <= 46000000) {
      incomeTax = Math.round(12000000 * 0.06 + (grossSalary - 12000000) * 0.15);
    } else if (grossSalary <= 88000000) {
      incomeTax = Math.round(12000000 * 0.06 + 34000000 * 0.15 + (grossSalary - 46000000) * 0.24);
    } else if (grossSalary <= 150000000) {
      incomeTax = Math.round(12000000 * 0.06 + 34000000 * 0.15 + 42000000 * 0.24 + (grossSalary - 88000000) * 0.35);
    } else if (grossSalary <= 300000000) {
      incomeTax = Math.round(12000000 * 0.06 + 34000000 * 0.15 + 42000000 * 0.24 + 62000000 * 0.35 + (grossSalary - 150000000) * 0.38);
    } else if (grossSalary <= 500000000) {
      incomeTax = Math.round(12000000 * 0.06 + 34000000 * 0.15 + 42000000 * 0.24 + 62000000 * 0.35 + 150000000 * 0.38 + (grossSalary - 300000000) * 0.40);
    } else {
      incomeTax = Math.round(12000000 * 0.06 + 34000000 * 0.15 + 42000000 * 0.24 + 62000000 * 0.35 + 150000000 * 0.38 + 200000000 * 0.40 + (grossSalary - 500000000) * 0.42);
    }

    // 지방소득세 (소득세의 10%)
    const localTax = Math.round(incomeTax * 0.1);

    const totalTax = incomeTax + localTax;
    const totalDeductions = nationalPension + healthInsurance + employmentInsurance + totalTax;
    const netSalary = grossSalary - totalDeductions;

    setResult({
      grossSalary,
      netSalary,
      totalDeductions,
      totalTax,
      nationalPension,
      healthInsurance,
      employmentInsurance,
      incomeTax,
      localTax,
      breakdown: {
        basicSalary: baseSalary,
        allowances: allowanceAmount,
        overtimePay,
        bonuses: bonusAmount
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">급여계산기</h1>
            <p className="text-lg text-gray-600">2024년 기준으로 실수령액과 각종 공제를 계산해보세요</p>
          </div>

          {/* 급여계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기본급 (원)</label>
                <input
                  type="text"
                  value={basicSalaryDisplay}
                  onChange={handleBasicSalaryChange}
                  placeholder="3,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">수당 (원)</label>
                <input
                  type="text"
                  value={allowancesDisplay}
                  onChange={handleAllowancesChange}
                  placeholder="500,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">초과근무 시간 (시간)</label>
                <input
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">초과근무 배율</label>
                <select
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="1.5">1.5배 (일반)</option>
                  <option value="2.0">2.0배 (휴일)</option>
                  <option value="1.25">1.25배 (야간)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상여금 (원)</label>
                <input
                  type="text"
                  value={bonusesDisplay}
                  onChange={handleBonusesChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">월 근무일수 (일)</label>
                <input
                  type="number"
                  value={workDays}
                  onChange={(e) => setWorkDays(e.target.value)}
                  placeholder="22"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">일 근무시간 (시간)</label>
                <input
                  type="number"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  placeholder="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateSalary}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                급여 계산하기
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">급여 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 급여 (세전)</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.grossSalary.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      기본급 + 수당 + 초과근무 + 상여금
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">실수령액 (세후)</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.netSalary.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      총 급여 - 공제액
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">총 공제액</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.totalDeductions.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      4대보험 + 소득세 + 지방세
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 급여 상세 내역 */}
          {result && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaReceipt className="mr-2 text-orange-600" />
                급여 상세 내역
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">급여 구성</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">기본급</span>
                      <span className="font-semibold">{result.breakdown.basicSalary.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">수당</span>
                      <span className="font-semibold">{result.breakdown.allowances.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">초과근무수당</span>
                      <span className="font-semibold">{result.breakdown.overtimePay.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상여금</span>
                      <span className="font-semibold">{result.breakdown.bonuses.toLocaleString()}원</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-blue-600">
                      <span>총 급여</span>
                      <span>{result.grossSalary.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">공제 내역</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">국민연금 (4.5%)</span>
                      <span className="font-semibold text-red-600">{result.nationalPension.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">건강보험 (3.43%)</span>
                      <span className="font-semibold text-red-600">{result.healthInsurance.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">고용보험 (0.8%)</span>
                      <span className="font-semibold text-red-600">{result.employmentInsurance.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">소득세</span>
                      <span className="font-semibold text-red-600">{result.incomeTax.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">지방소득세</span>
                      <span className="font-semibold text-red-600">{result.localTax.toLocaleString()}원</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-red-600">
                      <span>총 공제액</span>
                      <span>{result.totalDeductions.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 설명 섹션 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPercent className="mr-2 text-purple-600" />
              급여계산기 설명
            </h3>
            <div className="prose text-gray-600 space-y-3">
              <p>
                <strong>총 급여:</strong> 기본급, 수당, 초과근무수당, 상여금을 모두 합한 세전 급여입니다.
              </p>
              <p>
                <strong>4대보험:</strong> 국민연금, 건강보험, 고용보험, 산재보험을 포함하며, 2024년 기준으로 계산됩니다.
              </p>
              <p>
                <strong>소득세:</strong> 간이세율표를 기준으로 계산되며, 지방소득세는 소득세의 10%입니다.
              </p>
              <p>
                <strong>실수령액:</strong> 총 급여에서 모든 공제액을 제외한 실제 받는 금액입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 