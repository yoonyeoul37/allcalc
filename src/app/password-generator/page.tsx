"use client";

import { useState } from 'react';
import { FaCalculator, FaShieldAlt, FaNetworkWired, FaExchangeAlt, FaDatabase, FaCog, FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      alert('최소 하나의 문자 유형을 선택해주세요.');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('클립보드 복사에 실패했습니다.');
      }
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    const strengthMap = [
      { score: 0, label: '매우 약함', color: 'bg-red-500' },
      { score: 1, label: '약함', color: 'bg-orange-500' },
      { score: 2, label: '보통', color: 'bg-yellow-500' },
      { score: 3, label: '강함', color: 'bg-blue-500' },
      { score: 4, label: '매우 강함', color: 'bg-green-500' },
      { score: 5, label: '최강', color: 'bg-green-600' }
    ];

    return strengthMap[Math.min(score, 5)];
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaShieldAlt className="mr-3 text-[#003366]" />
              암호 생성기
            </h1>

            {/* 생성된 암호 표시 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                생성된 암호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] focus:outline-none"
                  placeholder="암호를 생성해주세요"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`p-2 ${copied ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-1">클립보드에 복사되었습니다!</p>
              )}
            </div>

            {/* 암호 강도 표시 */}
            {password && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  암호 강도
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score / 5 * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{strength.label}</span>
                </div>
              </div>
            )}

            {/* 설정 옵션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  암호 길이: {length}
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">대문자 포함 (A-Z)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">소문자 포함 (a-z)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">숫자 포함 (0-9)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">특수문자 포함 (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#002244] transition-colors font-semibold"
            >
              암호 생성
            </button>
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
              
              <a href="/unit-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaExchangeAlt className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">단위 변환기</h4>
                <p className="text-xs text-gray-600">단위 변환</p>
              </a>
              
              <a href="/data-converter" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaDatabase className="text-xl text-black" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">데이터 변환</h4>
                <p className="text-xs text-gray-600">데이터 변환</p>
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