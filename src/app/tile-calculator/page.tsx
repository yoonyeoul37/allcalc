"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaCalculator, 
  FaRuler, 
  FaDollarSign, 
  FaHome,
  FaInfoCircle,
  FaTools,
  FaIndustry,
  FaPaintBrush,
  FaHammer,
  FaExchangeAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface TileType {
  name: string;
  size: string;
  pricePerSqm: number;
  description: string;
}

interface RoomType {
  name: string;
  wasteFactor: number;
  description: string;
}

const tileTypes: TileType[] = [
  {
    name: "세라믹 타일",
    size: "30x30cm",
    pricePerSqm: 25000,
    description: "일반적인 세라믹 타일"
  },
  {
    name: "도자기 타일",
    size: "60x60cm",
    pricePerSqm: 45000,
    description: "고급 도자기 타일"
  },
  {
    name: "대리석 타일",
    size: "60x60cm",
    pricePerSqm: 80000,
    description: "고급 대리석 타일"
  },
  {
    name: "모자이크 타일",
    size: "5x5cm",
    pricePerSqm: 35000,
    description: "장식용 모자이크 타일"
  }
];

const roomTypes: RoomType[] = [
  {
    name: "거실",
    wasteFactor: 0.05,
    description: "5% 여유분 필요"
  },
  {
    name: "주방",
    wasteFactor: 0.08,
    description: "8% 여유분 필요"
  },
  {
    name: "욕실",
    wasteFactor: 0.10,
    description: "10% 여유분 필요"
  },
  {
    name: "발코니",
    wasteFactor: 0.03,
    description: "3% 여유분 필요"
  }
];

