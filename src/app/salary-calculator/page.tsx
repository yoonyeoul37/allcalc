'use client';

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt, FaHome, FaCalendarAlt, FaCreditCard, FaPiggyBank, FaChartBar, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle, FaDollarSign } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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

  const resetCalculator = () => {
    setBasicSalary('');
    setBasicSalaryDisplay('');
    setAllowances('');
    setAllowancesDisplay('');
    setOvertimeHours('');
    setOvertimeRate('1.5');
    setBonuses('');
    setBonusesDisplay('');
    setWorkDays('22');
    setWorkHours('8');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaMoneyBillWave className="mr-3 text-black" />
              급여계산기
            </h1>
            <p className="text-lg text-gray-600">2024년 기준으로 실수령액과 각종 공제를 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">급여 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  기본급 (원)
                </label>
                <input
                  type="text"
                  value={basicSalaryDisplay}
                  onChange={handleBasicSalaryChange}
                  placeholder="3,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  수당 (원)
                </label>
                <input
                  type="text"
                  value={allowancesDisplay}
                  onChange={handleAllowancesChange}
                  placeholder="500,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  초과근무 시간 (시간)
                </label>
                <input
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  초과근무 배율
                </label>
                <select
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg"
                >
                  <option value="1.5">1.5배 (일반)</option>
                  <option value="2.0">2.0배 (야간)</option>
                  <option value="1.0">1.0배 (특별)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  상여금 (원)
                </label>
                <input
                  type="text"
                  value={bonusesDisplay}
                  onChange={handleBonusesChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  월 근무일수
                </label>
                <input
                  type="number"
                  value={workDays}
                  onChange={(e) => setWorkDays(e.target.value)}
                  placeholder="22"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  일 근무시간
                </label>
                <input
                  type="number"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  placeholder="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366] text-lg"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateSalary}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={resetCalculator}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 계산 결과 */}
          {result && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">급여 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 급여</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.grossSalary.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaFileInvoiceDollar className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">실수령액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.netSalary.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 공제액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.totalDeductions.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalculator className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 세금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.totalTax.toLocaleString()}원</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaReceipt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">국민연금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.nationalPension.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaReceipt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">건강보험</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.healthInsurance.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaReceipt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">고용보험</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.employmentInsurance.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">소득세</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.incomeTax.toLocaleString()}원</div>
                </div>
              </div>

              {/* 급여 구성 상세 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">급여 구성 상세 내역</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">구분</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">금액</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">비율</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="border border-gray-200 px-4 py-2">기본급</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                          {result.breakdown.basicSalary.toLocaleString()}원
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {((result.breakdown.basicSalary / result.grossSalary) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">수당</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                          {result.breakdown.allowances.toLocaleString()}원
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {((result.breakdown.allowances / result.grossSalary) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="border border-gray-200 px-4 py-2">초과근무수당</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                          {result.breakdown.overtimePay.toLocaleString()}원
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {((result.breakdown.overtimePay / result.grossSalary) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">상여금</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-semibold text-black">
                          {result.breakdown.bonuses.toLocaleString()}원
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-right">
                          {((result.breakdown.bonuses / result.grossSalary) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 설명 및 주의사항 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-black" />
              급여 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">💰 급여 구성 요소</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>기본급:</strong> 월 기본 급여 (세전)</li>
                  <li><strong>수당:</strong> 각종 수당 (교통비, 식대 등)</li>
                  <li><strong>초과근무수당:</strong> 법정 근무시간 초과 근무에 대한 수당</li>
                  <li><strong>상여금:</strong> 성과급, 연말정산 등</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏥 4대보험 공제</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>국민연금:</strong> 4.5% (2024년 기준)</li>
                  <li><strong>건강보험:</strong> 3.43% (2024년 기준)</li>
                  <li><strong>고용보험:</strong> 0.8% (2024년 기준)</li>
                  <li><strong>산재보험:</strong> 업종별 차등 적용</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">주의사항</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 이 계산기는 참고용이며, 실제 급여는 회사 정책에 따라 다를 수 있습니다</li>
                  <li>• 2024년 기준 4대보험료율과 소득세율을 적용했습니다</li>
                  <li>• 실제 공제 가능한 항목은 개인 상황에 따라 다를 수 있습니다</li>
                  <li>• 세무 신고 시에는 전문가와 상담하시기 바랍니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDollarSign className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">소득세 계산</p>
              </Link>
              
              <Link href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartBar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부가가치세 계산기</h4>
                <p className="text-xs text-gray-600">VAT 계산</p>
              </Link>
              
              <Link href="/social-insurance-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">4대보험 계산기</h4>
                <p className="text-xs text-gray-600">보험료 계산</p>
              </Link>
              
              <Link href="/freelancer-withholding-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUserTie className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">원천징수세 계산기</h4>
                <p className="text-xs text-gray-600">원천징수 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
