'use client';

import { useState } from 'react';
import { FaCalculator, FaGift, FaHome, FaMoneyBillWave, FaInfoCircle, FaPlus, FaTrash, FaDollarSign, FaChartBar, FaUserTie, FaShieldAlt } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

interface PropertyItem {
  id: string;
  type: 'residential' | 'commercial' | 'land' | 'building';
  value: string;
  tax: number;
}

const inheritanceTaxBrackets: TaxBracket[] = [
  { min: 0, max: 100000000, rate: 0.10, deduction: 0 },
  { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },
  { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },
  { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 },
  { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }
];

const giftTaxBrackets: TaxBracket[] = [
  { min: 0, max: 100000000, rate: 0.10, deduction: 0 },
  { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },
  { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },
  { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 },
  { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }
];

const propertyTaxRates = {
  residential: 0.0014, // 주택
  commercial: 0.0025,  // 상가
  land: 0.002,         // 토지
  building: 0.0025     // 건물
};

const propertyTypeLabels = {
  residential: '주택',
  commercial: '상가',
  land: '토지',
  building: '건물'
};

export default function InheritanceGiftPropertyTaxCalculator() {
  const [activeTab, setActiveTab] = useState<'inheritance' | 'gift' | 'property'>('inheritance');
  
  // 상속세 관련 상태
  const [inheritanceAmount, setInheritanceAmount] = useState('');
  const [inheritanceDeduction, setInheritanceDeduction] = useState('');
  const [inheritanceTaxableAmount, setInheritanceTaxableAmount] = useState(0);
  const [inheritanceTax, setInheritanceTax] = useState(0);
  
  // 증여세 관련 상태
  const [giftAmount, setGiftAmount] = useState('');
  const [giftDeduction, setGiftDeduction] = useState('');
  const [giftTaxableAmount, setGiftTaxableAmount] = useState(0);
  const [giftTax, setGiftTax] = useState(0);
  
  // 재산세 관련 상태
  const [propertyItems, setPropertyItems] = useState<PropertyItem[]>([
    { id: '1', type: 'residential', value: '', tax: 0 }
  ]);
  const [totalPropertyTax, setTotalPropertyTax] = useState(0);
  const [totalPropertyValue, setTotalPropertyValue] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateInheritanceTax = () => {
    const amount = parseNumber(inheritanceAmount);
    const deduction = parseNumber(inheritanceDeduction);
    const taxableAmount = Math.max(0, amount - deduction);
    
    let tax = 0;
    for (const bracket of inheritanceTaxBrackets) {
      if (taxableAmount > bracket.min) {
        const bracketAmount = Math.min(taxableAmount - bracket.min, bracket.max - bracket.min);
        tax += bracketAmount * bracket.rate;
      }
    }
    
    setInheritanceTaxableAmount(taxableAmount);
    setInheritanceTax(tax);
  };

  const calculateGiftTax = () => {
    const amount = parseNumber(giftAmount);
    const deduction = parseNumber(giftDeduction);
    const taxableAmount = Math.max(0, amount - deduction);
    
    let tax = 0;
    for (const bracket of giftTaxBrackets) {
      if (taxableAmount > bracket.min) {
        const bracketAmount = Math.min(taxableAmount - bracket.min, bracket.max - bracket.min);
        tax += bracketAmount * bracket.rate;
      }
    }
    
    setGiftTaxableAmount(taxableAmount);
    setGiftTax(tax);
  };

  const calculatePropertyTax = () => {
    let totalTax = 0;
    let totalValue = 0;
    
    const updatedItems = propertyItems.map(item => {
      const value = parseNumber(item.value);
      const rate = propertyTaxRates[item.type];
      const tax = value * rate;
      totalTax += tax;
      totalValue += value;
      
      return { ...item, tax };
    });
    
    setPropertyItems(updatedItems);
    setTotalPropertyTax(totalTax);
    setTotalPropertyValue(totalValue);
  };

  const addPropertyItem = () => {
    const newId = (propertyItems.length + 1).toString();
    setPropertyItems([...propertyItems, { id: newId, type: 'residential', value: '', tax: 0 }]);
  };

  const removePropertyItem = (id: string) => {
    if (propertyItems.length > 1) {
      setPropertyItems(propertyItems.filter(item => item.id !== id));
    }
  };

  const updatePropertyItem = (id: string, field: 'type' | 'value', value: string) => {
    setPropertyItems(propertyItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getTaxBracketInfo = (amount: number, brackets: TaxBracket[]) => {
    for (const bracket of brackets) {
      if (amount > bracket.min && amount <= bracket.max) {
        return bracket;
      }
    }
    return brackets[brackets.length - 1];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaCalculator className="mr-3 text-black" />
            상속세/증여세/재산세 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            상속세, 증여세, 재산세를 한 번에 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('inheritance')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'inheritance'
                  ? 'bg-[#003366] text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaMoneyBillWave className="inline mr-2" />
              상속세
            </button>
            <button
              onClick={() => setActiveTab('gift')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'gift'
                  ? 'bg-[#003366] text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaGift className="inline mr-2" />
              증여세
            </button>
            <button
              onClick={() => setActiveTab('property')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'property'
                  ? 'bg-[#003366] text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaHome className="inline mr-2" />
              재산세
            </button>
          </div>

          {/* 상속세 탭 */}
          {activeTab === 'inheritance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상속재산가액 (원)</label>
                  <input
                    type="text"
                    value={inheritanceAmount}
                    onChange={(e) => setInheritanceAmount(formatNumber(e.target.value))}
                    placeholder="1,000,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">공제액 (원)</label>
                  <input
                    type="text"
                    value={inheritanceDeduction}
                    onChange={(e) => setInheritanceDeduction(formatNumber(e.target.value))}
                    placeholder="500,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={calculateInheritanceTax}
                className="w-full py-3 px-6 rounded-lg bg-[#003366] text-white font-bold hover:bg-[#002244] transition-colors"
              >
                상속세 계산하기
              </button>
              {inheritanceTax > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">상속세 계산 결과</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>과세표준:</span>
                      <span className="font-semibold">{inheritanceTaxableAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>상속세:</span>
                      <span className="font-semibold text-red-600">{inheritanceTax.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 증여세 탭 */}
          {activeTab === 'gift' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">증여재산가액 (원)</label>
                  <input
                    type="text"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(formatNumber(e.target.value))}
                    placeholder="100,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">공제액 (원)</label>
                  <input
                    type="text"
                    value={giftDeduction}
                    onChange={(e) => setGiftDeduction(formatNumber(e.target.value))}
                    placeholder="50,000,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={calculateGiftTax}
                className="w-full py-3 px-6 rounded-lg bg-[#003366] text-white font-bold hover:bg-[#002244] transition-colors"
              >
                증여세 계산하기
              </button>
              {giftTax > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">증여세 계산 결과</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>과세표준:</span>
                      <span className="font-semibold">{giftTaxableAmount.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>증여세:</span>
                      <span className="font-semibold text-red-600">{giftTax.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 재산세 탭 */}
          {activeTab === 'property' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {propertyItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">재산 유형</label>
                      <select
                        value={item.type}
                        onChange={(e) => updatePropertyItem(item.id, 'type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      >
                        <option value="residential">주택</option>
                        <option value="commercial">상가</option>
                        <option value="land">토지</option>
                        <option value="building">건물</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">재산가액 (원)</label>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updatePropertyItem(item.id, 'value', formatNumber(e.target.value))}
                        placeholder="100,000,000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removePropertyItem(item.id)}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={addPropertyItem}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaPlus className="inline mr-2" />
                  재산 추가
                </button>
                <button
                  onClick={calculatePropertyTax}
                  className="px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors"
                >
                  재산세 계산하기
                </button>
              </div>
              {totalPropertyTax > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-black mb-3">재산세 계산 결과</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>총 재산가액:</span>
                      <span className="font-semibold">{totalPropertyValue.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span>총 재산세:</span>
                      <span className="font-semibold text-red-600">{totalPropertyTax.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 관련 계산기 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalculator className="mr-2 text-black" />
            관련 계산기
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaDollarSign className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
              <p className="text-xs text-gray-600">소득세 계산</p>
            </a>
            
            <a href="/vat-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaChartBar className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">부가가치세 계산기</h4>
              <p className="text-xs text-gray-600">VAT 계산</p>
            </a>
            
            <a href="/salary-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
              <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserTie className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">프리랜서 세금</h4>
              <p className="text-xs text-gray-600">프리랜서 세금</p>
            </a>
            
            <a href="/social-insurance-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaShieldAlt className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">4대보험 계산기</h4>
              <p className="text-xs text-gray-600">보험료 계산</p>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 