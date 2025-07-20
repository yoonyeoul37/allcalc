"use client";

import { useState } from "react";
import { FaChartLine, FaCalculator, FaMoneyBillWave, FaPercent, FaCalendarAlt, FaIndustry, FaHome } from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface DepreciationResult {
  originalValue: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: string;
  yearlyDepreciation: number;
  totalDepreciation: number;
  depreciationSchedule: Array<{
    year: number;
    depreciation: number;
    accumulatedDepreciation: number;
    bookValue: number;
  }>;
}

export default function DepreciationCalculator() {
  const [originalValue, setOriginalValue] = useState("");
  const [salvageValue, setSalvageValue] = useState("");
  const [usefulLife, setUsefulLife] = useState("");
  const [depreciationMethod, setDepreciationMethod] = useState("straight-line");
  const [result, setResult] = useState<DepreciationResult | null>(null);
  
  // 입력 필드용 상태 (콤마 표시용)
  const [originalValueDisplay, setOriginalValueDisplay] = useState("");
  const [salvageValueDisplay, setSalvageValueDisplay] = useState("");

  const calculateDepreciation = () => {
    if (!originalValue || !salvageValue || !usefulLife) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    const original = parseFloat(originalValue);
    const salvage = parseFloat(salvageValue);
    const life = parseInt(usefulLife);

    if (isNaN(original) || isNaN(salvage) || isNaN(life)) {
      alert("올바른 숫자를 입력해주세요.");
      return;
    }

    if (original <= salvage) {
      alert("원가는 잔존가치보다 커야 합니다.");
      return;
    }

    if (life <= 0) {
      alert("사용기간은 0보다 커야 합니다.");
      return;
    }

    let yearlyDepreciation = 0;
    let totalDepreciation = 0;
    const depreciationSchedule = [];

    if (depreciationMethod === "straight-line") {
      // 정액법
      yearlyDepreciation = (original - salvage) / life;
      totalDepreciation = original - salvage;

      for (let year = 1; year <= life; year++) {
        const accumulatedDepreciation = yearlyDepreciation * year;
        const bookValue = original - accumulatedDepreciation;

        depreciationSchedule.push({
          year,
          depreciation: yearlyDepreciation,
          accumulatedDepreciation,
          bookValue: Math.max(bookValue, salvage)
        });
      }
    } else if (depreciationMethod === "declining-balance") {
      // 정률법 (이중정률법)
      const rate = 2 / life; // 이중정률법
      totalDepreciation = original - salvage;

      let bookValue = original;
      for (let year = 1; year <= life; year++) {
        const depreciation = bookValue * rate;
        const finalDepreciation = Math.min(depreciation, bookValue - salvage);
        bookValue -= finalDepreciation;

        depreciationSchedule.push({
          year,
          depreciation: finalDepreciation,
          accumulatedDepreciation: original - bookValue,
          bookValue: Math.max(bookValue, salvage)
        });
      }
      yearlyDepreciation = depreciationSchedule[0].depreciation;
    } else if (depreciationMethod === "sum-of-years") {
      // 연수합계법
      const sumOfYears = (life * (life + 1)) / 2;
      totalDepreciation = original - salvage;

      for (let year = 1; year <= life; year++) {
        const depreciation = (original - salvage) * (life - year + 1) / sumOfYears;
        const accumulatedDepreciation: number = depreciationSchedule.reduce((sum, item) => sum + item.depreciation, 0) + depreciation;
        const bookValue = original - accumulatedDepreciation;

        depreciationSchedule.push({
          year,
          depreciation,
          accumulatedDepreciation,
          bookValue: Math.max(bookValue, salvage)
        });
      }
      yearlyDepreciation = depreciationSchedule[0].depreciation;
    }

    setResult({
      originalValue: original,
      salvageValue: salvage,
      usefulLife: life,
      depreciationMethod,
      yearlyDepreciation,
      totalDepreciation,
      depreciationSchedule
    });
  };

  const resetCalculator = () => {
    setOriginalValue("");
    setOriginalValueDisplay("");
    setSalvageValue("");
    setSalvageValueDisplay("");
    setUsefulLife("");
    setDepreciationMethod("straight-line");
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(amount));
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case "straight-line": return "정액법";
      case "declining-balance": return "정률법 (이중정률법)";
      case "sum-of-years": return "연수합계법";
      default: return "정액법";
    }
  };

  // 입력 필드 핸들러 함수
  const formatInputNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('ko-KR').format(parseInt(numericValue));
  };

  const handleOriginalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setOriginalValue(numericValue);
    setOriginalValueDisplay(formatInputNumber(value));
  };

  const handleSalvageValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setSalvageValue(numericValue);
    setSalvageValueDisplay(formatInputNumber(value));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-2">
              <FaChartLine className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">감가상각 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">정액법, 정률법, 연수합계법 감가상각 계산</p>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">자산 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  자산 원가 (원)
                </label>
                <input
                  type="text"
                  value={originalValueDisplay}
                  onChange={handleOriginalValueChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 10,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  잔존가치 (원)
                </label>
                <input
                  type="text"
                  value={salvageValueDisplay}
                  onChange={handleSalvageValueChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 1,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-black" />
                  사용기간 (년)
                </label>
                <input
                  type="number"
                  value={usefulLife}
                  onChange={(e) => setUsefulLife(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                  placeholder="예: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIndustry className="inline mr-2 text-black" />
                  감가상각 방식
                </label>
                <select
                  value={depreciationMethod}
                  onChange={(e) => setDepreciationMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 focus:outline-none focus:ring-offset-0"
                >
                  <option value="straight-line">정액법</option>
                  <option value="declining-balance">정률법 (이중정률법)</option>
                  <option value="sum-of-years">연수합계법</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={calculateDepreciation}
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
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">자산 원가</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(result.originalValue)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">잔존가치</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(result.salvageValue)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 감가상각액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(result.totalDepreciation)}원</div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-black mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">연간 감가상각액</h4>
                  </div>
                  <div className="text-2xl font-bold text-black">{formatCurrency(result.yearlyDepreciation)}원</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">감가상각 방식: {getMethodName(result.depreciationMethod)}</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">
                    <strong>정액법:</strong> 매년 동일한 금액을 감가상각<br/>
                    <strong>정률법:</strong> 매년 감소하는 잔액에 일정 비율 적용<br/>
                    <strong>연수합계법:</strong> 사용기간의 합계를 기준으로 감가상각
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">연도</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">감가상각액</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">누적 감가상각액</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">장부가치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.depreciationSchedule.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-2">{item.year}년</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.depreciation)}원</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.accumulatedDepreciation)}원</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(item.bookValue)}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 