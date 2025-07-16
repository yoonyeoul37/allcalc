"use client";

import { useState } from "react";
import { 
  FaDatabase, 
  FaDownload, 
  FaUpload, 
  FaCalculator,
  FaExchangeAlt,
  FaInfoCircle,
  FaWifi,
  FaHdd
} from "react-icons/fa";
import Header from '../../components/ui/Header';

interface DataUnit {
  name: string;
  symbol: string;
  bytes: number;
  description: string;
}

const dataUnits: DataUnit[] = [
  { name: "바이트", symbol: "B", bytes: 1, description: "기본 단위" },
  { name: "킬로바이트", symbol: "KB", bytes: 1024, description: "1,024 바이트" },
  { name: "메가바이트", symbol: "MB", bytes: 1024 * 1024, description: "1,048,576 바이트" },
  { name: "기가바이트", symbol: "GB", bytes: 1024 * 1024 * 1024, description: "1,073,741,824 바이트" },
  { name: "테라바이트", symbol: "TB", bytes: 1024 * 1024 * 1024 * 1024, description: "1,099,511,627,776 바이트" },
  { name: "페타바이트", symbol: "PB", bytes: 1024 * 1024 * 1024 * 1024 * 1024, description: "1,125,899,906,842,624 바이트" }
];

const networkUnits = [
  { name: "bps", symbol: "bps", rate: 1, description: "비트/초" },
  { name: "Kbps", symbol: "Kbps", rate: 1000, description: "킬로비트/초" },
  { name: "Mbps", symbol: "Mbps", rate: 1000000, description: "메가비트/초" },
  { name: "Gbps", symbol: "Gbps", rate: 1000000000, description: "기가비트/초" },
  { name: "MB/s", symbol: "MB/s", rate: 8000000, description: "메가바이트/초" },
  { name: "GB/s", symbol: "GB/s", rate: 8000000000, description: "기가바이트/초" }
];

export default function DataConverter() {
  const [activeTab, setActiveTab] = useState<'data' | 'network'>('data');
  
  // 데이터 변환 상태
  const [fromUnit, setFromUnit] = useState<DataUnit>(dataUnits[2]); // MB
  const [toUnit, setToUnit] = useState<DataUnit>(dataUnits[1]); // KB
  const [dataValue, setDataValue] = useState("");
  const [dataValueDisplay, setDataValueDisplay] = useState("");
  
  // 네트워크 변환 상태
  const [fromNetworkUnit, setFromNetworkUnit] = useState(networkUnits[2]); // Mbps
  const [toNetworkUnit, setToNetworkUnit] = useState(networkUnits[4]); // MB/s
  const [networkValue, setNetworkValue] = useState("");
  const [networkValueDisplay, setNetworkValueDisplay] = useState("");

  // 콤마 포맷팅 함수
  const formatNumber = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 숫자만 추출 함수
  const extractNumber = (value: string) => {
    return value.replace(/[^\d.]/g, "");
  };

  // 데이터 값 입력 처리
  const handleDataValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = extractNumber(value);
    setDataValue(numericValue);
    setDataValueDisplay(formatNumber(numericValue));
  };

  // 네트워크 값 입력 처리
  const handleNetworkValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = extractNumber(value);
    setNetworkValue(numericValue);
    setNetworkValueDisplay(formatNumber(numericValue));
  };

  // 데이터 변환 계산
  const convertData = () => {
    const value = parseFloat(dataValue) || 0;
    const bytes = value * fromUnit.bytes;
    const result = bytes / toUnit.bytes;
    return result;
  };

  // 네트워크 변환 계산
  const convertNetwork = () => {
    const value = parseFloat(networkValue) || 0;
    const bitsPerSecond = value * fromNetworkUnit.rate;
    const result = bitsPerSecond / toNetworkUnit.rate;
    return result;
  };

  // 파일 크기별 다운로드 시간 계산
  const calculateDownloadTime = (fileSizeMB: number, speedMbps: number) => {
    const fileSizeBits = fileSizeMB * 8 * 1024 * 1024; // MB to bits
    const timeSeconds = fileSizeBits / (speedMbps * 1000000); // Mbps to bps
    return timeSeconds;
  };

  const dataResult = convertData();
  const networkResult = convertNetwork();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <FaDatabase className="text-3xl text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">데이터 변환 계산기</h1>
              <p className="text-gray-600">데이터 단위 및 네트워크 속도 변환</p>
            </div>
          </div>

          {/* 탭 버튼 */}
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center px-4 py-2 rounded-l-lg font-medium transition-colors ${
                activeTab === 'data'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaHdd className="mr-2" />
              데이터 단위 변환
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center px-4 py-2 rounded-r-lg font-medium transition-colors ${
                activeTab === 'network'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaWifi className="mr-2" />
              네트워크 속도 변환
            </button>
          </div>

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환할 값
                  </label>
                  <input
                    type="text"
                    value={dataValueDisplay}
                    onChange={handleDataValueChange}
                    placeholder="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환 전 단위
                  </label>
                  <select
                    value={fromUnit.symbol}
                    onChange={(e) => setFromUnit(dataUnits.find(u => u.symbol === e.target.value) || dataUnits[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {dataUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환 후 단위
                  </label>
                  <select
                    value={toUnit.symbol}
                    onChange={(e) => setToUnit(dataUnits.find(u => u.symbol === e.target.value) || dataUnits[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {dataUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">변환 결과</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {dataValue ? `${parseFloat(dataValue).toLocaleString()} ${fromUnit.symbol} = ${dataResult.toLocaleString()} ${toUnit.symbol}` : '값을 입력하세요'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환할 값
                  </label>
                  <input
                    type="text"
                    value={networkValueDisplay}
                    onChange={handleNetworkValueChange}
                    placeholder="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환 전 단위
                  </label>
                  <select
                    value={fromNetworkUnit.symbol}
                    onChange={(e) => setFromNetworkUnit(networkUnits.find(u => u.symbol === e.target.value) || networkUnits[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {networkUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    변환 후 단위
                  </label>
                  <select
                    value={toNetworkUnit.symbol}
                    onChange={(e) => setToNetworkUnit(networkUnits.find(u => u.symbol === e.target.value) || networkUnits[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {networkUnits.map(unit => (
                      <option key={unit.symbol} value={unit.symbol}>
                        {unit.name} ({unit.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">변환 결과</h3>
                <div className="text-2xl font-bold text-green-600">
                  {networkValue ? `${parseFloat(networkValue).toLocaleString()} ${fromNetworkUnit.symbol} = ${networkResult.toLocaleString()} ${toNetworkUnit.symbol}` : '값을 입력하세요'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 다운로드 시간 계산기 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <FaDownload className="text-2xl text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">다운로드 시간 계산기</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 크기 (MB)
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const fileSize = parseFloat(e.target.value) || 0;
                  const speed = 100; // 기본 100Mbps
                  const time = calculateDownloadTime(fileSize, speed);
                  // 결과 표시 로직 추가 가능
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                인터넷 속도 (Mbps)
              </label>
              <input
                type="number"
                placeholder="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-800">데이터 단위 정보</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">데이터 단위</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {dataUnits.map(unit => (
                  <div key={unit.symbol} className="flex justify-between">
                    <span>{unit.name} ({unit.symbol})</span>
                    <span>{unit.description}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">네트워크 단위</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {networkUnits.map(unit => (
                  <div key={unit.symbol} className="flex justify-between">
                    <span>{unit.name} ({unit.symbol})</span>
                    <span>{unit.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 