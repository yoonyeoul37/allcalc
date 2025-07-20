"use client";

import { useState } from "react";

interface ChildInfo {
  age: number;
  custody: 'full' | 'partial' | 'visit'; // 전부양육, 공동양육, 면접교섭
}

export default function ChildSupportCalculator() {
  const [payor, setPayor] = useState({
    monthlyIncome: "",
    bonusIncome: "",
    otherIncome: ""
  });

  const [recipient, setRecipient] = useState({
    monthlyIncome: "",
    bonusIncome: "",
    otherIncome: ""
  });

  const [children, setChildren] = useState<ChildInfo[]>([
    { age: 10, custody: 'full' }
  ]);

  const [specialExpenses, setSpecialExpenses] = useState({
    education: "",
    medical: "",
    other: ""
  });

  const [result, setResult] = useState<any>(null);

  // 숫자 포맷팅 함수
  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 연간소득 계산
  const calculateAnnualIncome = (monthly: string, bonus: string, other: string) => {
    const monthlyNum = parseInt(monthly.replace(/,/g, '') || '0');
    const bonusNum = parseInt(bonus.replace(/,/g, '') || '0');
    const otherNum = parseInt(other.replace(/,/g, '') || '0');
    
    return (monthlyNum * 12) + bonusNum + otherNum;
  };

  // 양육비 산정표 기준 (2024년 기준)
  const getChildSupportAmount = (payorIncome: number, recipientIncome: number, childCount: number, childAges: number[]) => {
    const totalIncome = payorIncome + recipientIncome;
    const payorRatio = payorIncome / totalIncome;

    // 자녀 1인당 기본 양육비 (연령대별)
    let basicAmountPerChild = 0;
    const avgAge = childAges.reduce((sum, age) => sum + age, 0) / childAges.length;

    if (avgAge < 6) {
      // 유아기 (0-5세)
      if (totalIncome <= 30000000) basicAmountPerChild = 200000;
      else if (totalIncome <= 50000000) basicAmountPerChild = 250000;
      else if (totalIncome <= 80000000) basicAmountPerChild = 350000;
      else if (totalIncome <= 120000000) basicAmountPerChild = 450000;
      else basicAmountPerChild = 600000;
    } else if (avgAge < 13) {
      // 초등학교 (6-12세)
      if (totalIncome <= 30000000) basicAmountPerChild = 250000;
      else if (totalIncome <= 50000000) basicAmountPerChild = 300000;
      else if (totalIncome <= 80000000) basicAmountPerChild = 400000;
      else if (totalIncome <= 120000000) basicAmountPerChild = 550000;
      else basicAmountPerChild = 750000;
    } else if (avgAge < 19) {
      // 중고등학교 (13-18세)
      if (totalIncome <= 30000000) basicAmountPerChild = 300000;
      else if (totalIncome <= 50000000) basicAmountPerChild = 400000;
      else if (totalIncome <= 80000000) basicAmountPerChild = 500000;
      else if (totalIncome <= 120000000) basicAmountPerChild = 700000;
      else basicAmountPerChild = 900000;
    } else {
      // 성인 자녀 (19세 이상)
      if (totalIncome <= 30000000) basicAmountPerChild = 200000;
      else if (totalIncome <= 50000000) basicAmountPerChild = 300000;
      else if (totalIncome <= 80000000) basicAmountPerChild = 400000;
      else if (totalIncome <= 120000000) basicAmountPerChild = 550000;
      else basicAmountPerChild = 700000;
    }

    // 자녀 수에 따른 할인율 적용
    let discountRate = 1;
    if (childCount === 2) discountRate = 0.9;
    else if (childCount === 3) discountRate = 0.8;
    else if (childCount >= 4) discountRate = 0.7;

    const totalBasicAmount = basicAmountPerChild * childCount * discountRate;
    const payorSupport = totalBasicAmount * payorRatio;

    return {
      totalBasicAmount: Math.round(totalBasicAmount),
      payorSupport: Math.round(payorSupport),
      recipientSupport: Math.round(totalBasicAmount - payorSupport),
      payorRatio: Math.round(payorRatio * 100)
    };
  };

  // 계산 실행
  const calculateSupport = () => {
    const payorAnnualIncome = calculateAnnualIncome(payor.monthlyIncome, payor.bonusIncome, payor.otherIncome);
    const recipientAnnualIncome = calculateAnnualIncome(recipient.monthlyIncome, recipient.bonusIncome, recipient.otherIncome);

    if (payorAnnualIncome <= 0) {
      alert('양육비 지급의무자의 소득을 입력해주세요.');
      return;
    }

    const childAges = children.map(child => child.age);
    const basicSupport = getChildSupportAmount(payorAnnualIncome, recipientAnnualIncome, children.length, childAges);

    // 특별양육비 계산
    const specialEducation = parseInt(specialExpenses.education.replace(/,/g, '') || '0');
    const specialMedical = parseInt(specialExpenses.medical.replace(/,/g, '') || '0');
    const specialOther = parseInt(specialExpenses.other.replace(/,/g, '') || '0');
    const totalSpecialExpenses = specialEducation + specialMedical + specialOther;

    const specialExpensesByPayor = Math.round(totalSpecialExpenses * (basicSupport.payorRatio / 100));

    // 최종 양육비 계산
    const monthlyBasicSupport = Math.round(basicSupport.payorSupport / 12);
    const monthlySpecialSupport = Math.round(specialExpensesByPayor / 12);
    const totalMonthlySupport = monthlyBasicSupport + monthlySpecialSupport;

    setResult({
      payorIncome: payorAnnualIncome,
      recipientIncome: recipientAnnualIncome,
      totalIncome: payorAnnualIncome + recipientAnnualIncome,
      basicSupport,
      specialExpenses: {
        total: totalSpecialExpenses,
        payorShare: specialExpensesByPayor
      },
      monthlySupport: {
        basic: monthlyBasicSupport,
        special: monthlySpecialSupport,
        total: totalMonthlySupport
      }
    });
  };

  // 자녀 추가
  const addChild = () => {
    if (children.length < 5) {
      setChildren([...children, { age: 10, custody: 'full' }]);
    }
  };

  // 자녀 제거
  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  // 자녀 정보 업데이트
  const updateChild = (index: number, field: keyof ChildInfo, value: any) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">양육비 계산기</h1>
        <p className="text-gray-600">법원 양육비 산정표 기준으로 양육비를 계산합니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 양육비 지급의무자 정보 */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">양육비 지급의무자 소득</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                월 소득 (세후)
              </label>
              <input
                type="text"
                value={payor.monthlyIncome}
                onChange={(e) => setPayor({...payor, monthlyIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 3,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연간 상여금
              </label>
              <input
                type="text"
                value={payor.bonusIncome}
                onChange={(e) => setPayor({...payor, bonusIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 10,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기타 소득 (연간)
              </label>
              <input
                type="text"
                value={payor.otherIncome}
                onChange={(e) => setPayor({...payor, otherIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="예: 5,000,000"
              />
            </div>
          </div>
        </div>

        {/* 양육권자 정보 */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-4">양육권자 소득</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                월 소득 (세후)
              </label>
              <input
                type="text"
                value={recipient.monthlyIncome}
                onChange={(e) => setRecipient({...recipient, monthlyIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="예: 2,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연간 상여금
              </label>
              <input
                type="text"
                value={recipient.bonusIncome}
                onChange={(e) => setRecipient({...recipient, bonusIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="예: 5,000,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기타 소득 (연간)
              </label>
              <input
                type="text"
                value={recipient.otherIncome}
                onChange={(e) => setRecipient({...recipient, otherIncome: formatNumber(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="예: 2,000,000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 자녀 정보 */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-800">자녀 정보</h2>
          <button
            onClick={addChild}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
            disabled={children.length >= 5}
          >
            자녀 추가
          </button>
        </div>

        {children.map((child, index) => (
          <div key={index} className="flex items-center gap-4 mb-3 p-3 bg-white rounded-md">
            <span className="text-sm font-medium text-gray-700 w-16">자녀 {index + 1}</span>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">나이:</label>
              <input
                type="number"
                value={child.age}
                onChange={(e) => updateChild(index, 'age', parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-300 rounded-md text-center"
                min="0"
                max="30"
              />
              <span className="text-sm text-gray-600">세</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">양육형태:</label>
              <select
                value={child.custody}
                onChange={(e) => updateChild(index, 'custody', e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="full">전부양육</option>
                <option value="partial">공동양육</option>
                <option value="visit">면접교섭</option>
              </select>
            </div>

            {children.length > 1 && (
              <button
                onClick={() => removeChild(index)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 특별양육비 */}
      <div className="mt-8 bg-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">특별양육비 (연간)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              교육비 (학원, 과외 등)
            </label>
            <input
              type="text"
              value={specialExpenses.education}
              onChange={(e) => setSpecialExpenses({...specialExpenses, education: formatNumber(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="예: 10,000,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              의료비
            </label>
            <input
              type="text"
              value={specialExpenses.medical}
              onChange={(e) => setSpecialExpenses({...specialExpenses, medical: formatNumber(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="예: 2,000,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기타 비용
            </label>
            <input
              type="text"
              value={specialExpenses.other}
              onChange={(e) => setSpecialExpenses({...specialExpenses, other: formatNumber(e.target.value)})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="예: 3,000,000"
            />
          </div>
        </div>
      </div>

      {/* 계산 버튼 */}
      <div className="mt-8 text-center">
        <button
          onClick={calculateSupport}
          className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          양육비 계산하기
        </button>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">양육비 계산 결과</h2>

          {/* 소득 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">지급의무자 소득</h3>
              <p className="text-2xl font-bold text-gray-800">
                {result.payorIncome.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-600">연간</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-green-600 mb-2">양육권자 소득</h3>
              <p className="text-2xl font-bold text-gray-800">
                {result.recipientIncome.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-600">연간</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-purple-600 mb-2">총 소득</h3>
              <p className="text-2xl font-bold text-gray-800">
                {result.totalIncome.toLocaleString()}원
              </p>
              <p className="text-sm text-gray-600">연간</p>
            </div>
          </div>

          {/* 양육비 계산 내역 */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">양육비 계산 내역</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">기본 양육비 (연간)</span>
                <span className="font-semibold">{result.basicSupport.totalBasicAmount.toLocaleString()}원</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">지급의무자 부담 비율</span>
                <span className="font-semibold text-blue-600">{result.basicSupport.payorRatio}%</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">지급의무자 기본 양육비 (연간)</span>
                <span className="font-semibold text-blue-600">{result.basicSupport.payorSupport.toLocaleString()}원</span>
              </div>

              {result.specialExpenses.total > 0 && (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">특별양육비 총액 (연간)</span>
                    <span className="font-semibold">{result.specialExpenses.total.toLocaleString()}원</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-700">지급의무자 특별양육비 (연간)</span>
                    <span className="font-semibold text-purple-600">{result.specialExpenses.payorShare.toLocaleString()}원</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 월별 양육비 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">월별 지급 양육비</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">기본 양육비</p>
                <p className="text-2xl font-bold">{result.monthlySupport.basic.toLocaleString()}원</p>
              </div>
              
              {result.monthlySupport.special > 0 && (
                <div className="text-center">
                  <p className="text-sm opacity-90">특별양육비</p>
                  <p className="text-2xl font-bold">{result.monthlySupport.special.toLocaleString()}원</p>
                </div>
              )}
              
              <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-sm opacity-90">총 월별 양육비</p>
                <p className="text-3xl font-bold">{result.monthlySupport.total.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          {/* 분석 및 팁 */}
          <div className="mt-6 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">📋 양육비 산정 안내</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• 이 계산은 법원 양육비 산정표를 기준으로 한 예상 금액입니다.</p>
              <p>• 실제 양육비는 법원의 판단에 따라 달라질 수 있습니다.</p>
              <p>• 특별한 사정(장애, 질병 등)이 있는 경우 추가 양육비가 인정될 수 있습니다.</p>
              <p>• 양육비는 소득 변동, 자녀의 성장에 따라 조정이 가능합니다.</p>
              <p>• 양육비 불이행 시 이행명령, 재산명시, 감치명령 등의 강제집행이 가능합니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 