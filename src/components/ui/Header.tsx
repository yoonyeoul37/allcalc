"use client";

import { useState } from "react";
import { FaSearch, FaCalculator } from "react-icons/fa";
import Link from "next/link";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch = () => {} }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50" style={{backgroundColor: '#003366'}}>
      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <div>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-white cursor-pointer">AllCalc 모든계</h1>
            </Link>
          </div>

          {/* 우측 로그인 */}
          <div className="text-right">
            <a href="#" className="text-white text-sm hover:underline">로그인</a>
          </div>
        </div>
      </div>
    </header>
  );
} 