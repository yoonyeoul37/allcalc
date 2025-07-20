"use client";

import { useState, useEffect } from "react";
import { 
  FaExchangeAlt, 
  FaCalculator, 
  FaGlobe,
  FaInfoCircle,
  FaSyncAlt,
  FaTruck,
  FaChartBar,
  FaDollarSign
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

const currencies: Currency[] = [
  { code: "KRW", name: "한국 원", symbol: "₩" },
  { code: "USD", name: "미국 달러", symbol: "$" },
  { code: "EUR", name: "유로", symbol: "€" },
  { code: "JPY", name: "일본 엔", symbol: "¥" },
  { code: "CNY", name: "중국 위안", symbol: "¥" },
  { code: "GBP", name: "영국 파운드", symbol: "£" },
  { code: "AUD", name: "호주 달러", symbol: "A$" },
  { code: "CAD", name: "캐나다 달러", symbol: "C$" },
  { code: "SGD", name: "싱가포르 달러", symbol: "S$" },
  { code: "HKD", name: "홍콩 달러", symbol: "HK$" },
  { code: "THB", name: "태국 바트", symbol: "฿" },
  { code: "VND", name: "베트남 동", symbol: "₫" },
  { code: "PHP", name: "필리핀 페소", symbol: "₱" },
  { code: "MYR", name: "말레이시아 링깃", symbol: "RM" },
  { code: "IDR", name: "인도네시아 루피아", symbol: "Rp" }
];

export default function ExchangeRateCalculator() {
  const [fromCurrency, setFromCurrency] = useState<Currency>(currencies[0]);
  const [toCurrency, setToCurrency] = useState<Currency>(currencies[1]);
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d.]/g, "");
  };

  // 입력 처리 함수
  const handleInputChange = (value: string) => {
    const numericValue = extractNumber(value);
    const formattedValue = formatNumber(numericValue);
    setAmount(formattedValue);
  };

  // 환율 가져오기
  const fetchExchangeRate = async () => {
    if (fromCurrency.code === toCurrency.code) {
      setExchangeRate(1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.code}`);
      const data = await response.json();
      
      if (data.rates && data.rates[toCurrency.code]) {
        setExchangeRate(data.rates[toCurrency.code]);
        setLastUpdated(new Date().toLocaleString('ko-KR'));
      }
    } catch (error) {
      console.error('환율 가져오기 실패:', error);
      // 기본 환율 (대략적인 값)
      const defaultRates: { [key: string]: { [key: string]: number } } = {
        KRW: {
          USD: 0.00077, EUR: 0.00071, JPY: 0.12, CNY: 0.0056,
          GBP: 0.00061, AUD: 0.0012, CAD: 0.0011, SGD: 0.0010,
          HKD: 0.0061, THB: 0.027, VND: 16.5, PHP: 0.043,
          MYR: 0.0036, IDR: 12.8
        },
        USD: {
          KRW: 1300, EUR: 0.92, JPY: 150, CNY: 7.2,
          GBP: 0.79, AUD: 1.55, CAD: 1.35, SGD: 1.35,
          HKD: 7.8, THB: 35, VND: 24500, PHP: 56,
          MYR: 4.7, IDR: 16600
        }
      };
      
      const rate = defaultRates[fromCurrency.code]?.[toCurrency.code] || 1;
      setExchangeRate(rate);
      setLastUpdated("기본값 (오프라인)");
    } finally {
      setIsLoading(false);
    }
  };

  // 계산된 금액
  const calculatedAmount = (() => {
    const numericAmount = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
    if (!exchangeRate) return 0;
    return numericAmount * exchangeRate;
  })();

  // 페이지 로드 시 환율 가져오기
  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaExchangeAlt className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">환율 계산기</h1>
              <p className="text-gray-600">실시간 환율 변환 및 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2" />
                  변환할 금액
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="금액을 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaGlobe className="inline mr-2" />
                    변환 전 통화
                  </label>
                  <select
                    value={fromCurrency.code}
                    onChange={(e) => {
                      const currency = currencies.find(c => c.code === e.target.value);
                      if (currency) setFromCurrency(currency);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaGlobe className="inline mr-2" />
                    변환 후 통화
                  </label>
                  <select
                    value={toCurrency.code}
                    onChange={(e) => {
                      const currency = currencies.find(c => c.code === e.target.value);
                      if (currency) setToCurrency(currency);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchExchangeRate}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <FaSyncAlt className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? "환율 업데이트 중..." : "환율 새로고침"}
                </button>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">환율 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>현재 환율:</span>
                    <span className="font-semibold">
                      {exchangeRate ? `1 ${fromCurrency.code} = ${exchangeRate.toFixed(4)} ${toCurrency.code}` : "로딩 중..."}
                    </span>
                  </div>
                  {lastUpdated && (
                    <div className="flex justify-between">
                      <span>최종 업데이트:</span>
                      <span className="font-semibold text-xs">{lastUpdated}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">변환 결과</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>변환 전:</span>
                    <span className="font-semibold">
                      {parseFloat(amount.replace(/[^\d.]/g, "") || "0").toLocaleString()} {fromCurrency.code}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>변환 후:</span>
                    <span className="font-semibold text-lg text-black">
                      {calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency.code}
                    </span>
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
            <a href="/customs-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaTruck className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">해외직구 관세</h4>
              <p className="text-xs text-gray-600">관세 계산</p>
            </a>
            
            <a href="/international-transfer-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaExchangeAlt className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">국제송금 수수료</h4>
              <p className="text-xs text-gray-600">송금 수수료</p>
            </a>
            
            <a href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaChartBar className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">부가가치세 계산기</h4>
              <p className="text-xs text-gray-600">VAT 계산</p>
            </a>
            
            <a href="/sales-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaDollarSign className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">판매세 계산기</h4>
              <p className="text-xs text-gray-600">세금 계산</p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 