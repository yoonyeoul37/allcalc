"use client";

import { useState } from "react";
import { FaNetworkWired, FaCalculator, FaServer, FaGlobe, FaShieldAlt, FaCog } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  cidr: number;
}

export default function SubnetCalculator() {
  const [calculationType, setCalculationType] = useState("basic");
  const [ipAddress, setIpAddress] = useState("192.168.1.0");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [cidr, setCidr] = useState("24");
  const [subnetCount, setSubnetCount] = useState("4");
  const [result, setResult] = useState<any>(null);
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);

  // IP 주소를 숫자로 변환
  const ipToNumber = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
  };

  // 숫자를 IP 주소로 변환
  const numberToIp = (num: number): string => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  // IP 주소 유효성 검사
  const isValidIp = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  };

  // 서브넷 마스크를 CIDR로 변환
  const maskToCidr = (mask: string): number => {
    const num = ipToNumber(mask);
    return 32 - Math.log2((~num >>> 0) + 1);
  };

  // CIDR을 서브넷 마스크로 변환
  const cidrToMask = (cidr: number): string => {
    const mask = ((1 << 32) - 1) << (32 - cidr);
    return numberToIp(mask);
  };

  // IP 클래스 확인
  const getIpClass = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet >= 1 && firstOctet <= 126) return "A";
    if (firstOctet >= 128 && firstOctet <= 191) return "B";
    if (firstOctet >= 192 && firstOctet <= 223) return "C";
    if (firstOctet >= 224 && firstOctet <= 239) return "D";
    if (firstOctet >= 240 && firstOctet <= 255) return "E";
    return "Unknown";
  };

  // 서브넷 정보 계산
  const calculateSubnetInfo = (ip: string, mask: string): SubnetInfo => {
    const ipNum = ipToNumber(ip);
    const maskNum = ipToNumber(mask);
    const networkNum = ipNum & maskNum;
    const broadcastNum = networkNum | (~maskNum >>> 0);
    const firstHostNum = networkNum + 1;
    const lastHostNum = broadcastNum - 1;
    const totalHosts = (~maskNum >>> 0) + 1;
    const usableHosts = totalHosts - 2;

    return {
      networkAddress: numberToIp(networkNum),
      broadcastAddress: numberToIp(broadcastNum),
      firstHost: numberToIp(firstHostNum),
      lastHost: numberToIp(lastHostNum),
      totalHosts,
      usableHosts: Math.max(0, usableHosts),
      subnetMask: mask,
      cidr: maskToCidr(mask)
    };
  };

  // 서브넷 분할 계산
  const calculateSubnetDivision = (ip: string, originalCidr: number, subnetCount: number) => {
    const bitsNeeded = Math.ceil(Math.log2(subnetCount));
    const newCidr = originalCidr + bitsNeeded;
    const newMask = cidrToMask(newCidr);
    const subnetSize = Math.pow(2, 32 - newCidr);
    
    const subnets: SubnetInfo[] = [];
    const networkNum = ipToNumber(ip) & ipToNumber(cidrToMask(originalCidr));
    
    for (let i = 0; i < subnetCount; i++) {
      const subnetNetworkNum = networkNum + (i * subnetSize);
      const subnetIp = numberToIp(subnetNetworkNum);
      subnets.push(calculateSubnetInfo(subnetIp, newMask));
    }
    
    return subnets;
  };

  const handleBasicCalculation = () => {
    if (!isValidIp(ipAddress)) {
      alert("올바른 IP 주소를 입력해주세요.");
      return;
    }

    const info = calculateSubnetInfo(ipAddress, subnetMask);
    const ipClass = getIpClass(ipAddress);
    
    setResult({
      type: "basic",
      ipAddress,
      ipClass,
      ...info
    });
  };

  const handleCidrCalculation = () => {
    if (!isValidIp(ipAddress)) {
      alert("올바른 IP 주소를 입력해주세요.");
      return;
    }

    const cidrNum = parseInt(cidr);
    if (cidrNum < 0 || cidrNum > 32) {
      alert("CIDR은 0-32 사이의 값이어야 합니다.");
      return;
    }

    const mask = cidrToMask(cidrNum);
    const info = calculateSubnetInfo(ipAddress, mask);
    const ipClass = getIpClass(ipAddress);
    
    setResult({
      type: "cidr",
      ipAddress,
      ipClass,
      cidr: cidrNum,
      ...info
    });
  };

  const handleSubnetDivision = () => {
    if (!isValidIp(ipAddress)) {
      alert("올바른 IP 주소를 입력해주세요.");
      return;
    }

    const count = parseInt(subnetCount);
    if (count < 2 || count > 256) {
      alert("서브넷 수는 2-256 사이의 값이어야 합니다.");
      return;
    }

    const originalCidr = maskToCidr(subnetMask);
    const subnets = calculateSubnetDivision(ipAddress, originalCidr, count);
    
    setSubnets(subnets);
    setResult({
      type: "division",
      originalIp: ipAddress,
      originalMask: subnetMask,
      originalCidr,
      subnetCount: count,
      newCidr: originalCidr + Math.ceil(Math.log2(count))
    });
  };

  const resetCalculator = () => {
    setIpAddress("192.168.1.0");
    setSubnetMask("255.255.255.0");
    setCidr("24");
    setSubnetCount("4");
    setResult(null);
    setSubnets([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaNetworkWired className="text-4xl text-blue-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">서브넷 계산기</h1>
            </div>
            <p className="text-lg text-gray-600">네트워크 IP 주소 및 서브넷 계산</p>
          </div>

          {/* 계산 타입 선택 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">계산 유형 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setCalculationType("basic")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "basic"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <FaCalculator className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">기본 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("cidr")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "cidr"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <FaGlobe className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">CIDR 계산</span>
              </button>
              
              <button
                onClick={() => setCalculationType("division")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === "division"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <FaServer className="text-2xl mx-auto mb-2" />
                <span className="font-semibold">서브넷 분할</span>
              </button>
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">네트워크 정보 입력</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP 주소</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 192.168.1.0"
                />
              </div>
              
              {calculationType === "basic" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">서브넷 마스크</label>
                  <input
                    type="text"
                    value={subnetMask}
                    onChange={(e) => setSubnetMask(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 255.255.255.0"
                  />
                </div>
              )}
              
              {calculationType === "cidr" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CIDR 표기</label>
                  <input
                    type="number"
                    value={cidr}
                    onChange={(e) => setCidr(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="32"
                    placeholder="예: 24"
                  />
                </div>
              )}
              
              {calculationType === "division" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">서브넷 수</label>
                  <input
                    type="number"
                    value={subnetCount}
                    onChange={(e) => setSubnetCount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="2"
                    max="256"
                    placeholder="예: 4"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  if (calculationType === "basic") handleBasicCalculation();
                  else if (calculationType === "cidr") handleCidrCalculation();
                  else if (calculationType === "division") handleSubnetDivision();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                <FaCalculator className="mr-2" />
                계산하기
              </button>
              
              <button
                onClick={resetCalculator}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                <FaCog className="mr-2" />
                초기화
              </button>
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">계산 결과</h3>
              
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">{result.ipAddress}</div>
                    <div className="text-sm text-gray-600">IP 주소</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">클래스 {result.ipClass}</div>
                    <div className="text-sm text-gray-600">IP 클래스</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">/{result.cidr}</div>
                    <div className="text-sm text-gray-600">CIDR 표기</div>
                  </div>
                </div>

                {/* 네트워크 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">네트워크 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">네트워크 주소:</span>
                        <span className="font-mono text-blue-600">{result.networkAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">브로드캐스트 주소:</span>
                        <span className="font-mono text-red-600">{result.broadcastAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">첫 번째 호스트:</span>
                        <span className="font-mono text-green-600">{result.firstHost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">마지막 호스트:</span>
                        <span className="font-mono text-green-600">{result.lastHost}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">호스트 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">총 호스트 수:</span>
                        <span className="font-bold">{result.totalHosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">사용 가능한 호스트:</span>
                        <span className="font-bold text-green-600">{result.usableHosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">서브넷 마스크:</span>
                        <span className="font-mono text-purple-600">{result.subnetMask}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서브넷 분할 결과 */}
                {result.type === "division" && subnets.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">서브넷 분할 결과</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-sm">서브넷</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm">네트워크 주소</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm">첫 번째 호스트</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm">마지막 호스트</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm">브로드캐스트</th>
                            <th className="border border-gray-300 px-3 py-2 text-sm">사용 가능한 호스트</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subnets.map((subnet, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 text-sm text-center">{index + 1}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm font-mono text-blue-600">{subnet.networkAddress}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm font-mono text-green-600">{subnet.firstHost}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm font-mono text-green-600">{subnet.lastHost}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm font-mono text-red-600">{subnet.broadcastAddress}</td>
                              <td className="border border-gray-300 px-3 py-2 text-sm text-center">{subnet.usableHosts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">사용법 안내</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>기본 계산:</strong> IP 주소와 서브넷 마스크를 입력하여 네트워크 정보를 계산합니다.</p>
              <p>• <strong>CIDR 계산:</strong> IP 주소와 CIDR 표기(/24, /26 등)를 입력하여 서브넷 정보를 계산합니다.</p>
              <p>• <strong>서브넷 분할:</strong> 기존 네트워크를 여러 서브넷으로 나누어 각각의 정보를 계산합니다.</p>
              <p>• <strong>IP 클래스:</strong> A(1-126), B(128-191), C(192-223), D(224-239), E(240-255)</p>
              <p>• <strong>CIDR 표기:</strong> /8(A클래스), /16(B클래스), /24(C클래스) 등으로 네트워크 크기 표시</p>
            </div>
          </div>

          {/* 관련 계산기 링크 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">고급 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
              
              <a href="/fraction-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">분수 계산기</h4>
                <p className="text-xs text-gray-600">분수 계산</p>
              </a>
              
              <a href="/standard-deviation-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">표준편차 계산기</h4>
                <p className="text-xs text-gray-600">통계 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 