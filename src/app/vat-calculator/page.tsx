"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaCalculator, 
  FaMoneyBillWave, 
  FaPercent,
  FaInfoCircle,
  FaFileInvoiceDollar,
  FaDollarSign,
  FaChartBar,
  FaUserTie,
  FaShieldAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaFileInvoiceDollar className="mr-3 text-[#003366]" />
              부가가치세 계산기
            </h1>
            
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">부가가치세 계산 결과</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">공급가액:</span>
                      <span className="font-bold text-lg text-[#003366]">{calculateVAT.supplyAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">부가세 ({calculateVAT.vatRate}%):</span>
                      <span className="font-bold text-lg text-[#003366]">{calculateVAT.vatAmount.toLocaleString()}원</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">합계금액:</span>
                        <span className="font-bold text-xl text-[#003366]">{calculateVAT.totalAmount.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              <Link href="/comprehensive-income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">종합소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </Link>
              
              <Link href="/work-income-tax-refund-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">근로소득세 환급액</h4>
                <p className="text-xs text-gray-600">연말정산 계산</p>
              </Link>
              
              <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaFileInvoiceDollar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세율 계산</p>
              </Link>
              
              <Link href="/acquisition-capital-gains-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">취득세/양도세</h4>
                <p className="text-xs text-gray-600">부동산 세금</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
