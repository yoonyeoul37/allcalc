"use client";

import { useState } from "react";
import { FaKey, FaCopy, FaEye, FaEyeSlash, FaShieldAlt, FaRandom, FaHistory, FaCheck, FaCalculator } from "react-icons/fa";
import Header from '../../components/ui/Header';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface GeneratedPassword {
  password: string;
  strength: string;
  strengthScore: number;
  timestamp: Date;
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<GeneratedPassword[]>([]);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const characters = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    similar: "il1Lo0O",
    ambiguous: "{}[]()/\\'\"`~,;:.<>"
  };

  const getAvailableCharacters = (): string => {
    let chars = "";
    if (options.includeUppercase) chars += characters.uppercase;
    if (options.includeLowercase) chars += characters.lowercase;
    if (options.includeNumbers) chars += characters.numbers;
    if (options.includeSymbols) chars += characters.symbols;
    
    if (options.excludeSimilar) {
      chars = chars.split('').filter(char => !characters.similar.includes(char)).join('');
    }
    
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !characters.ambiguous.includes(char)).join('');
    }
    
    return chars;
  };

  const generatePassword = (): string => {
    const chars = getAvailableCharacters();
    if (chars.length === 0) {
      alert("최소 하나의 문자 유형을 선택해주세요.");
      return "";
    }

    let result = "";
    for (let i = 0; i < options.length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const calculateStrength = (password: string): { strength: string; score: number } => {
    let score = 0;
    
    // 길이 점수
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;
    
    // 문자 종류 점수
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // 복잡도 점수
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.8) score += 1;
    
    let strength = "";
    if (score <= 2) strength = "매우 약함";
    else if (score <= 4) strength = "약함";
    else if (score <= 6) strength = "보통";
    else if (score <= 8) strength = "강함";
    else strength = "매우 강함";
    
    return { strength, score };
  };

  const handleGenerate = () => {
    const newPassword = generatePassword();
    if (newPassword) {
      const strengthInfo = calculateStrength(newPassword);
      const generatedPassword: GeneratedPassword = {
        password: newPassword,
        strength: strengthInfo.strength,
        strengthScore: strengthInfo.score,
        timestamp: new Date()
      };
      
      setPassword(newPassword);
      setHistory(prev => [generatedPassword, ...prev.slice(0, 9)]); // 최대 10개 유지
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("복사에 실패했습니다.");
      }
    }
  };

  const getStrengthColor = (strength: string): string => {
    switch (strength) {
      case "매우 약함": return "text-red-600";
      case "약함": return "text-orange-600";
      case "보통": return "text-yellow-600";
      case "강함": return "text-green-600";
      case "매우 강함": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getStrengthBgColor = (strength: string): string => {
    switch (strength) {
      case "매우 약함": return "bg-red-50";
      case "약함": return "bg-orange-50";
      case "보통": return "bg-yellow-50";
      case "강함": return "bg-green-50";
      case "매우 강함": return "bg-blue-50";
      default: return "bg-gray-50";
    }
  };

  const resetOptions = () => {
    setOptions({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeSimilar: false,
      excludeAmbiguous: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <FaKey className="text-4xl text-purple-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-800">암호생성기</h1>
            </div>
            <p className="text-lg text-gray-600">안전하고 강력한 비밀번호 생성</p>
          </div>

          {/* 생성된 비밀번호 표시 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">생성된 비밀번호</h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  placeholder="비밀번호를 생성해주세요"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <button
                onClick={handleCopy}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center ${
                  copied 
                    ? "bg-green-600 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copied ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
                {copied ? "복사됨" : "복사"}
              </button>
            </div>

            {password && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">{password.length}</div>
                  <div className="text-sm text-gray-600">길이</div>
                </div>
                
                <div className={`p-4 rounded-lg text-center ${getStrengthBgColor(calculateStrength(password).strength)}`}>
                  <div className={`text-lg font-bold ${getStrengthColor(calculateStrength(password).strength)}`}>
                    {calculateStrength(password).strength}
                  </div>
                  <div className="text-sm text-gray-600">보안 강도</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {calculateStrength(password).score}/10
                  </div>
                  <div className="text-sm text-gray-600">보안 점수</div>
                </div>
              </div>
            )}
          </div>

          {/* 생성 옵션 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">생성 옵션</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 길이</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={options.length}
                    onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-gray-600 w-12">{options.length}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  권장: 12자 이상
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">문자 유형</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeUppercase}
                      onChange={(e) => setOptions({...options, includeUppercase: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">대문자 (A-Z)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeLowercase}
                      onChange={(e) => setOptions({...options, includeLowercase: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">소문자 (a-z)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeNumbers}
                      onChange={(e) => setOptions({...options, includeNumbers: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">숫자 (0-9)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.includeSymbols}
                      onChange={(e) => setOptions({...options, includeSymbols: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">특수문자 (!@#$%^&*)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">고급 옵션</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.excludeSimilar}
                    onChange={(e) => setOptions({...options, excludeSimilar: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">유사한 문자 제외 (l, 1, I, O, 0)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => setOptions({...options, excludeAmbiguous: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">모호한 특수문자 제외 ({}, [], (), /, \, ', ")</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleGenerate}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center"
              >
                <FaRandom className="mr-2" />
                비밀번호 생성
              </button>
              
              <button
                onClick={resetOptions}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
              >
                <FaShieldAlt className="mr-2" />
                기본값으로
              </button>
            </div>
          </div>

          {/* 생성 히스토리 */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-6">생성 히스토리</h3>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="font-mono text-sm">
                        {showPassword ? item.password : "•".repeat(item.password.length)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${getStrengthBgColor(item.strength)}`}>
                        <span className={getStrengthColor(item.strength)}>{item.strength}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 보안 가이드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">보안 가이드</h3>
            <div className="space-y-3 text-gray-600">
              <p>• <strong>강력한 비밀번호:</strong> 대문자, 소문자, 숫자, 특수문자를 모두 포함하세요.</p>
              <p>• <strong>충분한 길이:</strong> 최소 12자 이상을 권장합니다.</p>
              <p>• <strong>개인정보 제외:</strong> 이름, 생년월일, 전화번호 등은 사용하지 마세요.</p>
              <p>• <strong>정기적 변경:</strong> 3-6개월마다 비밀번호를 변경하세요.</p>
              <p>• <strong>고유한 비밀번호:</strong> 각 계정마다 다른 비밀번호를 사용하세요.</p>
              <p>• <strong>안전한 저장:</strong> 생성된 비밀번호는 안전한 곳에 보관하세요.</p>
            </div>
          </div>

          {/* 관련 계산기 링크 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">관련 계산기</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/random-number-generator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaRandom className="text-xl text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">난수 생성기</h4>
                <p className="text-xs text-gray-600">무작위 숫자</p>
              </a>
              
              <a href="/subnet-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-green-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaShieldAlt className="text-xl text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">서브넷 계산기</h4>
                <p className="text-xs text-gray-600">네트워크 보안</p>
              </a>
              
              <a href="/engineering-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-purple-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaKey className="text-xl text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">공학용 계산기</h4>
                <p className="text-xs text-gray-600">고급 계산</p>
              </a>
              
              <a href="/percentage-calculator" className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-orange-300 cursor-pointer">
                <div className="w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <FaCalculator className="text-xl text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">백분율 계산기</h4>
                <p className="text-xs text-gray-600">비율 계산</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 