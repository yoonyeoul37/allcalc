import { FaCalculator, FaHome, FaEnvelope, FaGithub, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 사이트 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <FaCalculator className="text-2xl text-blue-400 mr-3" />
              <h3 className="text-xl font-bold">AllCalc</h3>
            </div>
            <p className="text-gray-300 mb-4">
              다양한 계산기를 한 곳에서 편리하게 이용하세요. 
              금융, 건강, 학업, 생활에 필요한 모든 계산기를 제공합니다.
            </p>
            <div className="flex space-x-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">
                <FaHome className="text-lg" />
              </a>
              <a href="mailto:contact@allcalc.com" className="text-gray-300 hover:text-white transition-colors">
                <FaEnvelope className="text-lg" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <FaGithub className="text-lg" />
              </a>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/mortgage-calculator" className="hover:text-white transition-colors">주택담보대출</a></li>
              <li><a href="/loan-calculator" className="hover:text-white transition-colors">대출 계산기</a></li>
              <li><a href="/interest-calculator" className="hover:text-white transition-colors">이자 계산기</a></li>
              <li><a href="/investment-calculator" className="hover:text-white transition-colors">투자 계산기</a></li>
              <li><a href="/bmi-calculator" className="hover:text-white transition-colors">BMI 계산기</a></li>
            </ul>
          </div>

          {/* 카테고리 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">카테고리</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">금융 계산기</a></li>
              <li><a href="/" className="hover:text-white transition-colors">건강 계산기</a></li>
              <li><a href="/" className="hover:text-white transition-colors">학업 계산기</a></li>
              <li><a href="/" className="hover:text-white transition-colors">생활 계산기</a></li>
              <li><a href="/" className="hover:text-white transition-colors">기타 계산기</a></li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AllCalc. All rights reserved.
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-400 mx-1" />
              <span>for everyone</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 