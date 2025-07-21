'use client';

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt, FaHome, FaCreditCard, FaPiggyBank, FaChartBar, FaDollarSign, FaHandHoldingUsd, FaUniversity, FaShieldAlt, FaUserTie, FaGift, FaBalanceScale, FaUserCog, FaExchangeAlt, FaGlobe, FaTruck, FaBox, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import Header from '../../components/ui/Header';

interface SalesTaxResult {
  supplyAmount: number;
  vatAmount: number;
  totalAmount: number;
  breakdown: {
    supplyAmount: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
  };
  reverseCalculation?: {
    totalAmount: number;
    vatAmount: number;
    supplyAmount: number;
  };
}

export default function SalesTaxCalculator() {
  const [calculationType, setCalculationType] = useState('forward');
  const [supplyAmount, setSupplyAmount] = useState('');
  const [supplyAmountDisplay, setSupplyAmountDisplay] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalAmountDisplay, setTotalAmountDisplay] = useState('');
  const [vatRate, setVatRate] = useState('10');
  const [taxpayerType, setTaxpayerType] = useState('general');
  const [result, setResult] = useState<SalesTaxResult | null>(null);

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  const handleSupplyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSupplyAmount(value);
      setSupplyAmountDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalAmount(value);
      setTotalAmountDisplay(value === '' ? '' : formatNumber(value));
    }
  };

  const calculateSalesTax = () => {
    const rate = parseFloat(vatRate) / 100;

    if (calculationType === 'forward') {
      // 공급가액 → 합계금액 계산
      const supply = parseFloat(supplyAmount.replace(/,/g, ''));
      if (isNaN(supply) || supply <= 0) return;

      const vat = Math.round(supply * rate);
      const total = supply + vat;

      setResult({
        supplyAmount: supply,
        vatAmount: vat,
        totalAmount: total,
        breakdown: {
          supplyAmount: supply,
          vatRate: parseFloat(vatRate),
          vatAmount: vat,
          totalAmount: total
        }
      });
    } else {
      // 합계금액 → 공급가액 계산
      const total = parseFloat(totalAmount.replace(/,/g, ''));
      if (isNaN(total) || total <= 0) return;

      const supply = Math.round(total / (1 + rate));
      const vat = total - supply;

      setResult({
        supplyAmount: supply,
        vatAmount: vat,
        totalAmount: total,
        breakdown: {
          supplyAmount: supply,
          vatRate: parseFloat(vatRate),
          vatAmount: vat,
          totalAmount: total
        },
        reverseCalculation: {
          totalAmount: total,
          vatAmount: vat,
          supplyAmount: supply
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <FaCalculator className="mr-3 text-black" />
              판매세 계산기
            </h1>
            <p className="text-lg text-gray-600">부가가치세(VAT)를 포함한 판매가격을 계산해보세요</p>
          </div>

          {/* 판매세계산기 */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계산 방식</label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="forward">공급가액 → 합계금액</option>
                  <option value="reverse">합계금액 → 공급가액</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">과세자 구분</label>
                <select
                  value={taxpayerType}
                  onChange={(e) => setTaxpayerType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                  style={{ color: '#000000 !important' }}
                >
                  <option value="general">일반과세자 (10%)</option>
                  <option value="simplified">간이과세자 (0.5~3%)</option>
                  <option value="exempt">면세사업자 (0%)</option>
                </select>
              </div>
            </div>

            {calculationType === 'forward' ? (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">공급가액 (원)</label>
                  <input
                    type="text"
                    value={supplyAmountDisplay}
                    onChange={handleSupplyAmountChange}
                    placeholder="1,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">부가세를 제외한 금액</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">부가세율 (%)</label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    placeholder="10"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">기본 10%, 간이과세자는 0.5~3%</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">합계금액 (원)</label>
                  <input
                    type="text"
                    value={totalAmountDisplay}
                    onChange={handleTotalAmountChange}
                    placeholder="1,100,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">부가세를 포함한 금액</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">부가세율 (%)</label>
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    placeholder="10"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-lg text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">기본 10%, 간이과세자는 0.5~3%</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateSalesTax}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
              >
                계산하기
              </button>
            </div>

            {/* 결과 표시 */}
            {result && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">판매세 계산 결과</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">공급가액</div>
                    <div className="text-2xl font-bold text-black">
                      {result.supplyAmount.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      부가세 제외 금액
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">부가세</div>
                    <div className="text-2xl font-bold text-red-600">
                      {result.vatAmount.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      부가가치세 ({vatRate}%)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-sm text-gray-600 mb-1">합계금액</div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.totalAmount.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      공급가액 + 부가세
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 상세 내역 */}
          {result && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaReceipt className="mr-2 text-black" />
                상세 계산 내역
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">공급가액</span>
                  <span className="font-bold">{result.breakdown.supplyAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">부가세율</span>
                  <span className="font-bold">{result.breakdown.vatRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">부가세</span>
                  <span className="font-bold text-red-600">{result.breakdown.vatAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <span className="font-medium">합계금액</span>
                  <span className="font-bold text-blue-600">{result.breakdown.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}

          {/* 설명 및 주의사항 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-black" />
              판매세 계산기 사용법
            </h3>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">📊 계산 방식</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>공급가액 → 합계금액:</strong> 부가세를 제외한 금액에서 부가세를 포함한 총 금액 계산</li>
                  <li><strong>합계금액 → 공급가액:</strong> 부가세를 포함한 총 금액에서 부가세를 제외한 금액 계산</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🏢 과세자 구분</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>일반과세자:</strong> 매출 8,000만원 이상, 기본 부가세율 10%</li>
                  <li><strong>간이과세자:</strong> 매출 8,000만원 미만, 업종별 0.5~3%</li>
                  <li><strong>면세사업자:</strong> 부가세 면세 대상, 부가세율 0%</li>
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
                  <li>• 이 계산기는 참고용이며, 실제 세무 신고 시에는 전문가와 상담하세요</li>
                  <li>• 간이과세자의 경우 업종별로 다른 세율이 적용될 수 있습니다</li>
                  <li>• 면세 대상 상품이나 서비스의 경우 부가세가 면제됩니다</li>
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
              <Link href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDollarSign className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부가세 계산기</h4>
                <p className="text-xs text-gray-600">VAT 계산</p>
              </Link>
              
              <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaUniversity className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
              
              <Link href="/customs-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGlobe className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">해외직구 계산기</h4>
                <p className="text-xs text-gray-600">관세 계산</p>
              </Link>
              
              <Link href="/business-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartBar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">사업소득세 계산기</h4>
                <p className="text-xs text-gray-600">사업세 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AllCalc</h3>
              <p className="text-gray-300 text-sm">
                다양한 계산기를 한 곳에서 편리하게 이용하세요.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">홈</Link></li>
                <li><Link href="/mortgage-calculator" className="hover:text-white">대출 계산기</Link></li>
                <li><Link href="/investment-calculator" className="hover:text-white">투자 계산기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">계산기 카테고리</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/" className="hover:text-white">금융 계산기</Link></li>
                <li><Link href="/" className="hover:text-white">건강 계산기</Link></li>
                <li><Link href="/" className="hover:text-white">학업 계산기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <p className="text-gray-300 text-sm">
                문의사항이 있으시면 언제든 연락주세요.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2024 AllCalc. All rights reserved. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
