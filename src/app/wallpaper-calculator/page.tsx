"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaPaintBrush, 
  FaCalculator, 
  FaRuler,
  FaUserTie,
  FaUser,
  FaUserGraduate,
  FaInfoCircle,
  FaHome,
  FaIndustry,
  FaHammer,
  FaExchangeAlt
} from "react-icons/fa";
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

interface WallpaperType {
  name: string;
  pricePerRoll: number; // 롤당 가격
  coveragePerRoll: number; // 롤당 커버 면적 (평)
  allowedWorkers: string[]; // 가능한 기술자 등급
  description: string;
}

interface WorkerType {
  name: string;
  pricePerSqm: number; // ㎡당 인건비
  description: string;
}

const wallpaperTypes: WallpaperType[] = [
  {
    name: "합지 (일반)",
    pricePerRoll: 15000,
    coveragePerRoll: 2.0, // 한 롤당 2평 도배 가능
    allowedWorkers: ["보조", "준기공", "기술자"],
    description: "기본 합지, 모든 기술자 가능"
  },
  {
    name: "소폭 합지",
    pricePerRoll: 18000,
    coveragePerRoll: 2.0, // 한 롤당 2평 도배 가능
    allowedWorkers: ["보조", "준기공", "기술자"],
    description: "소폭 합지, 모든 기술자 가능"
  },
  {
    name: "장폭 합지",
    pricePerRoll: 22000,
    coveragePerRoll: 5.0, // 한 롤당 5평 도배 가능
    allowedWorkers: ["보조", "준기공", "기술자"],
    description: "장폭 합지, 모든 기술자 가능"
  },
  {
    name: "실크",
    pricePerRoll: 35000,
    coveragePerRoll: 2.0,
    allowedWorkers: ["기술자"],
    description: "고급 실크, 기술자만 가능"
  },
  {
    name: "장폭 실크",
    pricePerRoll: 45000,
    coveragePerRoll: 5.0,
    allowedWorkers: ["기술자"],
    description: "고급 장폭 실크, 기술자만 가능"
  }
];

const workerTypes: WorkerType[] = [
  {
    name: "보조",
    pricePerSqm: 10000,
    description: "기본 시공, 합지만 가능"
  },
  {
    name: "준기공",
    pricePerSqm: 170000,
    description: "중급 시공, 합지만 가능"
  },
  {
    name: "기술자",
    pricePerSqm: 250000,
    description: "고급 시공, 모든 종류 가능"
  }
];

