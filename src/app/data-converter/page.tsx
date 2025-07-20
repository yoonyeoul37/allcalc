"use client";

import { useState } from 'react';
import { FaCalculator, FaDatabase, FaNetworkWired, FaShieldAlt, FaExchangeAlt, FaCog, FaCopy } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function DataConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('decimal');
  const [outputType, setOutputType] = useState('binary');
  const [result, setResult] = useState('');

  const convertData = () => {
    if (!inputValue.trim()) {
      alert('값을 입력해주세요.');
      return;
    }

    try {
      let decimalValue: number;

      // 입력값을 10진수로 변환
      switch (inputType) {
        case 'decimal':
          decimalValue = parseInt(inputValue);
          break;
        case 'binary':
          decimalValue = parseInt(inputValue, 2);
          break;
        case 'hexadecimal':
          decimalValue = parseInt(inputValue, 16);
          break;
        case 'octal':
          decimalValue = parseInt(inputValue, 8);
          break;
        default:
          decimalValue = parseInt(inputValue);
      }

      if (isNaN(decimalValue)) {
        alert('올바른 값을 입력해주세요.');
        return;
      }

      // 10진수를 출력 타입으로 변환
      let convertedValue: string;
      switch (outputType) {
        case 'decimal':
          convertedValue = decimalValue.toString();
          break;
        case 'binary':
          convertedValue = decimalValue.toString(2);
          break;
        case 'hexadecimal':
          convertedValue = decimalValue.toString(16).toUpperCase();
          break;
        case 'octal':
          convertedValue = decimalValue.toString(8);
          break;
        default:
          convertedValue = decimalValue.toString();
      }

      setResult(convertedValue);
    } catch (error) {
      alert('변환 중 오류가 발생했습니다.');
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        alert('클립보드에 복사되었습니다!');
      } catch (err) {
        alert('클립보드 복사에 실패했습니다.');
      }
    }
  };

  const clearAll = () => {
    setInputValue('');
    setResult('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaDatabase className="mr-3 text-[#003366]" />
              데이터 변환 계산기
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  입력 타입
                </label>
                <select
                  value={inputType}
                  onChange={(e) => setInputType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="decimal">10진수</option>
                  <option value="binary">2진수</option>
                  <option value="hexadecimal">16진수</option>
                  <option value="octal">8진수</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  출력 타입
                </label>
                <select
                  value={outputType}
                  onChange={(e) => setOutputType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                >
                  <option value="decimal">10진수</option>
                  <option value="binary">2진수</option>
                  <option value="hexadecimal">16진수</option>
                  <option value="octal">8진수</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입력값
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`${inputType === 'decimal' ? '10진수' : inputType === 'binary' ? '2진수' : inputType === 'hexadecimal' ? '16진수' : '8진수'} 입력`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
              />
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={convertData}
                className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
              >
                변환하기
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                초기화
              </button>
            </div>

            {result && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  변환 결과
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={result}
                    readOnly
                    className="w-full p-3 pr-16 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}

            {/* 변환 가이드 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">변환 가이드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold mb-2">10진수 → 2진수</h4>
                  <p>예: 255 → 11111111</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2진수 → 16진수</h4>
                  <p>예: 11111111 → FF</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">16진수 → 10진수</h4>
                  <p>예: FF → 255</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">8진수 → 2진수</h4>
                  <p>예: 377 → 11111111</p>
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
              <a href="/subnet-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaNetworkWired className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">서브넷 계산기</h4>
                <p className="text-xs text-gray-600">네트워크 계산</p>
              </a>
              
              <a href="/password-generator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">암호 생성기</h4>
                <p className="text-xs text-gray-600">암호 생성</p>
              </a>
              
              <a href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">단위 변환</p>
              </a>
              
              <a href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCog className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">고급 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 