"use client";

import { useState } from "react";
import { FaChartLine, FaCalculator, FaMoneyBillWave, FaPercent, FaCalendarAlt, FaIndustry } from "react-icons/fa";
import Header from '../../components/ui/Header';

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
        const accumulatedDepreciation = depreciationSchedule.reduce((sum, item) => sum + item.depreciation, 0) + depreciation;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaChartLine className="text-4xl text-gray-500 mr-3" />
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
                  <FaMoneyBillWave className="inline mr-2 text-green-500" />
                  자산 원가 (원)
                </label>
                <input
                  type="text"
                  value={originalValueDisplay}
                  onChange={handleOriginalValueChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="예: 10,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="inline mr-2 text-blue-500" />
                  잔존가치 (원)
                </label>
                <input
                  type="text"
                  value={salvageValueDisplay}
                  onChange={handleSalvageValueChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 1,000,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline mr-2 text-purple-500" />
                  사용기간 (년)
                </label>
                <input
                  type="number"
                  value={usefulLife}
                  onChange={(e) => setUsefulLife(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIndustry className="inline mr-2 text-orange-500" />
                  감가상각 방식
                </label>
                <select
                  value={depreciationMethod}
                  onChange={(e) => setDepreciationMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">감가상각 계산 결과</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <FaMoneyBillWave className="text-2xl text-green-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">자산 원가</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.originalValue)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <FaChartLine className="text-2xl text-blue-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">연 감가상각비</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.yearlyDepreciation)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center mb-3">
                    <FaPercent className="text-2xl text-purple-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">총 감가상각비</h4>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(result.totalDepreciation)}원
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center mb-3">
                    <FaIndustry className="text-2xl text-orange-500 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-800">감가상각 방식</h4>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {getMethodName(result.depreciationMethod)}
                  </div>
                </div>
              </div>

              {/* 감가상각 스케줄 */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">감가상각 스케줄</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">연도</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">감가상각비</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">누적감가상각</th>
                        <th className="border border-gray-200 px-4 py-2 text-sm font-semibold">장부가치</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.depreciationSchedule.map((item) => (
                        <tr key={item.year} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-center">{item.year}년차</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.depreciation)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.accumulatedDepreciation)}원</td>
                          <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.bookValue)}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 감가상각 방식 설명 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">감가상각 방식별 특징</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">정액법 (Straight Line)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매년 동일한 금액으로 감가상각</li>
                  <li>• 가장 일반적이고 간단한 방식</li>
                  <li>• 공식: (원가 - 잔존가치) ÷ 사용기간</li>
                  <li>• 회계상 가장 안정적인 방식</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">정률법 (Declining Balance)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 매년 잔액의 일정 비율로 감가상각</li>
                  <li>• 초기에는 큰 금액, 후기에는 작은 금액</li>
                  <li>• 이중정률법: 연 2배율 적용</li>
                  <li>• 기술 발전이 빠른 자산에 적합</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">연수합계법 (Sum of Years)</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 남은 사용연수의 합계를 분모로 사용</li>
                  <li>• 초기에는 큰 금액, 후기에는 작은 금액</li>
                  <li>• 정률법보다 완만한 감소</li>
                  <li>• 중간 정도의 감가상각 방식</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 감가상각의 목적 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">감가상각의 목적</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">회계적 목적</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 자산의 실제 가치를 정확히 반영</li>
                  <li>• 손익계산서의 비용 계산</li>
                  <li>• 재무제표의 신뢰성 향상</li>
                  <li>• 자산의 경제적 가치 감소 인정</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">세무적 목적</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 감가상각비를 비용으로 인정</li>
                  <li>• 법인세, 소득세 절약 효과</li>
                  <li>• 세금 계산 시 공제</li>
                  <li>• 투자 유인 효과</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">주의사항</h3>
            <div className="space-y-4 text-gray-600">
              <p>• <strong>이 계산기는 참고용입니다.</strong> 실제 회계처리는 전문가와 상담하세요.</p>
              <p>• <strong>세법 규정:</strong> 감가상각 방식은 세법에 따라 제한될 수 있습니다.</p>
              <p>• <strong>자산 종류:</strong> 건물, 기계, 차량 등에 따라 다른 방식이 적용될 수 있습니다.</p>
              <p>• <strong>잔존가치:</strong> 실제 잔존가치는 시장 상황에 따라 변동될 수 있습니다.</p>
              <p>• <strong>사용기간:</strong> 실제 사용기간은 예상과 다를 수 있습니다.</p>
              <p>• <strong>정기 검토:</strong> 매년 감가상각 정책을 검토하고 조정하세요.</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/interest-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPercent className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">이자 계산기</h4>
                <p className="text-xs text-gray-600">비용 계산</p>
              </a>
              
              <a href="/loan-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">대출 계산기</h4>
                <p className="text-xs text-gray-600">자금 조달</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
              
              <a href="/concrete-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaIndustry className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">콘크리트 계산기</h4>
                <p className="text-xs text-gray-600">건설 자산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 