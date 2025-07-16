"use client";

import { useState } from "react";

interface Asset {
  id: string;
  name: string;
  value: string;
  owner: 'husband' | 'wife' | 'joint';
  type: 'real_estate' | 'deposit' | 'stock' | 'business' | 'other';
  acquired: 'before' | 'during' | 'inherited'; // 혼인 전, 혼인 중, 상속/증여
}

interface Debt {
  id: string;
  name: string;
  amount: string;
  responsible: 'husband' | 'wife' | 'joint';
}

export default function DivorcePropertyCalculator() {
  const [marriageInfo, setMarriageInfo] = useState({
    duration: "",
    husbandContribution: "50",
    wifeContribution: "50"
  });

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      name: "아파트",
      value: "500,000,000",
      owner: 'joint',
      type: 'real_estate',
      acquired: 'during'
    }
  ]);

  const [debts, setDebts] = useState<Debt[]>([
    {
      id: "1",
      name: "주택담보대출",
      amount: "200,000,000",
      responsible: 'joint'
    }
  ]);

  const [result, setResult] = useState<any>(null);

  // 숫자 포맷팅 함수
  const formatNumber = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 자산 추가
  const addAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: "",
      value: "",
      owner: 'joint',
      type: 'other',
      acquired: 'during'
    };
    setAssets([...assets, newAsset]);
  };

  // 자산 제거
  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  // 자산 업데이트
  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  // 부채 추가
  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: "",
      amount: "",
      responsible: 'joint'
    };
    setDebts([...debts, newDebt]);
  };

  // 부채 제거
  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  // 부채 업데이트
  const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  // 재산분할 계산
  const calculateDivision = () => {
    if (!marriageInfo.duration || parseInt(marriageInfo.duration) <= 0) {
      alert('혼인 기간을 입력해주세요.');
      return;
    }

    // 개별 재산과 공동 재산 구분
    const individualAssets = {
      husband: 0,
      wife: 0
    };

    const jointAssets = {
      total: 0,
      realEstate: 0,
      financial: 0,
      business: 0,
      other: 0
    };

    assets.forEach(asset => {
      const value = parseInt(asset.value.replace(/,/g, '') || '0');
      
      if (asset.acquired === 'before' || asset.acquired === 'inherited') {
        // 개별 재산 (혼인 전 재산, 상속/증여 재산)
        if (asset.owner === 'husband') {
          individualAssets.husband += value;
        } else if (asset.owner === 'wife') {
          individualAssets.wife += value;
        }
      } else {
        // 공동 재산 (혼인 중 취득)
        jointAssets.total += value;
        
        switch (asset.type) {
          case 'real_estate':
            jointAssets.realEstate += value;
            break;
          case 'deposit':
          case 'stock':
            jointAssets.financial += value;
            break;
          case 'business':
            jointAssets.business += value;
            break;
          default:
            jointAssets.other += value;
            break;
        }
      }
    });

    // 부채 계산
    const totalDebts = {
      joint: 0,
      husband: 0,
      wife: 0
    };

    debts.forEach(debt => {
      const amount = parseInt(debt.amount.replace(/,/g, '') || '0');
      if (debt.responsible === 'joint') {
        totalDebts.joint += amount;
      } else if (debt.responsible === 'husband') {
        totalDebts.husband += amount;
      } else {
        totalDebts.wife += amount;
      }
    });

    // 순 공동재산 계산
    const netJointAssets = jointAssets.total - totalDebts.joint;

    // 기여도에 따른 분할
    const husbandRatio = parseInt(marriageInfo.husbandContribution) / 100;
    const wifeRatio = parseInt(marriageInfo.wifeContribution) / 100;

    const husbandShare = Math.round(netJointAssets * husbandRatio);
    const wifeShare = Math.round(netJointAssets * wifeRatio);

    // 각자 최종 재산
    const finalAssets = {
      husband: individualAssets.husband + husbandShare - totalDebts.husband,
      wife: individualAssets.wife + wifeShare - totalDebts.wife
    };

    // 혼인 기간에 따른 가산점
    const marriageDuration = parseInt(marriageInfo.duration);
    let durationBonus = 0;
    if (marriageDuration >= 20) {
      durationBonus = netJointAssets * 0.05; // 5% 가산
    } else if (marriageDuration >= 10) {
      durationBonus = netJointAssets * 0.03; // 3% 가산
    }

    setResult({
      individualAssets,
      jointAssets,
      totalDebts,
      netJointAssets,
      division: {
        husband: husbandShare,
        wife: wifeShare
      },
      finalAssets,
      durationBonus,
      marriageDuration
    });
  };

  const getAssetTypeLabel = (type: string) => {
    const labels = {
      real_estate: '부동산',
      deposit: '예금',
      stock: '주식/펀드',
      business: '사업재산',
      other: '기타'
    };
    return labels[type as keyof typeof labels] || '기타';
  };

  const getAcquiredLabel = (acquired: string) => {
    const labels = {
      before: '혼인 전',
      during: '혼인 중',
      inherited: '상속/증여'
    };
    return labels[acquired as keyof typeof labels] || '혼인 중';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">이혼 재산분할 계산기</h1>
        <p className="text-gray-600">혼인 중 형성된 재산의 분할을 계산합니다</p>
      </div>

      {/* 혼인 정보 */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">혼인 정보</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              혼인 기간 (년)
            </label>
            <input
              type="number"
              value={marriageInfo.duration}
              onChange={(e) => setMarriageInfo({...marriageInfo, duration: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 10"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              남편 기여도 (%)
            </label>
            <input
              type="number"
              value={marriageInfo.husbandContribution}
              onChange={(e) => {
                const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                setMarriageInfo({
                  ...marriageInfo, 
                  husbandContribution: value.toString(),
                  wifeContribution: (100 - value).toString()
                });
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아내 기여도 (%)
            </label>
            <input
              type="number"
              value={marriageInfo.wifeContribution}
              onChange={(e) => {
                const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                setMarriageInfo({
                  ...marriageInfo, 
                  wifeContribution: value.toString(),
                  husbandContribution: (100 - value).toString()
                });
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* 자산 정보 */}
      <div className="bg-green-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-800">재산 목록</h2>
          <button
            onClick={addAsset}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            재산 추가
          </button>
        </div>

        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div key={asset.id} className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">재산명</label>
                  <input
                    type="text"
                    value={asset.name}
                    onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="예: 아파트"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">가액 (원)</label>
                  <input
                    type="text"
                    value={asset.value}
                    onChange={(e) => updateAsset(asset.id, 'value', formatNumber(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="예: 500,000,000"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">종류</label>
                  <select
                    value={asset.type}
                    onChange={(e) => updateAsset(asset.id, 'type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="real_estate">부동산</option>
                    <option value="deposit">예금</option>
                    <option value="stock">주식/펀드</option>
                    <option value="business">사업재산</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">소유자</label>
                  <select
                    value={asset.owner}
                    onChange={(e) => updateAsset(asset.id, 'owner', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="husband">남편</option>
                    <option value="wife">아내</option>
                    <option value="joint">공동</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">취득시기</label>
                  <select
                    value={asset.acquired}
                    onChange={(e) => updateAsset(asset.id, 'acquired', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="before">혼인 전</option>
                    <option value="during">혼인 중</option>
                    <option value="inherited">상속/증여</option>
                  </select>
                </div>

                <div className="flex justify-center">
                  {assets.length > 1 && (
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 부채 정보 */}
      <div className="bg-red-50 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-800">부채 목록</h2>
          <button
            onClick={addDebt}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            부채 추가
          </button>
        </div>

        <div className="space-y-4">
          {debts.map((debt) => (
            <div key={debt.id} className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">부채명</label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="예: 주택담보대출"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">금액 (원)</label>
                  <input
                    type="text"
                    value={debt.amount}
                    onChange={(e) => updateDebt(debt.id, 'amount', formatNumber(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    placeholder="예: 200,000,000"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">책임자</label>
                  <select
                    value={debt.responsible}
                    onChange={(e) => updateDebt(debt.id, 'responsible', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="husband">남편</option>
                    <option value="wife">아내</option>
                    <option value="joint">공동</option>
                  </select>
                </div>

                <div className="flex justify-center">
                  {debts.length > 1 && (
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 계산 버튼 */}
      <div className="text-center mb-8">
        <button
          onClick={calculateDivision}
          className="px-8 py-3 bg-purple-600 text-white text-lg font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          재산분할 계산하기
        </button>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">재산분할 계산 결과</h2>

          {/* 재산 현황 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">개별 재산</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">남편 개별재산</span>
                  <span className="font-semibold">{result.individualAssets.husband.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">아내 개별재산</span>
                  <span className="font-semibold">{result.individualAssets.wife.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-green-600 mb-4">공동 재산</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">부동산</span>
                  <span className="font-semibold">{result.jointAssets.realEstate.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">금융자산</span>
                  <span className="font-semibold">{result.jointAssets.financial.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">사업재산</span>
                  <span className="font-semibold">{result.jointAssets.business.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">기타</span>
                  <span className="font-semibold">{result.jointAssets.other.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800">총 공동재산</span>
                    <span className="text-green-600">{result.jointAssets.total.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 부채 및 순자산 */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">부채 및 순자산 계산</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">부채</h4>
                <div className="flex justify-between text-sm">
                  <span>공동 부채</span>
                  <span>{result.totalDebts.joint.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>남편 개별부채</span>
                  <span>{result.totalDebts.husband.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>아내 개별부채</span>
                  <span>{result.totalDebts.wife.toLocaleString()}원</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-600">기여도</h4>
                <div className="flex justify-between text-sm">
                  <span>남편 기여도</span>
                  <span>{marriageInfo.husbandContribution}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>아내 기여도</span>
                  <span>{marriageInfo.wifeContribution}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>혼인기간</span>
                  <span>{result.marriageDuration}년</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">순 공동재산</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.netJointAssets.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-600">
                    공동재산 - 공동부채
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 분할 결과 */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">재산분할 결과</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">남편 분할분</h4>
                <div className="text-3xl font-bold mb-2">
                  {result.division.husband.toLocaleString()}원
                </div>
                <div className="text-sm opacity-90">
                  순 공동재산의 {marriageInfo.husbandContribution}%
                </div>
              </div>

              <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-2">아내 분할분</h4>
                <div className="text-3xl font-bold mb-2">
                  {result.division.wife.toLocaleString()}원
                </div>
                <div className="text-sm opacity-90">
                  순 공동재산의 {marriageInfo.wifeContribution}%
                </div>
              </div>
            </div>
          </div>

          {/* 최종 재산 */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">최종 보유 재산</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-lg font-semibold text-blue-600 mb-2">남편</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>개별재산</span>
                    <span>{result.individualAssets.husband.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>분할받을 재산</span>
                    <span className="text-blue-600">+{result.division.husband.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>개별부채</span>
                    <span className="text-red-600">-{result.totalDebts.husband.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>최종 재산</span>
                      <span className={`text-lg ${result.finalAssets.husband >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.finalAssets.husband.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-lg font-semibold text-pink-600 mb-2">아내</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>개별재산</span>
                    <span>{result.individualAssets.wife.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>분할받을 재산</span>
                    <span className="text-pink-600">+{result.division.wife.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>개별부채</span>
                    <span className="text-red-600">-{result.totalDebts.wife.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>최종 재산</span>
                      <span className={`text-lg ${result.finalAssets.wife >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.finalAssets.wife.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 분석 및 안내 */}
          <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">📋 재산분할 안내</h3>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• 이 계산은 일반적인 재산분할 기준을 적용한 예상 결과입니다.</p>
              <p>• 실제 재산분할은 법원의 판단에 따라 달라질 수 있습니다.</p>
              <p>• 기여도는 일반적으로 50:50이나, 특별한 사정이 있는 경우 조정됩니다.</p>
              <p>• 개별재산(혼인 전 재산, 상속/증여 재산)은 분할 대상에서 제외됩니다.</p>
              <p>• 혼인 기간이 길수록 분할 비율이 높아질 수 있습니다.</p>
              <p>• 재산분할은 현물분할, 대가분할, 가격보상 등의 방법으로 실행됩니다.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 