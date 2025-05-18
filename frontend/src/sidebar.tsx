import { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarProps } from "./data/type";

export default function Sidebar({ opened, setOpened }: SidebarProps) {
  const sidebarWidth = 180;

  return (
    <div
      className="fixed top-0 left-0 h-full bg-gray-300 shadow-md z-40 transition-transform duration-300"
      style={{
        width: `${sidebarWidth}px`,
        transform: opened ? "translateX(0)" : `translateX(-${sidebarWidth}px)`,
      }}
    >
      <div className="flex flex-col h-full relative">
        <div className="bg-gray-400 text-white w-full text-center py-4 text-lg font-bold">
          ReLu
        </div>
        <div className="flex-1 flex items-center justify-center">
          <nav className="flex flex-col items-center space-y-6">
            <Link to="/" className="block no-underline px-4 py-2 hover:scale-110 rounded transition">
              Main
            </Link>
            <Link to="/mylist" className="block no-underline px-4 py-2 hover:scale-110 rounded transition">
              List
            </Link>
            <Link to="/recommendation" className="block no-underline px-4 py-2 hover:scale-110 rounded transition">
              Recommendation
            </Link>
            <Link to="/settings" className="block no-underline px-4 py-2 hover:scale-110 rounded transition">
              Settings
            </Link>
          </nav>
        </div>
        <button
          onClick={() => setOpened(!opened)}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 z-50"
        >
          {opened ? "←" : "→"}
        </button>
      </div>
    </div>
  );
}
