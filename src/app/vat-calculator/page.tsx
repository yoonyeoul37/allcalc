"use client";

import { useState } from "react";
import { 
  FaCalculator, 
  FaMoneyBillWave, 
  FaPercent,
  FaInfoCircle,
  FaFileInvoiceDollar
} from "react-icons/fa";
import Header from '../../components/ui/Header';

interface VATCalculation {
  supplyAmount: number; // 공급가액
  vatAmount: number; // 부가세
  totalAmount: number; // 합계금액
  vatRate: number; // 부가세율
}

export default function VATCalculator() {
  const [calculationType, setCalculationType] = useState<"supply" | "total" | "vat">("supply");
  const [inputAmount, setInputAmount] = useState("");
  const [vatRate, setVatRate] = useState("10");
  
  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d.]/g, "");
  };

  // 입력 처리 함수
  const handleInputChange = (value: string, setter: (value: string) => void) => {
    const numericValue = extractNumber(value);
    const formattedValue = formatNumber(numericValue);
    setter(formattedValue);
  };

  // 부가가치세 계산
  const calculateVAT = ((): VATCalculation => {
    const amount = parseFloat(inputAmount.replace(/[^\d.]/g, "")) || 0;
    const rate = parseFloat(vatRate) || 10;
    
    if (amount === 0) {
      return {
        supplyAmount: 0,
        vatAmount: 0,
        totalAmount: 0,
        vatRate: rate
      };
    }

    let supplyAmount: number;
    let vatAmount: number;
    let totalAmount: number;

    switch (calculationType) {
      case "supply": // 공급가액 기준
        supplyAmount = amount;
        vatAmount = Math.round(amount * (rate / 100));
        totalAmount = supplyAmount + vatAmount;
        break;
      
      case "total": // 합계금액 기준
        totalAmount = amount;
        supplyAmount = Math.round(amount / (1 + rate / 100));
        vatAmount = totalAmount - supplyAmount;
        break;
      
      case "vat": // 부가세 기준
        vatAmount = amount;
        supplyAmount = Math.round(amount / (rate / 100));
        totalAmount = supplyAmount + vatAmount;
        break;
      
      default:
        supplyAmount = amount;
        vatAmount = Math.round(amount * (rate / 100));
        totalAmount = supplyAmount + vatAmount;
    }

    return {
      supplyAmount,
      vatAmount,
      totalAmount,
      vatRate: rate
    };
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaFileInvoiceDollar className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">부가가치세 계산기</h1>
              <p className="text-gray-600">공급가액, 부가세, 합계금액 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalculator className="inline mr-2" />
                  계산 기준
                </label>
                <select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as "supply" | "total" | "vat")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="supply">공급가액 기준</option>
                  <option value="total">합계금액 기준</option>
                  <option value="vat">부가세 기준</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2" />
                  {calculationType === "supply" ? "공급가액" : 
                   calculationType === "total" ? "합계금액" : "부가세"} (원)
                </label>
                <input
                  type="text"
                  value={inputAmount}
                  onChange={(e) => handleInputChange(e.target.value, setInputAmount)}
                  placeholder={`${calculationType === "supply" ? "공급가액" : 
                               calculationType === "total" ? "합계금액" : "부가세"}을 입력하세요`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPercent className="inline mr-2" />
                  부가세율 (%)
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="10">10% (일반)</option>
                  <option value="0">0% (면세)</option>
                  <option value="5">5% (특별)</option>
                  <option value="3">3% (특별)</option>
                  <option value="1">1% (특별)</option>
                </select>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">부가가치세 계산 결과</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">공급가액:</span>
                    <span className="font-bold text-lg">{calculateVAT.supplyAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">부가세 ({calculateVAT.vatRate}%):</span>
                    <span className="font-bold text-lg text-red-600">{calculateVAT.vatAmount.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">합계금액:</span>
                      <span className="font-bold text-xl text-black">{calculateVAT.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">계산 공식</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {calculationType === "supply" && (
                    <>
                      <div>• <strong>부가세</strong> = 공급가액 × {calculateVAT.vatRate}%</div>
                      <div>• <strong>합계금액</strong> = 공급가액 + 부가세</div>
                    </>
                  )}
                  {calculationType === "total" && (
                    <>
                      <div>• <strong>공급가액</strong> = 합계금액 ÷ (1 + {calculateVAT.vatRate}%)</div>
                      <div>• <strong>부가세</strong> = 합계금액 - 공급가액</div>
                    </>
                  )}
                  {calculationType === "vat" && (
                    <>
                      <div>• <strong>공급가액</strong> = 부가세 ÷ {calculateVAT.vatRate}%</div>
                      <div>• <strong>합계금액</strong> = 공급가액 + 부가세</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">부가가치세 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">부가세율 구분</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>10% (일반)</strong>: 일반적인 재화/용역</div>
                <div>• <strong>0% (면세)</strong>: 수출, 외국인 관광객</div>
                <div>• <strong>5% (특별)</strong>: 일부 서비스업</div>
                <div>• <strong>3% (특별)</strong>: 일부 농산물</div>
                <div>• <strong>1% (특별)</strong>: 일부 의료서비스</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">계산 기준별 특징</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>공급가액 기준</strong>: 공급가액에서 부가세 계산</div>
                <div>• <strong>합계금액 기준</strong>: 합계금액에서 공급가액 역산</div>
                <div>• <strong>부가세 기준</strong>: 부가세에서 공급가액 역산</div>
                <div>• <strong>신고 시</strong>: 공급가액과 부가세를 별도로 신고</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 