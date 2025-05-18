import Sidebar from "./sidebar";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState<boolean | null>(null);

useEffect(() => {
  const saved = localStorage.getItem("sidebar-opened");
  if (saved !== null) {
    setOpened(saved === "true");
  } else {
    setOpened(true); // 기본값
  }
}, []);

useEffect(() => {
  if (opened !== null) {
    localStorage.setItem("sidebar-opened", opened.toString());
  }
}, [opened]);

if (opened === null) return null;

  return (
    <div className="flex min-h-screen bg-blue-50 transition-all duration-300">
      <Sidebar opened={opened} setOpened={setOpened} />
      <main
        className={`flex flex-col flex-1 transition-all duration-300 ${
          opened ? "ml-[180px]" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
