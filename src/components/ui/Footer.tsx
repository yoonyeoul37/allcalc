import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 사이트 정보 */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-calculator text-2xl text-blue-400 mr-3"></i>
              <h3 className="text-xl font-bold">AllCalc</h3>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              다양한 계산기를 한 곳에서 편리하게 이용하세요. 
              금융, 건강, 학업에 필요한 모든 계산기를 제공합니다.
            </p>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                <i className="fas fa-home text-lg"></i>
              </Link>
              <a href="mailto:contact@allcalc.com" className="text-gray-300 hover:text-white transition-colors">
                <i className="fas fa-envelope text-lg"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-github text-lg"></i>
              </a>
            </div>
          </div>

          {/* 금융 계산기 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">금융 계산기</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/mortgage-calculator" className="hover:text-white transition-colors">주택담보대출</Link></li>
              <li><Link href="/loan-calculator" className="hover:text-white transition-colors">대출 계산기</Link></li>
            </ul>
          </div>

          {/* 건강 계산기 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">건강 계산기</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/bmi-calculator" className="hover:text-white transition-colors">BMI 계산기</Link></li>
              <li><Link href="/calorie-calculator" className="hover:text-white transition-colors">칼로리 계산기</Link></li>
            </ul>
          </div>

          {/* 학업 계산기 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">학업 계산기</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/gpa-calculator" className="hover:text-white transition-colors">GPA 계산기</Link></li>
              <li><Link href="/grade-calculator" className="hover:text-white transition-colors">성적 계산기</Link></li>
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
              <i className="fas fa-heart text-red-400 mx-1"></i>
              <span>for everyone</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 