export default function TileCalculator() {
  const [selectedTile, setSelectedTile] = useState<TileType>(tileTypes[0]);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(roomTypes[0]);
  
  // 방 크기
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  
  // 제외 면적
  const [doorArea, setDoorArea] = useState("");
  const [windowArea, setWindowArea] = useState("");
  
  // 시공비
  const [laborCostPerSqm, setLaborCostPerSqm] = useState("35000");
  
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

  // 면적 계산
  const area = (() => {
    const width = parseFloat(roomWidth) || 0;
    const length = parseFloat(roomLength) || 0;
    const door = parseFloat(doorArea) || 0;
    const window = parseFloat(windowArea) || 0;

    const totalArea = width * length;
    const netArea = totalArea - door - window;
    const wasteArea = netArea * selectedRoom.wasteFactor;
    const requiredArea = netArea + wasteArea;
    
    return {
      totalArea,
      netArea,
      wasteArea,
      requiredArea
    };
  })();

  // 타일 개수 계산
  const tileCount = (() => {
    const tileSize = parseFloat(selectedTile.size.split('x')[0]) / 100; // cm를 m로 변환
    const tilesPerSqm = 1 / (tileSize * tileSize);
    const totalTiles = Math.ceil(area.requiredArea * tilesPerSqm);
    
    return {
      tilesPerSqm,
      totalTiles,
      boxes: Math.ceil(totalTiles / 12) // 박스당 12개 가정
    };
  })();

  // 비용 계산
  const cost = (() => {
    const tileCost = area.requiredArea * selectedTile.pricePerSqm;
    const laborCost = area.requiredArea * parseFloat(laborCostPerSqm);
    const groutCost = area.requiredArea * 5000; // 그라우트 1㎡당 5,000원
    const adhesiveCost = area.requiredArea * 8000; // 접착제 1㎡당 8,000원
    
    return {
      tileCost,
      laborCost,
      groutCost,
      adhesiveCost,
      totalCost: tileCost + laborCost + groutCost + adhesiveCost
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaIndustry className="text-4xl text-black mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">타일 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">타일 개수 및 시공비 계산</p>
          </div>

          {/* 입력 섹션 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">방 정보 입력</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaHome className="inline mr-2 text-black" />
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
                  제외 면적 (㎡)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={doorArea}
                    onChange={(e) => handleInputChange(e.target.value, setDoorArea)}
                    placeholder="문 면적"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                  />
                  <input
                    type="text"
                    value={windowArea}
                    onChange={(e) => handleInputChange(e.target.value, setWindowArea)}
                    placeholder="창문 면적"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                    style={{ color: '#000000 !important' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 타일 종류 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">타일 종류 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tileTypes.map((tile) => (
                <button
                  key={tile.name}
                  onClick={() => setSelectedTile(tile)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTile.name === tile.name
                      ? "border-[#003366] bg-[#003366] text-white"
                      : "border-gray-200 hover:border-[#003366]"
                  }`}
                >
                  <div className="font-semibold mb-1">{tile.name}</div>
                  <div className="text-sm">{tile.size}</div>
                  <div className="text-sm">{tile.pricePerSqm.toLocaleString()}원/㎡</div>
                </button>
              ))}
            </div>
          </div>

          {/* 공간 종류 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">공간 종류 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {roomTypes.map((room) => (
                <button
                  key={room.name}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRoom.name === room.name
                      ? "border-[#003366] bg-[#003366] text-white"
                      : "border-gray-200 hover:border-[#003366]"
                  }`}
                >
                  <div className="font-semibold mb-1">{room.name}</div>
                  <div className="text-sm">{room.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 시공비 설정 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">시공비 설정</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">1㎡당 시공비 (원)</label>
              <input
                type="text"
                value={laborCostPerSqm}
                onChange={(e) => handleInputChange(e.target.value, setLaborCostPerSqm)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                placeholder="35000"
                style={{ color: '#000000 !important' }}
              />
            </div>
          </div>

          {/* 결과 표시 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">계산 결과</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">면적 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>총 면적:</span>
                    <span className="font-semibold">{area.totalArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>순 면적:</span>
                    <span className="font-semibold">{area.netArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>여유분:</span>
                    <span className="font-semibold">{area.wasteArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>필요 면적:</span>
                    <span className="font-semibold">{area.requiredArea.toFixed(2)}㎡</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">타일 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>타일 크기:</span>
                    <span className="font-semibold">{selectedTile.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1㎡당 타일 수:</span>
                    <span className="font-semibold">{tileCount.tilesPerSqm.toFixed(1)}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>필요 타일 수:</span>
                    <span className="font-semibold">{tileCount.totalTiles}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>필요 박스 수:</span>
                    <span className="font-semibold">{tileCount.boxes}박스</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-black mb-3">비용 분석</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>타일 비용:</span>
                    <span className="font-semibold">{cost.tileCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>시공비:</span>
                    <span className="font-semibold">{cost.laborCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>그라우트:</span>
                    <span className="font-semibold">{cost.groutCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>접착제:</span>
                    <span className="font-semibold">{cost.adhesiveCost.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>총 비용:</span>
                      <span>{cost.totalCost.toLocaleString()}원</span>
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
              <p>• <strong>방 크기:</strong> 타일을 시공할 공간의 가로×세로 크기를 입력합니다.</p>
              <p>• <strong>제외 면적:</strong> 문이나 창문 등 타일을 시공하지 않을 면적을 입력합니다.</p>
              <p>• <strong>타일 종류:</strong> 시공할 타일의 종류와 크기를 선택합니다.</p>
              <p>• <strong>공간 종류:</strong> 거실, 주방, 욕실 등에 따라 여유분이 자동 계산됩니다.</p>
              <p>• <strong>시공비:</strong> 지역과 시공업체에 따라 1㎡당 25,000~50,000원 정도입니다.</p>
              <p>• <strong>여유분:</strong> 절단 손실을 고려한 추가 타일 개수입니다.</p>
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
              
              <Link href="/interior-estimate-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaHammer className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">인테리어 견적</h4>
                <p className="text-xs text-gray-600">견적 계산</p>
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
