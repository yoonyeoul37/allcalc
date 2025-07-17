'use client';

import { useState } from 'react';
import { FaUser, FaChild, FaMoneyBillWave, FaInfoCircle, FaCalculator, FaHeart } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaChild className="mr-3 text-slate-600" />
            양육비 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            법원 양육비 산정표 기준으로 양육비를 계산해보세요
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-slate-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 1,500,000"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-slate-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 1,200,000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChild className="mr-2 text-slate-600" />
              자녀 정보
            </h3>
            {children.map((child, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">자녀 {index + 1}</h4>
                  {children.length > 1 && (
                    <button
                      onClick={() => removeChild(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      나이
                    </label>
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      min="0"
                      max="25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      양육권자
                    </label>
                    <select
                      value={child.custody}
                      onChange={(e) => updateChild(index, 'custody', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    >
                      <option value="mother">어머니</option>
                      <option value="father">아버지</option>
                      <option value="shared">공동양육</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addChild}
              className="w-full bg-slate-100 text-slate-600 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              자녀 추가
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                혼인 기간 (년)
              </label>
              <input
                type="number"
                value={marriageDuration}
                onChange={(e) => setMarriageDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="예: 8"
                min="0"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                양육 형태
              </label>
              <select
                value={custodyType}
                onChange={(e) => setCustodyType(e.target.value as 'sole' | 'shared')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="sole">단독양육</option>
                <option value="shared">공동양육</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                귀책사유
              </label>
              <select
                value={fault}
                onChange={(e) => setFault(e.target.value as 'none' | 'father' | 'mother' | 'both')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="none">해당없음</option>
                <option value="father">남편 귀책</option>
                <option value="mother">아내 귀책</option>
                <option value="both">상호 귀책</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateSupport}
            className="w-full bg-slate-600 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors mt-6"
          >
            양육비 계산하기
          </button>

          {monthlySupport > 0 && (
            <div className="bg-slate-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">양육비 계산 결과</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">월 양육비</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {monthlySupport.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">총 양육비</p>
                  <p className="text-xl font-bold text-gray-800">
                    {totalSupport.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">양육 기간</p>
                  <p className="text-lg font-bold text-gray-800">
                    {supportPeriod}년
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">상세 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>아버지 순소득:</span>
                    <span>{(parseNumber(fatherIncome) + parseNumber(fatherAdditionalIncome) - parseNumber(fatherExpenses)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>어머니 순소득:</span>
                    <span>{(parseNumber(motherIncome) + parseNumber(motherAdditionalIncome) - parseNumber(motherExpenses)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>자녀 수:</span>
                    <span>{children.length}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>혼인 기간:</span>
                    <span>{marriageDuration || 0}년</span>
                  </div>
                  <div className="flex justify-between">
                    <span>양육 형태:</span>
                    <span>{custodyType === 'sole' ? '단독양육' : '공동양육'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>귀책사유:</span>
                    <span>
                      {fault === 'none' ? '해당없음' : 
                       fault === 'father' ? '남편 귀책' :
                       fault === 'mother' ? '아내 귀책' : '상호 귀책'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-slate-600" />
            양육비 계산 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">양육비 계산 요소</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 부모의 소득 및 지출</li>
                <li>• 자녀의 나이 및 수</li>
                <li>• 양육권자 및 양육 형태</li>
                <li>• 혼인 기간</li>
                <li>• 귀책사유</li>
                <li>• 연령별 기본 양육비</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">주의사항</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 최저 양육비: 월 30만원</li>
                <li>• 최고 양육비: 총 소득의 30%</li>
                <li>• 실제 양육비는 법원이 결정</li>
                <li>• 상황에 따라 조정 가능</li>
                <li>• 정기적인 재산조사 필요</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">양육비란?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 양육비는 이혼 후 자녀를 양육하지 않는 부모가 자녀를 양육하는 부모에게 지급하는 비용입니다.</p>
              <p>• 양육비는 자녀의 교육비, 의료비, 생활비 등을 포함합니다.</p>
              <p>• 양육비는 부모의 소득, 자녀의 나이, 양육 상황 등을 종합적으로 고려하여 결정됩니다.</p>
              <p>• 양육비는 자녀가 성년이 될 때까지 지급되며, 상황에 따라 조정될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 