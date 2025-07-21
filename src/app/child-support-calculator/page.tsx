"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaChild, FaUser, FaMoneyBillWave, FaHeart, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface ChildInfo {
  age: number;
  custody: 'mother' | 'father' | 'shared';
}

interface IncomeInfo {
  monthlyIncome: number;
  additionalIncome: number;
  expenses: number;
}

export default function ChildSupportCalculator() {
  const [fatherIncome, setFatherIncome] = useState('');
  const [motherIncome, setMotherIncome] = useState('');
  const [fatherAdditionalIncome, setFatherAdditionalIncome] = useState('');
  const [motherAdditionalIncome, setMotherAdditionalIncome] = useState('');
  const [fatherExpenses, setFatherExpenses] = useState('');
  const [motherExpenses, setMotherExpenses] = useState('');
  const [children, setChildren] = useState<ChildInfo[]>([
    { age: 5, custody: 'mother' }
  ]);
  const [custodyType, setCustodyType] = useState<'sole' | 'shared'>('sole');
  const [marriageDuration, setMarriageDuration] = useState('');
  const [fault, setFault] = useState<'none' | 'father' | 'mother' | 'both'>('none');
  
  const [monthlySupport, setMonthlySupport] = useState(0);
  const [totalSupport, setTotalSupport] = useState(0);
  const [supportPeriod, setSupportPeriod] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const addChild = () => {
    setChildren([...children, { age: 5, custody: 'mother' }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof ChildInfo, value: any) => {
    const updatedChildren = [...children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    setChildren(updatedChildren);
  };

  const calculateSupport = () => {
    if (!fatherIncome || !motherIncome) {
      alert('부모의 소득 정보를 입력해주세요.');
      return;
    }

    const fatherTotalIncome = parseNumber(fatherIncome) + parseNumber(fatherAdditionalIncome);
    const motherTotalIncome = parseNumber(motherIncome) + parseNumber(motherAdditionalIncome);
    const fatherNetIncome = fatherTotalIncome - parseNumber(fatherExpenses);
    const motherNetIncome = motherTotalIncome - parseNumber(motherExpenses);

    // 기본 양육비 계산 (소득 비율 기준)
    const totalNetIncome = fatherNetIncome + motherNetIncome;
    const fatherRatio = fatherNetIncome / totalNetIncome;
    const motherRatio = motherNetIncome / totalNetIncome;

    // 자녀별 기본 양육비 (연령별 차등)
    let totalMonthlySupport = 0;
    children.forEach(child => {
      let childSupport = 0;
      
      // 연령별 기본 양육비
      if (child.age < 6) {
        childSupport = 800000; // 미취학 아동
      } else if (child.age < 12) {
        childSupport = 1000000; // 초등학생
      } else if (child.age < 15) {
        childSupport = 1200000; // 중학생
      } else if (child.age < 18) {
        childSupport = 1400000; // 고등학생
      } else {
        childSupport = 1600000; // 대학생
      }

      // 양육권자에 따른 조정
      if (child.custody === 'mother') {
        totalMonthlySupport += childSupport * fatherRatio;
      } else if (child.custody === 'father') {
        totalMonthlySupport += childSupport * motherRatio;
      } else {
        // 공동양육의 경우 각각 부담
        totalMonthlySupport += childSupport * 0.5;
      }
    });

    // 혼인 기간 조정
    const marriageYears = parseInt(marriageDuration) || 0;
    if (marriageYears > 10) {
      totalMonthlySupport *= 1.1; // 10년 이상 혼인 시 10% 증가
    }

    // 귀책사유 조정
    if (fault === 'father') {
      totalMonthlySupport *= 1.2; // 남편 귀책 시 20% 증가
    } else if (fault === 'mother') {
      totalMonthlySupport *= 0.8; // 아내 귀책 시 20% 감소
    }

    // 최저/최고 한도 적용
    const minSupport = 300000; // 월 30만원 최저
    const maxSupport = totalNetIncome * 0.3; // 총 소득의 30% 최고

    totalMonthlySupport = Math.max(minSupport, Math.min(maxSupport, totalMonthlySupport));

    // 총 양육비 계산 (자녀가 18세까지)
    const oldestChild = Math.max(...children.map(c => c.age));
    const remainingYears = Math.max(0, 18 - oldestChild);
    const totalSupportAmount = totalMonthlySupport * 12 * remainingYears;

    setMonthlySupport(totalMonthlySupport);
    setTotalSupport(totalSupportAmount);
    setSupportPeriod(remainingYears);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaChild className="mr-3 text-[#003366]" />
              양육비 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#003366]" />
                  아버지 소득 정보
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월 소득 (원)
                    </label>
                    <input
                      type="text"
                      value={fatherIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setFatherIncome(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 3,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      추가 소득 (원)
                    </label>
                    <input
                      type="text"
                      value={fatherAdditionalIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setFatherAdditionalIncome(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 500,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월 지출 (원)
                    </label>
                    <input
                      type="text"
                      value={fatherExpenses}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setFatherExpenses(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 1,500,000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#003366]" />
                  어머니 소득 정보
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월 소득 (원)
                    </label>
                    <input
                      type="text"
                      value={motherIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setMotherIncome(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 2,500,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      추가 소득 (원)
                    </label>
                    <input
                      type="text"
                      value={motherAdditionalIncome}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setMotherAdditionalIncome(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 300,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      월 지출 (원)
                    </label>
                    <input
                      type="text"
                      value={motherExpenses}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setMotherExpenses(formatNumber(value));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 1,200,000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  혼인 기간 (년)
                </label>
                <input
                  type="number"
                  value={marriageDuration}
                  onChange={(e) => setMarriageDuration(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  귀책사유
                </label>
                <select
                  value={fault}
                  onChange={(e) => setFault(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="none">무과실</option>
                  <option value="father">남편 귀책</option>
                  <option value="mother">아내 귀책</option>
                  <option value="both">상호 귀책</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  양육권
                </label>
                <select
                  value={custodyType}
                  onChange={(e) => setCustodyType(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="sole">단독양육</option>
                  <option value="shared">공동양육</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateSupport}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {monthlySupport > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">월 양육비</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {monthlySupport.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 양육비</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {totalSupport.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">지급 기간</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {supportPeriod}년
                    </p>
                  </div>
                </div>
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
              <Link href="/alimony-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHeart className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">위자료 계산기</h4>
                <p className="text-xs text-gray-600">위자료 계산</p>
              </Link>
              
              <Link href="/personal-rehabilitation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">개인회생 변제금</h4>
                <p className="text-xs text-gray-600">변제금 계산</p>
              </Link>
              
              <Link href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </Link>
              
              <Link href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
