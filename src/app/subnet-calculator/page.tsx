"use client";

import { useState } from 'react';
import Link from "next/link";
import { FaCalculator, FaNetworkWired, FaGlobe, FaExchangeAlt, FaDatabase, FaShieldAlt, FaCog, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [networkClass, setNetworkClass] = useState('A');
  const [result, setResult] = useState<any>(null);

  const calculateSubnet = () => {
    if (!ipAddress || !subnetMask) {
      alert('IP 주소와 서브넷 마스크를 입력해주세요.');
      return;
    }

    try {
      // IP 주소를 4개의 옥텟으로 분리
      const ipParts = ipAddress.split('.').map(Number);
      const maskParts = subnetMask.split('.').map(Number);

      // 네트워크 주소 계산
      const networkAddress = ipParts.map((part, index) => part & maskParts[index]);
      
      // 브로드캐스트 주소 계산
      const broadcastAddress = ipParts.map((part, index) => 
        (part & maskParts[index]) | (~maskParts[index] & 255)
      );

      // 첫 번째 사용 가능한 IP
      const firstUsableIP = [...networkAddress];
      firstUsableIP[3] += 1;

      // 마지막 사용 가능한 IP
      const lastUsableIP = [...broadcastAddress];
      lastUsableIP[3] -= 1;

      // 호스트 수 계산
      const hostBits = maskParts.reduce((count, mask) => {
        return count + (255 - mask).toString(2).split('1').length - 1;
      }, 0);
      const totalHosts = Math.pow(2, hostBits) - 2;

      setResult({
        networkAddress: networkAddress.join('.'),
        broadcastAddress: broadcastAddress.join('.'),
        firstUsableIP: firstUsableIP.join('.'),
        lastUsableIP: lastUsableIP.join('.'),
        totalHosts,
        subnetMask: subnetMask
      });
    } catch (error) {
      alert('올바른 IP 주소와 서브넷 마스크를 입력해주세요.');
    }
  };

  const getDefaultSubnetMask = (networkClass: string) => {
    switch (networkClass) {
      case 'A': return '255.0.0.0';
      case 'B': return '255.255.0.0';
      case 'C': return '255.255.255.0';
      default: return '255.0.0.0';
    }
  };

  const handleNetworkClassChange = (newClass: string) => {
    setNetworkClass(newClass);
    setSubnetMask(getDefaultSubnetMask(newClass));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaNetworkWired className="mr-3 text-[#003366]" />
              서브넷 계산기
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP 주소
                </label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  서브넷 마스크
                </label>
                <input
                  type="text"
                  value={subnetMask}
                  onChange={(e) => setSubnetMask(e.target.value)}
                  placeholder="255.255.255.0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none text-black"
                  style={{ color: '#000000 !important' }}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                네트워크 클래스
              </label>
              <div className="flex gap-4">
                {['A', 'B', 'C'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleNetworkClassChange(cls)}
                    className={`px-4 py-2 rounded-lg border ${
                      networkClass === cls
                        ? 'bg-[#003366] text-white border-[#003366]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#003366]'
                    }`}
                  >
                    클래스 {cls}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateSubnet}
              className="w-full mt-6 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
            >
              계산하기
            </button>

            {result && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">계산 결과</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">네트워크 주소</p>
                    <p className="font-mono text-lg">{result.networkAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">브로드캐스트 주소</p>
                    <p className="font-mono text-lg">{result.broadcastAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">첫 번째 사용 가능한 IP</p>
                    <p className="font-mono text-lg">{result.firstUsableIP}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">마지막 사용 가능한 IP</p>
                    <p className="font-mono text-lg">{result.lastUsableIP}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">총 호스트 수</p>
                    <p className="font-mono text-lg">{result.totalHosts.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">서브넷 마스크</p>
                    <p className="font-mono text-lg">{result.subnetMask}</p>
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
              <Link href="/password-generator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">암호 생성기</h4>
                <p className="text-xs text-gray-600">암호 생성</p>
              </Link>
              
              <Link href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">단위 변환</p>
              </Link>
              
              <Link href="/data-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDatabase className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">데이터 변환</h4>
                <p className="text-xs text-gray-600">데이터 변환</p>
              </Link>
              
              <Link href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCog className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">고급 계산</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 
