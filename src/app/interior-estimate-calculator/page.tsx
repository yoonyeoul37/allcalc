"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaCalculator, 
  FaHome, 
  FaDollarSign, 
  FaRuler,
  FaInfoCircle,
  FaTools,
  FaIndustry,
  FaPaintBrush,
  FaExchangeAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface InteriorWork {
  name: string;
  pricePerSqm: number;
  description: string;
  category: string;
}

interface RoomType {
  name: string;
  complexity: number;
  description: string;
}

const interiorWorks: InteriorWork[] = [
  {
    name: "벽지 도배",
    pricePerSqm: 25000,
    description: "합지, 실크 등 벽지 도배",
    category: "마감"
  },
  {
    name: "타일 시공",
    pricePerSqm: 35000,
    description: "바닥, 벽면 타일 시공",
    category: "마감"
  },
  {
    name: "마루 시공",
    pricePerSqm: 45000,
    description: "원목, 합판 마루 시공",
    category: "마감"
  },
  {
    name: "천장 시공",
    pricePerSqm: 30000,
    description: "합판, 석고보드 천장",
    category: "마감"
  },
  {
    name: "조명 설치",
    pricePerSqm: 15000,
    description: "LED 조명, 간접조명 설치",
    category: "전기"
  },
  {
    name: "콘센트 설치",
    pricePerSqm: 8000,
    description: "콘센트, 스위치 설치",
    category: "전기"
  },
  {
    name: "도어 설치",
    pricePerSqm: 120000,
    description: "실내문, 현관문 설치",
    category: "목공"
  },
  {
    name: "수전 설치",
    pricePerSqm: 50000,
    description: "싱크대, 욕실 수전 설치",
    category: "배관"
  }
];

const roomTypes: RoomType[] = [
  {
    name: "거실",
    complexity: 1.0,
    description: "기본 복잡도"
  },
  {
    name: "주방",
    complexity: 1.2,
    description: "20% 추가 복잡도"
  },
  {
    name: "욕실",
    complexity: 1.3,
    description: "30% 추가 복잡도"
  },
  {
    name: "침실",
    complexity: 1.1,
    description: "10% 추가 복잡도"
  }
];

