import { FaSearch } from "react-icons/fa";
import BasicCalculator from './ui/BasicCalculator';
import ScientificCalculator from './ui/ScientificCalculator';

/**
 * 검색 섹션 컴포넌트
 * 검색바와 계산기들을 포함
 * @param searchQuery - 현재 검색어
 * @param onSearch - 검색 처리 함수
 */
interface SearchSectionProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

export default function SearchSection({ searchQuery, onSearch }: SearchSectionProps) {
  return (
    <div className="w-full px-8 py-6" style={{backgroundColor: '#d1dde9', minHeight: '600px'}}>
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">무료 온라인 계산기</h1>
          <div className="w-96 mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="대출 계산기, BMI 계산기, 과학 계산기..."
                className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-full bg-white/90 backdrop-blur-sm shadow-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 placeholder-gray-400"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button 
                  onClick={() => onSearch(searchQuery)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 계산기들을 검색 바로 아래에 배치 - 모바일에서는 세로, 데스크톱에서는 가로 */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-center items-center lg:items-start mt-8">
          <BasicCalculator />
          <ScientificCalculator />
        </div>
      </div>
    </div>
  );
} 