export default function WallpaperCalculator() {
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperType>(wallpaperTypes[0]);
  const [selectedWorker, setSelectedWorker] = useState<WorkerType>(workerTypes[0]);
  
  // 방 크기
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  
  // 제외 면적
  const [doorArea, setDoorArea] = useState("");
  const [windowArea, setWindowArea] = useState("");
  


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



  // 도배지 변경 시 기술자 자동 조정
  const handleWallpaperChange = (wallpaper: WallpaperType) => {
    setSelectedWallpaper(wallpaper);
    
    // 선택된 도배지에 해당 기술자가 없으면 첫 번째 가능한 기술자로 변경
    if (!wallpaper.allowedWorkers.includes(selectedWorker.name)) {
      const firstAllowedWorker = workerTypes.find(worker => 
        wallpaper.allowedWorkers.includes(worker.name)
      );
      if (firstAllowedWorker) {
        setSelectedWorker(firstAllowedWorker);
      }
    }
  };

  // 면적 계산 (평수 기준)
  const area = (() => {
    const width = parseFloat(roomWidth) || 0;
    const length = parseFloat(roomLength) || 0;
    const height = parseFloat(roomHeight) || 0;
    const door = parseFloat(doorArea) || 0;
    const window = parseFloat(windowArea) || 0;

    // 바닥 면적 (평)
    const floorArea = (width * length) / 3.305; // ㎡를 평으로 변환
    
    // 벽면적 = (가로 + 세로) × 2 × 높이 - 문/창문 면적
    const wallArea = (width + length) * 2 * height - door - window;
    
    // 총 평수 (바닥 + 벽면적의 평수)
    const totalPyeong = floorArea + (wallArea / 3.305);
    
    // 도배 면적 = 총 평수 × 2.5 (실제 도배 현장 계산법)
    const wallpaperArea = totalPyeong * 2.5;
    
    return {
      floorArea: floorArea,
      wallArea: wallArea,
      totalPyeong: totalPyeong,
      wallpaperArea: wallpaperArea
    };
  })();

  // 견적 계산
  const estimate = (() => {
    const rolls = Math.ceil(area.wallpaperArea / selectedWallpaper.coveragePerRoll);
    const glue = area.wallpaperArea * 0.3;

    const wallpaperCost = rolls * selectedWallpaper.pricePerRoll;
    const glueCost = glue * 8000; // 풀 1kg당 8,000원
    const laborCost = area.wallpaperArea * selectedWorker.pricePerSqm;

    return {
      rolls,
      wallpaperCost,
      glueCost,
      laborCost,
      totalCost: wallpaperCost + glueCost + laborCost
    };
  })();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaPaintBrush className="text-3xl text-black mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">도배 계산기</h1>
              <p className="text-gray-600">도배지 종류별 견적 및 인건비 계산</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 입력 섹션 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaHome className="inline mr-2 text-black" />
                  방 크기 (m)
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                  <input
                    type="text"
                    value={roomHeight}
                    onChange={(e) => handleInputChange(e.target.value, setRoomHeight)}
                    placeholder="높이"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPaintBrush className="inline mr-2 text-black" />
                  도배지 종류
                </label>
                <select
                  value={selectedWallpaper.name}
                  onChange={(e) => {
                    const wallpaper = wallpaperTypes.find(w => w.name === e.target.value);
                    if (wallpaper) handleWallpaperChange(wallpaper);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  {wallpaperTypes.map(wallpaper => (
                    <option key={wallpaper.name} value={wallpaper.name}>
                      {wallpaper.name} - {wallpaper.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserTie className="inline mr-2 text-black" />
                  시공 기술자
                </label>
                <select
                  value={selectedWorker.name}
                  onChange={(e) => {
                    const worker = workerTypes.find(w => w.name === e.target.value);
                    if (worker) setSelectedWorker(worker);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                >
                  {workerTypes
                    .filter(worker => selectedWallpaper.allowedWorkers.includes(worker.name))
                    .map(worker => (
                      <option key={worker.name} value={worker.name}>
                        {worker.name} - {worker.description}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* 결과 섹션 */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">면적 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>바닥 면적:</span>
                    <span className="font-semibold">{area.floorArea.toFixed(2)}평</span>
                  </div>
                  <div className="flex justify-between">
                    <span>벽면 면적:</span>
                    <span className="font-semibold">{area.wallArea.toFixed(2)}㎡</span>
                  </div>
                  <div className="flex justify-between">
                    <span>총 평수:</span>
                    <span className="font-semibold">{area.totalPyeong.toFixed(2)}평</span>
                  </div>
                  <div className="flex justify-between">
                    <span>도배 면적:</span>
                    <span className="font-semibold">{area.wallpaperArea.toFixed(2)}평</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">견적 계산</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>필요 롤 수:</span>
                    <span className="font-semibold">{estimate.rolls}롤</span>
                  </div>
                  <div className="flex justify-between">
                    <span>도배지 비용:</span>
                    <span className="font-semibold">{estimate.wallpaperCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>풀 비용:</span>
                    <span className="font-semibold">{estimate.glueCost.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>인건비:</span>
                    <span className="font-semibold">{estimate.laborCost.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>총 견적:</span>
                      <span>{estimate.totalCost.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            
            <Link href="/tile-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaHome className="text-xl text-black" />
              </div>
              <h4 className="font-semibold text-gray-800 text-sm">타일 계산기</h4>
              <p className="text-xs text-gray-600">타일 계산</p>
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
      <Footer />
    </div>
  );
} 
