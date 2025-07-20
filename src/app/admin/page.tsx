"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin1234";

export default function AdminPage() {
  const [inputPassword, setInputPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [adCode, setAdCode] = useState("");
  const [adEnabled, setAdEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdCode(localStorage.getItem("adCode") || "");
      setAdEnabled(localStorage.getItem("adEnabled") === "true");
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setMessage("");
    } else {
      setMessage("비밀번호가 틀렸습니다.");
    }
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adCode", adCode);
      localStorage.setItem("adEnabled", adEnabled ? "true" : "false");
      setMessage("저장되었습니다.");
    }
  };

  if (!isAuthed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="w-full flex justify-center items-center py-6 mb-8 border-b">
          <Link href="/" className="text-3xl font-bold text-blue-600 hover:underline">AllCalc</Link>
        </header>
        <h1 className="text-2xl font-bold mb-4">관리자 로그인</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={e => setInputPassword(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">로그인</button>
        </form>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <header className="w-full flex justify-center items-center py-6 mb-8 border-b">
        <Link href="/" className="text-3xl font-bold text-blue-600 hover:underline">AllCalc</Link>
      </header>
      <h1 className="text-2xl font-bold mb-4">광고 관리</h1>
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={adEnabled}
          onChange={e => setAdEnabled(e.target.checked)}
        />
        광고 ON/OFF
      </label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={8}
        placeholder="광고 코드(HTML/JS) 입력"
        value={adCode}
        onChange={e => setAdCode(e.target.value)}
      />
      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">저장</button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">미리보기</h2>
        {adEnabled ? (
          <div dangerouslySetInnerHTML={{ __html: adCode }} className="border p-2" />
        ) : (
          <p className="text-gray-500">광고 OFF 상태입니다.</p>
        )}
      </div>
    </div>
  );
} 