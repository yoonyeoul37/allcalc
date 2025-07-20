"use client";

import { useState, useEffect } from "react";
import { 
  FaMoneyBillWave, 
  FaCalculator, 
  FaGlobe,
  FaUniversity,
  FaCreditCard,
  FaInfoCircle,
  FaExchangeAlt,
  FaTruck,
  FaChartBar,
  FaDollarSign
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface BankType {
  name: string;
  transferFee: number; // 송금 수수료 (원)
  exchangeFee: number; // 환전 수수료 (%)
  description: string;
}

interface TransferMethod {
  name: string;
  additionalFee: number; // 추가 수수료 (%)
  processingTime: string;
  description: string;
}

const banks: BankType[] = [
  {
    name: "신한은행",
    transferFee: 18000,
    exchangeFee: 0.35,
    description: "기본 수수료 18,000원"
  },
  {
    name: "KB국민은행",
    transferFee: 15000,
    exchangeFee: 0.3,
    description: "기본 수수료 15,000원"
  },
  {
    name: "우리은행",
    transferFee: 16000,
    exchangeFee: 0.32,
    description: "기본 수수료 16,000원"
  },
  {
    name: "하나은행",
    transferFee: 17000,
    exchangeFee: 0.35,
    description: "기본 수수료 17,000원"
  },
  {
    name: "NH농협은행",
    transferFee: 19000,
    exchangeFee: 0.4,
    description: "기본 수수료 19,000원"
  },
  {
    name: "IBK기업은행",
    transferFee: 14000,
    exchangeFee: 0.28,
    description: "기본 수수료 14,000원"
  },
  {
    name: "케이뱅크",
    transferFee: 12000,
    exchangeFee: 0.25,
    description: "기본 수수료 12,000원"
  },
  {
    name: "카카오뱅크",
    transferFee: 13000,
    exchangeFee: 0.3,
    description: "기본 수수료 13,000원"
  },
  {
    name: "토스뱅크",
    transferFee: 10000,
    exchangeFee: 0.2,
    description: "기본 수수료 10,000원"
  },
  {
    name: "새마을금고",
    transferFee: 20000,
    exchangeFee: 0.45,
    description: "기본 수수료 20,000원"
  }
];

const transferMethods: TransferMethod[] = [
  {
    name: "일반 송금",
    additionalFee: 0,
    processingTime: "2-3일",
    description: "기본 송금 방식"
  },
  {
    name: "긴급 송금",
    additionalFee: 0.5,
    processingTime: "1일",
    description: "추가 수수료 0.5%"
  },
  {
    name: "즉시 송금",
    additionalFee: 1.0,
    processingTime: "당일",
    description: "추가 수수료 1.0%"
  }
];

const currencies = [
  { code: "USD", name: "미국 달러", symbol: "$" },
  { code: "EUR", name: "유로", symbol: "€" },
  { code: "JPY", name: "일본 엔", symbol: "¥" },
  { code: "CNY", name: "중국 위안", symbol: "¥" },
  { code: "GBP", name: "영국 파운드", symbol: "£" },
  { code: "AUD", name: "호주 달러", symbol: "A$" },
  { code: "CAD", name: "캐나다 달러", symbol: "C$" },
  { code: "SGD", name: "싱가포르 달러", symbol: "S$" },
  { code: "HKD", name: "홍콩 달러", symbol: "HK$" },
  { code: "THB", name: "태국 바트", symbol: "฿" }
];

export default function InternationalTransferCalculator() {
  const [selectedBank, setSelectedBank] = useState<BankType>(banks[0]);
  const [selectedMethod, setSelectedMethod] = useState<TransferMethod>(transferMethods[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  
  // 송금 정보
  const [transferAmount, setTransferAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // 페이지 로드 시 자동으로 환율 가져오기
  useEffect(() => {
    fetchExchangeRate();
  }, []);
  
  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d.]/g, "");
  };

  // 입력 처리 함수들
  const handleInputChange = (value: string, setter: (value: string) => void) => {
    const numericValue = extractNumber(value);
    const formattedValue = formatNumber(numericValue);
    setter(formattedValue);
  };

  // 환율 자동 가져오기
  const fetchExchangeRate = async () => {
    if (!selectedCurrency.code) return;
    
    setIsLoadingRate(true);
    try {
      // ExchangeRate-API 사용 (무료)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/KRW`);
      const data = await response.json();
      
      if (data.rates && data.rates[selectedCurrency.code]) {
        const rate = 1 / data.rates[selectedCurrency.code]; // KRW 기준으로 변환
        setExchangeRate(rate.toFixed(2));
      }
    } catch (error) {
      console.error('환율 가져오기 실패:', error);
      // 실패 시 기본값 설정
      const defaultRates: { [key: string]: number } = {
        USD: 1300,
        EUR: 1400,
        JPY: 8.5,
        CNY: 180,
        GBP: 1650,
        AUD: 850,
        CAD: 950,
        SGD: 970,
        HKD: 165,
        THB: 37
      };
      setExchangeRate(defaultRates[selectedCurrency.code]?.toString() || "0");
    } finally {
      setIsLoadingRate(false);
    }
  };

  // 송금 수수료 계산
  const calculateFees = (() => {
    const amount = parseFloat(transferAmount.replace(/[^\d.]/g, "")) || 0;
    const rate = parseFloat(exchangeRate.replace(/[^\d.]/g, "")) || 0;
    
    if (amount === 0 || rate === 0) {
      return {
        transferFee: 0,
        exchangeFee: 0,
        additionalFee: 0,
        totalFee: 0,
        totalAmount: 0,
        receivedAmount: 0
      };
    }

    // 송금 수수료
    const transferFee = selectedBank.transferFee;
    
    // 환전 수수료
    const exchangeFee = amount * (selectedBank.exchangeFee / 100);
    
    // 추가 수수료 (긴급/즉시 송금)
    const additionalFee = amount * (selectedMethod.additionalFee / 100);
    
    // 총 수수료
    const totalFee = transferFee + exchangeFee + additionalFee;
    
    // 총 송금 금액 (수수료 포함)
    const totalAmount = amount + totalFee;
    
    // 수취인 받는 금액
    const receivedAmount = amount * rate;

    return {
      transferFee,
      exchangeFee,
      additionalFee,
      totalFee,
      totalAmount,
      receivedAmount
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaMoneyBillWave className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">국제송금 수수료 계산기</h1>
              <p className="text-gray-600">은행별 국제송금 수수료 및 환전 수수료 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUniversity className="inline mr-2 text-black" />
                  은행 선택
                </label>
                <select
                  value={selectedBank.name}
                  onChange={(e) => {
                    const bank = banks.find(b => b.name === e.target.value);
                    if (bank) setSelectedBank(bank);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {banks.map(bank => (
                    <option key={bank.name} value={bank.name}>
                      {bank.name} - {bank.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2 text-black" />
                  송금 통화
                </label>
                <select
                  value={selectedCurrency.code}
                  onChange={(e) => {
                    const currency = currencies.find(c => c.code === e.target.value);
                    if (currency) {
                      setSelectedCurrency(currency);
                      fetchExchangeRate();
                    }
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
                  <FaMoneyBillWave className="inline mr-2 text-black" />
                  송금 금액 (KRW)
                </label>
                <input
                  type="text"
                  value={transferAmount}
                  onChange={(e) => handleInputChange(e.target.value, setTransferAmount)}
                  placeholder="1,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaExchangeAlt className="inline mr-2 text-black" />
                  환율 (KRW/{selectedCurrency.code})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={exchangeRate}
                    onChange={(e) => handleInputChange(e.target.value, setExchangeRate)}
                    placeholder="1300"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                  <button
                    onClick={fetchExchangeRate}
                    disabled={isLoadingRate}
                    className="px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors disabled:opacity-50"
                  >
                    {isLoadingRate ? "로딩..." : "환율"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCreditCard className="inline mr-2 text-black" />
                  송금 방법
                </label>
                <select
                  value={selectedMethod.name}
                  onChange={(e) => {
                    const method = transferMethods.find(m => m.name === e.target.value);
                    if (method) setSelectedMethod(method);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {transferMethods.map(method => (
                    <option key={method.name} value={method.name}>
                      {method.name} - {method.description} ({method.processingTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">수수료 내역</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>송금 수수료:</span>
                    <span className="font-semibold">{calculateFees.transferFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>환전 수수료:</span>
                    <span className="font-semibold">{calculateFees.exchangeFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>추가 수수료:</span>
                    <span className="font-semibold">{calculateFees.additionalFee.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>총 수수료:</span>
                      <span>{calculateFees.totalFee.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">송금 결과</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>송금 금액:</span>
                    <span className="font-semibold">{transferAmount || "0"}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 송금액 (수수료 포함):</span>
                    <span className="font-semibold">{calculateFees.totalAmount.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>수취인 받는 금액:</span>
                      <span>{calculateFees.receivedAmount.toLocaleString()} {selectedCurrency.code}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 정보 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-black mr-3" />
            <h2 className="text-xl font-bold text-gray-800">국제송금 안내</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">환율 정보</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>실시간 환율</strong>: ExchangeRate-API 사용</div>
                <div>• <strong>자동 업데이트</strong>: 통화 변경 시 자동 갱신</div>
                <div>• <strong>수동 입력</strong>: 직접 환율 입력도 가능</div>
                <div>• <strong>오프라인 대응</strong>: API 실패 시 기본값 사용</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">수수료 구성</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>송금 수수료</strong>: 은행별 고정 수수료</div>
                <div>• <strong>환전 수수료</strong>: 송금 금액의 0.2~0.35%</div>
                <div>• <strong>추가 수수료</strong>: 긴급/즉시 송금 시 추가</div>
                <div>• <strong>수취 은행 수수료</strong>: 별도 발생 가능</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">송금 방식별 특징</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• <strong>일반 송금</strong>: 2-3일 소요, 기본 수수료만</div>
                <div>• <strong>긴급 송금</strong>: 1일 소요, +0.5% 수수료</div>
                <div>• <strong>즉시 송금</strong>: 당일 처리, +1.0% 수수료</div>
                <div>• <strong>온라인 뱅킹</strong>: 수수료 할인 혜택 가능</div>
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
            
            <a href="/exchange-rate-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaGlobe className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">환율 계산기</h4>
              <p className="text-xs text-gray-600">환율 변환</p>
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