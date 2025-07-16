'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface TaxResult {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  calculatedTax: number;
  effectiveTaxRate: number;
  monthlyTax: number;
  taxBreakdown: {
    basicDeduction: number;
    additionalDeduction: number;
    specialDeduction: number;
    otherDeductions: number;
  };
  taxRates: Array<{
    bracket: string;
    rate: number;
    amount: number;
    tax: number;
  }>;
}

export default function IncomeTaxCalculator() {
  const [incomeType, setIncomeType] = useState('salary');
  const [annualIncome, setAnnualIncome] = useState('');
  const [annualIncomeDisplay, setAnnualIncomeDisplay] = useState('');
  const [basicDeduction, setBasicDeduction] = useState('1500000');
  const [basicDeductionDisplay, setBasicDeductionDisplay] = useState('1,500,000');
  const [additionalDeduction, setAdditionalDeduction] = useState('1000000');
  const [additionalDeductionDisplay, setAdditionalDeductionDisplay] = useState('1,000,000');
  const [specialDeduction, setSpecialDeduction] = useState('0');
  const [specialDeductionDisplay, setSpecialDeductionDisplay] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [otherDeductionsDisplay, setOtherDeductionsDisplay] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleAnnualIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAnnualIncome(value);
      setAnnualIncomeDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleBasicDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBasicDeduction(value);
      setBasicDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleAdditionalDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAdditionalDeduction(value);
      setAdditionalDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleSpecialDeductionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSpecialDeduction(value);
      setSpecialDeductionDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleOtherDeductionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setOtherDeductions(value);
      setOtherDeductionsDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateTax = () => {
    const income = parseFloat(annualIncome.replace(/,/g, ''));
    const basic = parseFloat(basicDeduction.replace(/,/g, ''));
    const additional = parseFloat(additionalDeduction.replace(/,/g, ''));
    const special = parseFloat(specialDeduction.replace(/,/g, ''));
    const other = parseFloat(otherDeductions.replace(/,/g, ''));

    if (isNaN(income) || income <= 0) return;

    const totalDeductions = basic + additional + special + other;
    const taxableIncome = Math.max(0, income - totalDeductions);

    // 2024년 한국 소득세 세율표 (과세표준)
    const taxRates = [
      { min: 0, max: 12000000, rate: 0.06 },
      { min: 12000000, max: 46000000, rate: 0.15 },
      { min: 46000000, max: 88000000, rate: 0.24 },
      { min: 88000000, max: 150000000, rate: 0.35 },
      { min: 150000000, max: 300000000, rate: 0.38 },
      { min: 300000000, max: 500000000, rate: 0.40 },
      { min: 500000000, max: Infinity, rate: 0.42 }
    ];

    let calculatedTax = 0;
    const taxBreakdown = [];

    for (let i = 0; i < taxRates.length; i++) {
      const rate = taxRates[i];
      const prevMax = i > 0 ? taxRates[i - 1].max : 0;
      
      if (taxableIncome > prevMax) {
        const bracketAmount = Math.min(taxableIncome, rate.max) - prevMax;
        const bracketTax = bracketAmount * rate.rate;
        calculatedTax += bracketTax;
        
        taxBreakdown.push({
          bracket: `${(prevMax / 10000).toFixed(0)}만원 초과 ${(rate.max / 10000).toFixed(0)}만원 이하`,
          rate: rate.rate * 100,
          amount: bracketAmount,
          tax: bracketTax
        });
      }
    }

    const effectiveTaxRate = (calculatedTax / income) * 100;
    const monthlyTax = calculatedTax / 12;

    setResult({
      totalIncome: income,
      totalDeductions,
      taxableIncome,
      calculatedTax,
      effectiveTaxRate,
      monthlyTax,
      taxBreakdown: {
        basicDeduction: basic,
        additionalDeduction: additional,
        specialDeduction: special,
        otherDeductions: other
      },
      taxRates: taxBreakdown
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">소득세 계산기</h1>
            <p className="text-lg text-gray-600">2024년 한국 소득세법 기준으로 종합소득세를 계산해보세요</p>
          </div>

          {/* 소득세 계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">소득 유형</label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="salary">근로소득 (급여)</option>
                  <option value="business">사업소득 (개인사업자)</option>
                  <option value="interest">이자소득</option>
                  <option value="dividend">배당소득</option>
                  <option value="capital">양도소득</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연간 총소득 (원)</label>
                <input
                  type="text"
                  value={annualIncomeDisplay}
                  onChange={handleAnnualIncomeChange}
                  placeholder="50,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기본공제 (원)</label>
                <input
                  type="text"
                  value={basicDeductionDisplay}
                  onChange={handleBasicDeductionChange}
                  placeholder="1,500,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">기본공제: 연 150만원 (자동 적용)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">추가공제 (원)</label>
                <input
                  type="text"
                  value={additionalDeductionDisplay}
                  onChange={handleAdditionalDeductionChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">추가공제: 연 100만원 (자동 적용)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">특별공제 (원)</label>
                <input
                  type="text"
                  value={specialDeductionDisplay}
                  onChange={handleSpecialDeductionChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">의료비, 교육비, 기부금, 연말정산 등</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">기타공제 (원)</label>
                <input
                  type="text"
                  value={otherDeductionsDisplay}
                  onChange={handleOtherDeductionsChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">보험료, 연금보험료, 장기집합투자증권 등</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateTax}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                세금 계산하기
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">소득세 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">과세표준</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.taxableIncome.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      총소득 {result.totalIncome.toLocaleString()}원 - 공제 {result.totalDeductions.toLocaleString()}원
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">산출세액</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.calculatedTax.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      실효세율: {result.effectiveTaxRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">월 세금 납부액</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.monthlyTax.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      연간 세액을 12개월로 나눈 금액
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 세율 구간별 상세 내역 */}
          {result && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaReceipt className="mr-2 text-orange-600" />
                세율 구간별 상세 내역
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">과세표준 구간</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">세율</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">과세표준</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">세액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.taxRates.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-gray-700">{item.bracket}</td>
                        <td className="px-4 py-3 font-semibold text-blue-600">{item.rate}%</td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          {item.amount.toLocaleString()}원
                        </td>
                        <td className="px-4 py-3 font-semibold text-red-600">
                          {item.tax.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 공제 내역 */}
          {result && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaFileInvoiceDollar className="mr-2 text-green-600" />
                공제 내역
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">기본공제</h4>
                  <p className="text-xl font-bold text-blue-600">
                    {result.taxBreakdown.basicDeduction.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">추가공제</h4>
                  <p className="text-xl font-bold text-green-600">
                    {result.taxBreakdown.additionalDeduction.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">특별공제</h4>
                  <p className="text-xl font-bold text-yellow-600">
                    {result.taxBreakdown.specialDeduction.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">기타공제</h4>
                  <p className="text-xl font-bold text-purple-600">
                    {result.taxBreakdown.otherDeductions.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 설명 섹션 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPercent className="mr-2 text-purple-600" />
              소득세 계산기 설명
            </h3>
            <div className="prose text-gray-600 space-y-3">
              <p>
                <strong>과세표준:</strong> 총소득에서 각종 공제를 제외한 금액입니다.
              </p>
              <p>
                <strong>기본공제:</strong> 모든 납세자에게 적용되는 연 150만원의 공제입니다.
              </p>
              <p>
                <strong>추가공제:</strong> 연 100만원의 추가 공제가 적용됩니다.
              </p>
              <p>
                <strong>특별공제:</strong> 의료비, 교육비, 기부금, 연말정산 등이 해당됩니다.
              </p>
              <p>
                <strong>실효세율:</strong> 총소득 대비 실제 납부하는 세금의 비율입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 