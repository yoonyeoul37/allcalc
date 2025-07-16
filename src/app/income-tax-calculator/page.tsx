'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt, FaHome, FaCalendarAlt } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaFileInvoiceDollar className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">소득세 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">2024년 한국 소득세법 기준으로 종합소득세를 계산해보세요</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">소득 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaReceipt className="inline mr-2 text-black" />
                  소득 유형
                </label>
                <select
                  value={incomeType}
                  onChange={(e) => setIncomeType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="salary">근로소득 (급여)</option>
                  <option value="business">사업소득 (개인사업자)</option>
                  <option value="interest">이자소득</option>
                  <option value="dividend">배당소득</option>
                  <option value="capital">양도소득</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  연간 총소득 (원)
                </label>
                <input
                  type="text"
                  value={annualIncomeDisplay}
                  onChange={handleAnnualIncomeChange}
                  placeholder="50,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  기본공제 (원)
                </label>
                <input
                  type="text"
                  value={basicDeductionDisplay}
                  onChange={handleBasicDeductionChange}
                  placeholder="1,500,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  추가공제 (원)
                </label>
                <input
                  type="text"
                  value={additionalDeductionDisplay}
                  onChange={handleAdditionalDeductionChange}
                  placeholder="1,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  특별공제 (원)
                </label>
                <input
                  type="text"
                  value={specialDeductionDisplay}
                  onChange={handleSpecialDeductionChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2 text-black" />
                  기타공제 (원)
                </label>
                <input
                  type="text"
                  value={otherDeductionsDisplay}
                  onChange={handleOtherDeductionsChange}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateTax}
                className="flex-1 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                style={{ backgroundColor: '#003366' }}
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              <button
                onClick={() => {
                  setAnnualIncome('');
                  setAnnualIncomeDisplay('');
                  setBasicDeduction('1500000');
                  setBasicDeductionDisplay('1,500,000');
                  setAdditionalDeduction('1000000');
                  setAdditionalDeductionDisplay('1,000,000');
                  setSpecialDeduction('0');
                  setSpecialDeductionDisplay('');
                  setOtherDeductions('0');
                  setOtherDeductionsDisplay('');
                  setResult(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                초기화
              </button>
            </div>
          </div>

          {/* 구글 AdSense 광고 */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
            <div className="text-center text-gray-500 text-xs mb-1">Google AdSense</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              구글 AdSense 광고 (320x80)
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">소득세 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">연간 총소득</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.totalIncome.toLocaleString()}원</div>
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
                    <FaFileInvoiceDollar className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">과세표준</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.taxableIncome.toLocaleString()}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalculator className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">소득세</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.calculatedTax.toLocaleString()}원</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">실효세율</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.effectiveTaxRate.toFixed(2)}%</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">월 세금</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{result.monthlyTax.toLocaleString()}원</div>
                </div>
              </div>

              {/* 세율 구간별 상세 내역 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">세율 구간별 상세 내역</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">세율 구간</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">세율</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">과세표준</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">세금</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.taxRates.map((item: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-200 px-4 py-2">{item.bracket}</td>
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.rate}%</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{item.amount.toLocaleString()}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{item.tax.toLocaleString()}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 소득세 계산 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">소득세 계산 공식</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>과세표준:</strong> 총소득 - 총공제액</p>
              <p>• <strong>소득세:</strong> 과세표준에 세율을 적용하여 계산</p>
              <p>• <strong>실효세율:</strong> (소득세 ÷ 총소득) × 100</p>
              <p>• <strong>월 세금:</strong> 소득세 ÷ 12개월</p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 세금 계산은 세무사와 상담하세요.</p>
              <p>• <strong>2024년 기준:</strong> 한국 소득세법 기준으로 계산됩니다.</p>
              <p>• <strong>공제 항목:</strong> 실제 공제 가능한 항목은 개인 상황에 따라 다를 수 있습니다.</p>
            </div>
          </div>

          {/* 스폰서 개인 광고 - 관련계산기 위 */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
            <div className="text-center text-gray-500 text-xs mb-1">스폰서 광고</div>
            <div className="bg-gray-100 h-20 rounded flex items-center justify-center">
              스폰서 개인 광고 (320x80)
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/salary-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">연봉 계산기</h4>
                <p className="text-xs text-gray-600">월급/연봉</p>
              </a>
              
              <a href="/investment-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartLine className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">투자 계산기</h4>
                <p className="text-xs text-gray-600">수익률 계산</p>
              </a>
              
              <a href="/inflation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPercent className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">인플레이션 계산기</h4>
                <p className="text-xs text-gray-600">물가 상승</p>
              </a>
              
              <a href="/retirement-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">은퇴 계산기</h4>
                <p className="text-xs text-gray-600">은퇴 계획</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 