import { Category } from "../types/calculator";

/**
 * 검색어에 따라 카테고리를 필터링하는 함수
 * @param categories - 전체 카테고리 배열
 * @param query - 검색어
 * @returns 필터링된 카테고리 배열
 */
export const filterCategoriesBySearch = (categories: Category[], query: string): Category[] => {
  if (query.trim() === "") {
    return categories;
  }

  const searchTerm = query.toLowerCase();
  
  return categories.map(category => ({
    ...category,
    calculators: category.calculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm) ||
      calc.description.toLowerCase().includes(searchTerm) ||
      category.title.toLowerCase().includes(searchTerm)
    )
  })).filter(category => category.calculators.length > 0);
};

/**
 * 검색 결과의 관련성을 계산하는 함수
 * @param text - 검색 대상 텍스트
 * @param query - 검색어
 * @returns 관련성 점수 (0-1)
 */
export const calculateRelevanceScore = (text: string, query: string): number => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // 정확한 일치
  if (textLower === queryLower) return 1.0;
  
  // 시작 부분 일치
  if (textLower.startsWith(queryLower)) return 0.9;
  
  // 포함 여부
  if (textLower.includes(queryLower)) return 0.7;
  
  // 단어 단위 일치
  const textWords = textLower.split(/\s+/);
  const queryWords = queryLower.split(/\s+/);
  const matchingWords = queryWords.filter(word => 
    textWords.some(textWord => textWord.includes(word))
  );
  
  if (matchingWords.length > 0) {
    return 0.5 * (matchingWords.length / queryWords.length);
  }
  
  return 0;
};

/**
 * 검색 결과를 관련성 순으로 정렬하는 함수
 * @param categories - 카테고리 배열
 * @param query - 검색어
 * @returns 정렬된 카테고리 배열
 */
export const sortCategoriesByRelevance = (categories: Category[], query: string): Category[] => {
  if (!query.trim()) return categories;
  
  return categories.map(category => {
    const categoryScore = calculateRelevanceScore(category.title, query);
    const calculatorScores = category.calculators.map(calc => ({
      ...calc,
      score: Math.max(
        calculateRelevanceScore(calc.name, query),
        calculateRelevanceScore(calc.description, query)
      )
    }));
    
    return {
      ...category,
      calculators: calculatorScores.sort((a, b) => (b.score || 0) - (a.score || 0)),
      score: Math.max(categoryScore, ...calculatorScores.map(c => c.score || 0))
    };
  }).sort((a, b) => (b.score || 0) - (a.score || 0));
}; 