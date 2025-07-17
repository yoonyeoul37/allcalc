'use client';

import { useState } from 'react';
import { FaHeart, FaMoneyBillWave, FaInfoCircle, FaCalculator, FaUser, FaGavel } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface FaultFactor {
  type: string;
  multiplier: number;
  description: string;
}

const faultFactors: FaultFactor[] = [
  { type: '무과실', multiplier: 1.0, description: '상호 합의 이혼' },
  { type: '배우자 일방 귀책', multiplier: 1.3, description: '일방 귀책 시 30% 증가' },
  { type: '중대한 귀책', multiplier: 1.5, description: '중대한 귀책 시 50% 증가' },
  { type: '폭력/학대', multiplier: 2.0, description: '폭력/학대 시 100% 증가' },
  { type: '부정행위', multiplier: 1.8, description: '부정행위 시 80% 증가' }
];

export default function AlimonyCalculator() {
  const [marriageDuration, setMarriageDuration] = useState('');
  const [husbandIncome, setHusbandIncome] = useState('');
  const [wifeIncome, setWifeIncome] = useState('');
  const [husbandAssets, setHusbandAssets] = useState('');
  const [wifeAssets, setWifeAssets] = useState('');
  const [faultType, setFaultType] = useState('무과실');
  const [wifeAge, setWifeAge] = useState('');
  const [wifeEducation, setWifeEducation] = useState('고등학교');
  const [wifeCareer, setWifeCareer] = useState('none');
  const [childrenCount, setChildrenCount] = useState('0');
  const [wifeHealth, setWifeHealth] = useState('healthy');
  
  const [monthlyAlimony, setMonthlyAlimony] = useState(0);
  const [totalAlimony, setTotalAlimony] = useState(0);
  const [alimonyPeriod, setAlimonyPeriod] = useState(0);

  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string) => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  const calculateAlimony = () => {
    const marriageYears = parseInt(marriageDuration) || 0;
    const husbandMonthlyIncome = parseNumber(husbandIncome);
    const wifeMonthlyIncome = parseNumber(wifeIncome);
    const husbandTotalAssets = parseNumber(husbandAssets);
    const wifeTotalAssets = parseNumber(wifeAssets);
    const children = parseInt(childrenCount) || 0;
    const wifeAgeNum = parseInt(wifeAge) || 30;

    // 기본 위자료 계산
    let baseAlimony = 0;

    // 혼인 기간에 따른 기본 위자료
    if (marriageYears < 3) {
      baseAlimony = 500000; // 3년 미만: 50만원
    } else if (marriageYears < 5) {
      baseAlimony = 800000; // 3-5년: 80만원
    } else if (marriageYears < 10) {
      baseAlimony = 1200000; // 5-10년: 120만원
    } else if (marriageYears < 15) {
      baseAlimony = 1500000; // 10-15년: 150만원
    } else {
      baseAlimony = 2000000; // 15년 이상: 200만원
    }

    // 소득 차이에 따른 조정
    const incomeDifference = husbandMonthlyIncome - wifeMonthlyIncome;
    if (incomeDifference > 0) {
      baseAlimony += incomeDifference * 0.1; // 소득 차이의 10%
    }

    // 재산 차이에 따른 조정
    const assetDifference = husbandTotalAssets - wifeTotalAssets;
    if (assetDifference > 0) {
      baseAlimony += assetDifference * 0.01; // 재산 차이의 1%
    }

    // 귀책사유에 따른 조정
    const faultFactor = faultFactors.find(f => f.type === faultType);
    const faultMultiplier = faultFactor?.multiplier || 1.0;
    baseAlimony *= faultMultiplier;

    // 아내의 나이에 따른 조정
    if (wifeAgeNum < 30) {
      baseAlimony *= 0.8; // 30세 미만: 20% 감소
    } else if (wifeAgeNum > 50) {
      baseAlimony *= 1.2; // 50세 이상: 20% 증가
    }

    // 아내의 학력에 따른 조정
    if (wifeEducation === '대학교') {
      baseAlimony *= 0.9; // 대학교 졸업: 10% 감소
    } else if (wifeEducation === '고등학교') {
      baseAlimony *= 1.0; // 고등학교 졸업: 기본
    } else {
      baseAlimony *= 1.1; // 중학교 이하: 10% 증가
    }

    // 아내의 경력에 따른 조정
    if (wifeCareer === 'career') {
      baseAlimony *= 0.7; // 경력 있음: 30% 감소
    } else if (wifeCareer === 'parttime') {
      baseAlimony *= 0.9; // 파트타임: 10% 감소
    } else {
      baseAlimony *= 1.0; // 경력 없음: 기본
    }

    // 자녀 수에 따른 조정
    if (children > 0) {
      baseAlimony *= (1 + children * 0.1); // 자녀 1명당 10% 증가
    }

    // 아내의 건강 상태에 따른 조정
    if (wifeHealth === 'disabled') {
      baseAlimony *= 1.3; // 장애: 30% 증가
    } else if (wifeHealth === 'chronic') {
      baseAlimony *= 1.1; // 만성질환: 10% 증가
    } else {
      baseAlimony *= 1.0; // 건강: 기본
    }

    // 최저/최고 한도 적용
    const minAlimony = 300000; // 월 30만원 최저
    const maxAlimony = husbandMonthlyIncome * 0.5; // 남편 소득의 50% 최고
    baseAlimony = Math.max(minAlimony, Math.min(maxAlimony, baseAlimony));

    // 위자료 지급 기간 계산
    let paymentPeriod = 0;
    if (marriageYears < 5) {
      paymentPeriod = 1; // 5년 미만: 1년
    } else if (marriageYears < 10) {
      paymentPeriod = 2; // 5-10년: 2년
    } else if (marriageYears < 15) {
      paymentPeriod = 3; // 10-15년: 3년
    } else {
      paymentPeriod = 5; // 15년 이상: 5년
    }

    // 귀책사유에 따른 기간 조정
    if (faultType === '배우자 일방 귀책') {
      paymentPeriod += 1;
    } else if (faultType === '중대한 귀책') {
      paymentPeriod += 2;
    } else if (faultType === '폭력/학대' || faultType === '부정행위') {
      paymentPeriod += 3;
    }

    const totalAlimonyAmount = baseAlimony * 12 * paymentPeriod;

    setMonthlyAlimony(baseAlimony);
    setTotalAlimony(totalAlimonyAmount);
    setAlimonyPeriod(paymentPeriod);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaHeart className="mr-3 text-slate-600" />
            위자료 계산기
          </h1>
          <p className="text-gray-600 text-lg">
            혼인 기간, 귀책 사유 기반 위자료 계산
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-slate-600" />
                남편 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 소득 (원)
                  </label>
                  <input
                    type="text"
                    value={husbandIncome}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setHusbandIncome(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 4,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    총 재산 (원)
                  </label>
                  <input
                    type="text"
                    value={husbandAssets}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setHusbandAssets(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 100,000,000"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-slate-600" />
                아내 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    월 소득 (원)
                  </label>
                  <input
                    type="text"
                    value={wifeIncome}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setWifeIncome(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 2,000,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    총 재산 (원)
                  </label>
                  <input
                    type="text"
                    value={wifeAssets}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setWifeAssets(formatNumber(value));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="예: 50,000,000"
                  />
                </div>
              </div>
            </div>
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
                아내 나이
              </label>
              <input
                type="number"
                value={wifeAge}
                onChange={(e) => setWifeAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="예: 35"
                min="18"
                max="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자녀 수
              </label>
              <input
                type="number"
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="예: 2"
                min="0"
                max="10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                귀책사유
              </label>
              <select
                value={faultType}
                onChange={(e) => setFaultType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {faultFactors.map((fault) => (
                  <option key={fault.type} value={fault.type}>
                    {fault.type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아내 학력
              </label>
              <select
                value={wifeEducation}
                onChange={(e) => setWifeEducation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="대학교">대학교</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아내 경력
              </label>
              <select
                value={wifeCareer}
                onChange={(e) => setWifeCareer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="none">경력 없음</option>
                <option value="parttime">파트타임</option>
                <option value="career">정규직 경력</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아내 건강 상태
            </label>
            <select
              value={wifeHealth}
              onChange={(e) => setWifeHealth(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="healthy">건강</option>
              <option value="chronic">만성질환</option>
              <option value="disabled">장애</option>
            </select>
          </div>

          <button
            onClick={calculateAlimony}
            className="w-full bg-slate-600 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors mt-6"
          >
            위자료 계산하기
          </button>

          {monthlyAlimony > 0 && (
            <div className="bg-slate-50 rounded-lg p-6 mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">위자료 계산 결과</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">월 위자료</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {monthlyAlimony.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">총 위자료</p>
                  <p className="text-xl font-bold text-gray-800">
                    {totalAlimony.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">지급 기간</p>
                  <p className="text-lg font-bold text-gray-800">
                    {alimonyPeriod}년
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">상세 내역</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>혼인 기간:</span>
                    <span>{marriageDuration || 0}년</span>
                  </div>
                  <div className="flex justify-between">
                    <span>남편 월 소득:</span>
                    <span>{parseNumber(husbandIncome).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>아내 월 소득:</span>
                    <span>{parseNumber(wifeIncome).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>소득 차이:</span>
                    <span>{(parseNumber(husbandIncome) - parseNumber(wifeIncome)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>재산 차이:</span>
                    <span>{(parseNumber(husbandAssets) - parseNumber(wifeAssets)).toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>귀책사유:</span>
                    <span>{faultType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>아내 나이:</span>
                    <span>{wifeAge || 0}세</span>
                  </div>
                  <div className="flex justify-between">
                    <span>아내 학력:</span>
                    <span>{wifeEducation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>아내 경력:</span>
                    <span>
                      {wifeCareer === 'none' ? '경력 없음' :
                       wifeCareer === 'parttime' ? '파트타임' : '정규직 경력'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>자녀 수:</span>
                    <span>{childrenCount}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>건강 상태:</span>
                    <span>
                      {wifeHealth === 'healthy' ? '건강' :
                       wifeHealth === 'chronic' ? '만성질환' : '장애'}
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
            위자료 계산 정보
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">위자료 계산 요소</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 혼인 기간</li>
                <li>• 부부의 소득 및 재산</li>
                <li>• 귀책사유</li>
                <li>• 아내의 나이 및 학력</li>
                <li>• 아내의 경력 및 건강</li>
                <li>• 자녀 수</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">주의사항</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 최저 위자료: 월 30만원</li>
                <li>• 최고 위자료: 남편 소득의 50%</li>
                <li>• 실제 위자료는 법원이 결정</li>
                <li>• 상황에 따라 조정 가능</li>
                <li>• 일시금 또는 분할 지급 가능</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">위자료란?</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 위자료는 이혼 시 정신적 고통을 받은 배우자에게 지급하는 금전적 보상입니다.</p>
              <p>• 위자료는 혼인 기간, 귀책사유, 경제적 상황 등을 종합적으로 고려하여 결정됩니다.</p>
              <p>• 위자료는 일시금으로 지급하거나 분할 지급할 수 있습니다.</p>
              <p>• 위자료는 법원의 판단에 따라 결정되며, 상황에 따라 조정될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 