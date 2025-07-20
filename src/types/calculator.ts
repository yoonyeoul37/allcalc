import { IconType } from "react-icons";

/**
 * 계산기 정보 인터페이스
 */
export interface Calculator {
  name: string;
  description: string;
  popular?: boolean;
}

/**
 * 카테고리 정보 인터페이스
 */
export interface Category {
  id: string;
  title: string;
  icon: IconType;
  count: number;
  completed: number;
  calculators: Calculator[];
}

/**
 * 홈페이지 상태 인터페이스
 */
export interface HomePageState {
  selectedCategory: string | null;
  searchQuery: string;
  filteredCategories: Category[];
} 