'use client';

import { useState } from 'react';
import { FaCalculator, FaGift, FaHome, FaMoneyBillWave, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import Header from '../../components/ui/Header';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                  ? 'bg-blue-600 text-white shadow-md'
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
                  ? 'bg-green-600 text-white shadow-md'
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
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <FaHome className="inline mr-2" />
              재산세
            </button>
          </div>

          {activeTab === 'inheritance' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상속재산가액 (원)
                  </label>
                  <input
                    type="text"
                    value={inheritanceAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setInheritanceAmount(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1,000,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공제액 (원)
                  </label>
                  <input
                    type="text"
                    value={inheritanceDeduction}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setInheritanceDeduction(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 100,000,000"
                  />
                </div>
              </div>

              <button
                onClick={calculateInheritanceTax}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                상속세 계산하기
              </button>

              {inheritanceTax > 0 && (
                <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-4">상속세 계산 결과</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">과세표준</p>
                      <p className="text-xl font-bold text-black">
                        {inheritanceTaxableAmount.toLocaleString()}원
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">상속세액</p>
                      <p className="text-xl font-bold text-red-600">
                        {inheritanceTax.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">적용 세율</p>
                    <p className="text-lg font-semibold text-black">
                      {getTaxBracketInfo(inheritanceTaxableAmount, inheritanceTaxBrackets).rate * 100}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gift' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    증여재산가액 (원)
                  </label>
                  <input
                    type="text"
                    value={giftAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setGiftAmount(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="예: 50,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공제액 (원)
                  </label>
                  <input
                    type="text"
                    value={giftDeduction}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setGiftDeduction(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="예: 10,000,000"
                  />
                </div>
              </div>

              <button
                onClick={calculateGiftTax}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                증여세 계산하기
              </button>

              {giftTax > 0 && (
                <div className="bg-green-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-4">증여세 계산 결과</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">과세표준</p>
                      <p className="text-xl font-bold text-black">
                        {giftTaxableAmount.toLocaleString()}원
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-600">증여세액</p>
                      <p className="text-xl font-bold text-red-600">
                        {giftTax.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">적용 세율</p>
                    <p className="text-lg font-semibold text-black">
                      {getTaxBracketInfo(giftTaxableAmount, giftTaxBrackets).rate * 100}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'property' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {propertyItems.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-800">재산 {index + 1}</h4>
                      {propertyItems.length > 1 && (
                        <button
                          onClick={() => removePropertyItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          재산 유형
                        </label>
                        <select
                          value={item.type}
                          onChange={(e) => updatePropertyItem(item.id, 'type', e.target.value as any)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="residential">주택</option>
                          <option value="commercial">상가</option>
                          <option value="land">토지</option>
                          <option value="building">건물</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          재산가액 (원)
                        </label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            updatePropertyItem(item.id, 'value', formatNumber(value));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="예: 500,000,000"
                        />
                      </div>
                    </div>
                    {item.tax > 0 && (
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {propertyTypeLabels[item.type]} 세율: {(propertyTaxRates[item.type] * 100).toFixed(2)}%
                          </span>
                          <span className="font-semibold text-black">
                            {item.tax.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addPropertyItem}
                className="w-full border-2 border-dashed border-gray-300 text-black py-3 rounded-lg font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                <FaPlus className="inline mr-2" />
                재산 추가하기
              </button>

              <button
                onClick={calculatePropertyTax}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                재산세 계산하기
              </button>

              {totalPropertyTax > 0 && (
                <div className="bg-purple-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-black mb-4">재산세 계산 결과</h3>
                  
                  <div className="space-y-3">
                    {propertyItems.filter(item => item.tax > 0).map((item, index) => (
                      <div key={item.id} className="bg-white p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{propertyTypeLabels[item.type]}</p>
                            <p className="text-sm text-gray-600">
                              {parseNumber(item.value).toLocaleString()}원 × {(propertyTaxRates[item.type] * 100).toFixed(2)}%
                            </p>
                          </div>
                          <p className="text-lg font-bold text-black">
                            {item.tax.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">총 재산가액</p>
                        <p className="text-xl font-bold text-black">
                          {totalPropertyValue.toLocaleString()}원
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">총 재산세액</p>
                        <p className="text-xl font-bold text-red-600">
                          {totalPropertyTax.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-black" />
            세금 정보 안내
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">상속세</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 기본공제: 1억원</li>
                <li>• 배우자공제: 5억원</li>
                <li>• 자녀공제: 5천만원</li>
                <li>• 세율: 10%~50%</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">증여세</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 기본공제: 1천만원</li>
                <li>• 배우자공제: 5억원</li>
                <li>• 자녀공제: 5천만원</li>
                <li>• 세율: 10%~50%</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-2">재산세</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 주택: 0.14%</li>
                <li>• 상가: 0.25%</li>
                <li>• 토지: 0.20%</li>
                <li>• 건물: 0.25%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 