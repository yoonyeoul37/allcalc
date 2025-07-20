"use client";

import { useState } from 'react';
import { FaCalculator, FaHeart, FaUser, FaMoneyBillWave, FaChild, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
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
    if (!marriageDuration || !husbandIncome) {
      alert('혼인 기간과 남편 소득을 입력해주세요.');
      return;
    }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaHeart className="mr-3 text-[#003366]" />
              위자료 계산기
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#003366]" />
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 100,000,000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#003366]" />
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                      placeholder="예: 50,000,000"
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
                  value={faultType}
                  onChange={(e) => setFaultType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  {faultFactors.map((factor) => (
                    <option key={factor.type} value={factor.type}>
                      {factor.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아내 나이
                </label>
                <input
                  type="number"
                  value={wifeAge}
                  onChange={(e) => setWifeAge(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 35"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아내 학력
                </label>
                <select
                  value={wifeEducation}
                  onChange={(e) => setWifeEducation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="none">경력 없음</option>
                  <option value="parttime">파트타임</option>
                  <option value="career">정규직 경력</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  자녀 수
                </label>
                <input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="예: 2"
                />
              </div>
            </div>

            <button
              onClick={calculateAlimony}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold mb-6"
            >
              계산하기
            </button>

            {monthlyAlimony > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">월 위자료</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {monthlyAlimony.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">총 위자료</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {totalAlimony.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">지급 기간</p>
                    <p className="text-xl font-bold text-[#003366]">
                      {alimonyPeriod}년
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
              <a href="/child-support-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaChild className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">양육비 계산기</h4>
                <p className="text-xs text-gray-600">양육비 계산</p>
              </a>
              
              <a href="/personal-rehabilitation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">개인회생 변제금</h4>
                <p className="text-xs text-gray-600">변제금 계산</p>
              </a>
              
              <a href="/mortgage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaMoneyBillWave className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">주택담보대출</h4>
                <p className="text-xs text-gray-600">대출 계산</p>
              </a>
              
              <a href="/income-tax-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaInfoCircle className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">소득세 계산기</h4>
                <p className="text-xs text-gray-600">세금 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 