export default function InteriorEstimateCalculator() {
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(roomTypes[0]);
  
  // 공간 크기
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  
  // 추가 옵션
  const [designFee, setDesignFee] = useState("0");
  const [managementFee, setManagementFee] = useState("10");
  
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
    setter(numericValue);
  };

  // 작업 선택/해제
  const toggleWork = (workName: string) => {
    if (selectedWorks.includes(workName)) {
      setSelectedWorks(selectedWorks.filter(w => w !== workName));
    } else {
      setSelectedWorks([...selectedWorks, workName]);
    }
  };

  // 면적 계산
  const area = (() => {
    const width = parseFloat(roomWidth) || 0;
    const length = parseFloat(roomLength) || 0;
    const height = parseFloat(roomHeight) || 0;

    const floorArea = width * length;
    const wallArea = (width + length) * 2 * height;
    const ceilingArea = floorArea;
    
    return {
      floorArea,
      wallArea,
      ceilingArea,
      totalArea: floorArea + wallArea + ceilingArea
    };
  })();

  // 견적 계산
  const estimate = (() => {
    const selectedWorkDetails = interiorWorks.filter(work => 
      selectedWorks.includes(work.name)
    );

    let totalCost = 0;
    const workCosts = selectedWorkDetails.map(work => {
      let workArea = 0;
      
      // 작업별 면적 계산
      if (work.name.includes("벽지") || work.name.includes("타일")) {
        workArea = area.wallArea;
      } else if (work.name.includes("마루") || work.name.includes("천장")) {
        workArea = area.floorArea;
      } else {
        workArea = area.totalArea * 0.3; // 기타 작업은 전체 면적의 30%
      }

      const baseCost = workArea * work.pricePerSqm;
      const complexityCost = baseCost * selectedRoom.complexity;
      
      totalCost += complexityCost;
      
      return {
        name: work.name,
        area: workArea,
        baseCost,
        complexityCost,
        category: work.category
      };
    });

    const designFeeAmount = parseFloat(designFee) || 0;
    const managementFeeAmount = totalCost * (parseFloat(managementFee) / 100);
    const totalWithFees = totalCost + designFeeAmount + managementFeeAmount;

    return {
      workCosts,
      totalCost,
      designFeeAmount,
      managementFeeAmount,
      totalWithFees
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaHome className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">인테리어 견적 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">인테리어 공사 견적 및 비용 계산</p>
          </div>

          {/* 공간 정보 입력 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">공간 정보 입력</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaRuler className="inline mr-2 text-black" />
                  방 크기 (m)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={roomWidth}
                    onChange={(e) => handleInputChange(e.target.value, setRoomWidth)}
                    placeholder="가로"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <input
                    type="text"
                    value={roomLength}
                    onChange={(e) => handleInputChange(e.target.value, setRoomLength)}
                    placeholder="세로"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaRuler className="inline mr-2 text-black" />
                  방 높이 (m)
                </label>
                <input
                  type="text"
                  value={roomHeight}
                  onChange={(e) => handleInputChange(e.target.value, setRoomHeight)}
                  placeholder="높이"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaHome className="inline mr-2 text-black" />
                  공간 종류
                </label>
                <select
                  value={selectedRoom.name}
                  onChange={(e) => {
                    const room = roomTypes.find(r => r.name === e.target.value);
                    if (room) setSelectedRoom(room);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  {roomTypes.map(room => (
                    <option key={room.name} value={room.name}>
                      {room.name} - {room.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 작업 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">작업 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interiorWorks.map((work) => (
                <button
                  key={work.name}
                  onClick={() => toggleWork(work.name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedWorks.includes(work.name)
                      ? "border-[#003366] bg-[#003366] text-white"
                      : "border-gray-200 hover:border-[#003366]"
                  }`}
                >
                  <div className="font-semibold mb-1">{work.name}</div>
                  <div className="text-sm">{work.description}</div>
                  <div className="text-sm">{work.pricePerSqm.toLocaleString()}원/㎡</div>
                </button>
              ))}
            </div>
          </div>

          {/* 추가 비용 설정 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">추가 비용 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="inline mr-2 text-black" />
                  디자인 비용 (원)
                </label>
                <input
                  type="text"
                  value={designFee}
                  onChange={(e) => handleInputChange(e.target.value, setDesignFee)}
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaDollarSign className="inline mr-2 text-black" />
                  관리비용 (%)
                </label>
                <input
                  type="text"
                  value={managementFee}
                  onChange={(e) => handleInputChange(e.target.value, setManagementFee)}
                  placeholder="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>
          </div>

          {/* 결과 표시 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">견적 결과</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">면적 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>바닥 면적:</span>
                    <span className="font-semibold">{area.floorArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>벽면 면적:</span>
                    <span className="font-semibold">{area.wallArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>천장 면적:</span>
                    <span className="font-semibold">{area.ceilingArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 면적:</span>
                    <span className="font-semibold">{area.totalArea.toFixed(2)}㎡</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">작업 비용</h4>
                <div className="space-y-2 text-sm">
                  {estimate.workCosts.map((work, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{work.name}:</span>
                      <span className="font-semibold">{work.complexityCost.toLocaleString()}원</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>작업 총액:</span>
                      <span>{estimate.totalCost.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">추가 비용</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>디자인 비용:</span>
                    <span className="font-semibold">{estimate.designFeeAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>관리 비용:</span>
                    <span className="font-semibold">{estimate.managementFeeAmount.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>총 견적:</span>
                      <span>{estimate.totalWithFees.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법 안내</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>공간 크기:</strong> 시공할 공간의 가로×세로×높이를 입력합니다.</p>
              <p>• <strong>공간 종류:</strong> 거실, 주방, 욕실 등에 따라 복잡도가 자동 적용됩니다.</p>
              <p>• <strong>시공 작업:</strong> 필요한 작업들을 선택하면 해당 비용이 계산됩니다.</p>
              <p>• <strong>설계비:</strong> 별도 설계가 필요한 경우 추가 비용입니다.</p>
              <p>• <strong>감리비:</strong> 공사 감리를 위한 비용으로 일반적으로 5~15%입니다.</p>
              <p>• <strong>복잡도:</strong> 주방(1.2x), 욕실(1.3x) 등 복잡한 공간은 추가 비용이 발생합니다.</p>
            </div>
          </div>

          {/* 관련 계산기 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalculator className="mr-2 text-black" />
              관련 계산기
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/concrete-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaIndustry className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">콘크리트 계산기</h4>
                <p className="text-xs text-gray-600">콘크리트 계산</p>
              </Link>
              
              <Link href="/wallpaper-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaPaintBrush className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">도배 계산기</h4>
                <p className="text-xs text-gray-600">도배 계산</p>
              </Link>
              
              <Link href="/tile-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHome className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">타일 계산기</h4>
                <p className="text-xs text-gray-600">타일 계산</p>
              </Link>
              
              <Link href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">단위 변환</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
