'use client';

import { useState } from 'react';
import { FaCalculator, FaMoneyBillWave, FaPercent, FaFileInvoiceDollar, FaChartLine, FaReceipt } from 'react-icons/fa';
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
    <div className="min-h-screen bg-white">
      <Header onSearch={() => {}} />
      
      {/* 메인 계산기 섹션 */}
      <div className="w-full px-8 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">판매세 계산기</h1>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">기본 10%, 간이과세자는 0.5~3%</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-6">
              <button
                onClick={calculateSalesTax}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
                    <div className="text-2xl font-bold text-blue-600">
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
                <FaReceipt className="mr-2 text-orange-600" />
                상세 계산 내역
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">계산 과정</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">공급가액</span>
                      <span className="font-semibold">{result.breakdown.supplyAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">부가세율</span>
                      <span className="font-semibold">{result.breakdown.vatRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">부가세</span>
                      <span className="font-semibold text-red-600">{result.breakdown.vatAmount.toLocaleString()}원</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-green-600">
                      <span>합계금액</span>
                      <span>{result.breakdown.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">과세자 정보</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">과세자 구분</span>
                      <span className="font-semibold">
                        {taxpayerType === 'general' && '일반과세자'}
                        {taxpayerType === 'simplified' && '간이과세자'}
                        {taxpayerType === 'exempt' && '면세사업자'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">적용 세율</span>
                      <span className="font-semibold">{vatRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">신고 의무</span>
                      <span className="font-semibold">
                        {taxpayerType === 'general' && '월별 신고'}
                        {taxpayerType === 'simplified' && '연 1회 신고'}
                        {taxpayerType === 'exempt' && '신고 불필요'}
                      </span>
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
              판매세 계산기 설명
            </h3>
            <div className="prose text-gray-600 space-y-3">
              <p>
                <strong>공급가액:</strong> 부가가치세를 제외한 순수한 상품/서비스의 가격입니다.
              </p>
              <p>
                <strong>부가가치세:</strong> 상품/서비스의 부가가치에 대해 부과되는 세금으로, 기본 10%입니다.
              </p>
              <p>
                <strong>합계금액:</strong> 공급가액에 부가가치세를 포함한 최종 판매가격입니다.
              </p>
              <p>
                <strong>과세자 구분:</strong> 일반과세자(10%), 간이과세자(0.5~3%), 면세사업자(0%)로 구분됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 