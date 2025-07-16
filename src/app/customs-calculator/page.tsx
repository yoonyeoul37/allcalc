"use client";

import { useState, useEffect } from "react";
import { 
  FaGlobe, 
  FaShippingFast, 
  FaCalculator, 
  FaInfoCircle,
  FaDollarSign,
  FaBox,
  FaTruck,
  FaSync,
  FaHome,
  FaCreditCard,
  FaPiggyBank,
  FaChartBar,
  FaHandHoldingUsd,
  FaUniversity,
  FaShieldAlt,
  FaUserTie,
  FaGift,
  FaBalanceScale,
  FaUserCog,
  FaExchangeAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import Header from '../../components/ui/Header';

interface CountryData {
  name: string;
  code: string;
  customsRate: number; // 관세율 (%)
  vatRate: number; // 부가세율 (%)
  shippingRates: {
    light: number; // 1kg 이하
    medium: number; // 1-3kg
    heavy: number; // 3kg 이상
  };
}

const countries: CountryData[] = [
  {
    name: "중국",
    code: "CN",
    customsRate: 0, // FTA로 관세 없음
    vatRate: 10,
    shippingRates: { light: 15000, medium: 25000, heavy: 35000 }
  },
  {
    name: "미국",
    code: "US", 
    customsRate: 0, // $200 이하 관세 없음
    vatRate: 10,
    shippingRates: { light: 25000, medium: 35000, heavy: 45000 }
  },
  {
    name: "일본",
    code: "JP",
    customsRate: 0, // $200 이하 관세 없음
    vatRate: 10,
    shippingRates: { light: 12000, medium: 18000, heavy: 25000 }
  },
  {
    name: "유럽연합",
    code: "EU",
    customsRate: 0, // €150 이하 관세 없음
    vatRate: 10,
    shippingRates: { light: 30000, medium: 45000, heavy: 60000 }
  },
  {
    name: "기타국가",
    code: "OTHER",
    customsRate: 8, // 일반 관세율
    vatRate: 10,
    shippingRates: { light: 20000, medium: 30000, heavy: 40000 }
  }
];

const productCategories = [
  { name: "의류/신발", customsRate: 13 },
  { name: "전자제품", customsRate: 8 },
  { name: "화장품", customsRate: 6.5 },
  { name: "식품", customsRate: 5 },
  { name: "도서/문구", customsRate: 0 },
  { name: "스포츠용품", customsRate: 8 },
  { name: "가방/액세서리", customsRate: 13 },
  { name: "기타", customsRate: 8 }
];

export default function CustomsCalculator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(countries[0]);
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);
  const [productPrice, setProductPrice] = useState("");
  const [productPriceDisplay, setProductPriceDisplay] = useState("");
  const [weight, setWeight] = useState("");
  const [weightDisplay, setWeightDisplay] = useState("");
  const [exchangeRate, setExchangeRate] = useState("1300");
  const [exchangeRateDisplay, setExchangeRateDisplay] = useState("1300");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d]/g, "");
  };

  // 가격 입력 처리
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = extractNumber(value);
    setProductPrice(numericValue);
    setProductPriceDisplay(formatNumber(numericValue));
  };

  // 무게 입력 처리
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = extractNumber(value);
    setWeight(numericValue);
    setWeightDisplay(formatNumber(numericValue));
  };

  // 환율 입력 처리
  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = extractNumber(value);
    setExchangeRate(numericValue);
    setExchangeRateDisplay(formatNumber(numericValue));
  };

  // 실시간 환율 가져오기
  const fetchExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      // 무료 환율 API 사용 (예시)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      const krwRate = data.rates.KRW;
      
      setExchangeRate(krwRate.toString());
      setExchangeRateDisplay(krwRate.toLocaleString());
      setLastUpdated(new Date().toLocaleString('ko-KR'));
    } catch (error) {
      console.error('환율 가져오기 실패:', error);
      // 실패 시 기본값 유지
    } finally {
      setIsLoadingRate(false);
    }
  };

  // 컴포넌트 마운트 시 환율 가져오기
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  // 계산 함수들
  const getProductPriceKRW = () => {
    const priceUSD = parseFloat(productPrice) || 0;
    const rate = parseFloat(exchangeRate) || 1300;
    return priceUSD * rate;
  };

  const getShippingCost = () => {
    const weightNum = parseFloat(weight) || 0;
    let rate = selectedCountry.shippingRates.light;
    
    if (weightNum > 3) {
      rate = selectedCountry.shippingRates.heavy;
    } else if (weightNum > 1) {
      rate = selectedCountry.shippingRates.medium;
    }
    
    return rate;
  };

  const getCustomsDuty = () => {
    const priceUSD = parseFloat(productPrice) || 0;
    const priceKRW = getProductPriceKRW();
    
    // 한국 기준: $150 이하 관세 면제
    if (priceUSD <= 150) return 0;
    
    const dutyRate = selectedCountry.customsRate || selectedCategory.customsRate;
    return priceKRW * (dutyRate / 100);
  };

  const getVAT = () => {
    const priceKRW = getProductPriceKRW();
    const shippingCost = getShippingCost();
    const customsDuty = getCustomsDuty();
    return (priceKRW + shippingCost + customsDuty) * (selectedCountry.vatRate / 100);
  };

  const getTotalCost = () => {
    const priceKRW = getProductPriceKRW();
    const shippingCost = getShippingCost();
    const customsDuty = getCustomsDuty();
    const vat = getVAT();
    return priceKRW + shippingCost + customsDuty + vat;
  };

  const priceKRW = getProductPriceKRW();
  const shippingCost = getShippingCost();
  const customsDuty = getCustomsDuty();
  const vat = getVAT();
  const totalCost = getTotalCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaGlobe className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">해외직구 관세 계산기</h1>
              <p className="text-gray-600">국가별 관세, 부가세, 배송비를 포함한 총 비용 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2" />
                  출발 국가
                </label>
                <select 
                  value={selectedCountry.code}
                  onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value) || countries[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaBox className="inline mr-2" />
                  상품 카테고리
                </label>
                <select 
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory(productCategories.find(c => c.name === e.target.value) || productCategories[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                >
                  {productCategories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name} (관세율: {category.customsRate}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="inline mr-2" />
                  상품 가격 (USD)
                </label>
                <input
                  type="text"
                  value={productPriceDisplay}
                  onChange={handlePriceChange}
                  placeholder="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaTruck className="inline mr-2" />
                  상품 무게 (kg)
                </label>
                <input
                  type="text"
                  value={weightDisplay}
                  onChange={handleWeightChange}
                  placeholder="1.5"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaExchangeAlt className="inline mr-2" />
                  환율 (USD/KRW)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={exchangeRateDisplay}
                    onChange={handleExchangeRateChange}
                    placeholder="1300"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  />
                  <button
                    onClick={fetchExchangeRate}
                    disabled={isLoadingRate}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FaSync className={`${isLoadingRate ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-1">마지막 업데이트: {lastUpdated}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaShippingFast className="inline mr-2" />
                  배송 방법
                </label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="standard">일반 배송</option>
                  <option value="express">특급 배송</option>
                  <option value="economy">경제 배송</option>
                </select>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">비용 분석</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="font-medium">상품 가격</span>
                    <span className="font-bold">{priceKRW.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="font-medium">배송비</span>
                    <span className="font-bold">{shippingCost.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="font-medium">관세</span>
                    <span className="font-bold text-red-600">{customsDuty.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="font-medium">부가세</span>
                    <span className="font-bold text-red-600">{vat.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded border-l-4 border-blue-500">
                    <span className="font-medium text-lg">총 비용</span>
                    <span className="font-bold text-blue-600 text-lg">{totalCost.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-start">
                  <FaInfoCircle className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">관세 면제 기준</h4>
                    <p className="text-sm text-yellow-700">
                      $150 이하 상품은 관세가 면제됩니다. 단, 부가세는 별도로 부과됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 계산 버튼 */}
          <div className="mt-6">
            <button
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002244] transition-colors"
            >
              계산 완료
            </button>
          </div>

          {/* 광고 플레이스홀더 */}
          <div className="mt-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-sm">광고 영역</p>
            <p className="text-gray-400 text-xs mt-1">Google AdSense 또는 개인 광고 코드를 여기에 삽입하세요</p>
          </div>
        </div>

        {/* 설명 및 주의사항 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-black" />
            해외직구 관세 계산기 사용법
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">🌍 국가별 관세 정책</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>중국:</strong> FTA로 관세 면제, 부가세 10%</li>
                <li><strong>미국:</strong> $200 이하 관세 면제, 부가세 10%</li>
                <li><strong>일본:</strong> $200 이하 관세 면제, 부가세 10%</li>
                <li><strong>유럽연합:</strong> €150 이하 관세 면제, 부가세 10%</li>
                <li><strong>기타국가:</strong> 일반 관세율 8%, 부가세 10%</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">📦 상품 카테고리별 관세율</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>의류/신발:</strong> 13% (높은 관세율)</li>
                <li><strong>전자제품:</strong> 8% (중간 관세율)</li>
                <li><strong>화장품:</strong> 6.5% (중간 관세율)</li>
                <li><strong>식품:</strong> 5% (낮은 관세율)</li>
                <li><strong>도서/문구:</strong> 0% (관세 면제)</li>
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
                <li>• 이 계산기는 참고용이며, 실제 관세는 세관에서 최종 결정합니다</li>
                <li>• 배송비는 실제 배송업체와 거리, 무게에 따라 달라질 수 있습니다</li>
                <li>• 특정 상품은 추가 검역이나 제한이 있을 수 있습니다</li>
                <li>• 환율은 실시간으로 변동되므로 실제와 차이가 있을 수 있습니다</li>
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
              <a href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDollarSign className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">부가세 계산기</h4>
                <p className="text-xs text-gray-600">VAT 계산</p>
              </a>
              
              <a href="/sales-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChartBar className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">판매세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
              
              <a href="/exchange-rate-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">환율 계산기</h4>
                <p className="text-xs text-gray-600">환율 변환</p>
              </a>
              
              <a href="/international-transfer-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaGlobe className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">해외송금 계산기</h4>
                <p className="text-xs text-gray-600">송금 수수료</p>
              </a>
            </div>
          </div>

        {/* 광고 플레이스홀더 */}
        <div className="mt-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">광고 영역</p>
          <p className="text-gray-400 text-xs mt-1">Google AdSense 또는 개인 광고 코드를 여기에 삽입하세요</p>
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
                <li><a href="/" className="hover:text-white">홈</a></li>
                <li><a href="/mortgage-calculator" className="hover:text-white">대출 계산기</a></li>
                <li><a href="/investment-calculator" className="hover:text-white">투자 계산기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">계산기 카테고리</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-white">금융 계산기</a></li>
                <li><a href="/" className="hover:text-white">건강 계산기</a></li>
                <li><a href="/" className="hover:text-white">학업 계산기</a></li>
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