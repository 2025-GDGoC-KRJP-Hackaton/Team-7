import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const [location, setLocation] = useState("");
  const [preference, setPreference] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // 또는 다른 방식으로 유저 ID 확보
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch("https://bridge7.onrender.com/ai-assistant/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          location,
          preferences: preference,
        }),
        credentials: 'include', 
      });

      if (!res.ok) throw new Error("추천 요청 실패");

      const data = await res.json();
      console.log("추천 요청 결과:", data);

      navigate("/recommendation", { state: data }); // 추천 페이지로 이동
    } catch (err) {
      console.error("에러 발생:", err);
      alert("추천 요청에 실패했습니다.");
    }
  };


  return (
    <div className="min-h-screen px-4 pt-32 bg-blue-50 text-gray-900 flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-black">ReLu</h1>

        <div>
          <label className="block font-semibold mb-1 text-black">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-[576px] h-[40px] bg-gray-100 border border-black rounded-xl px-4 py-1 text-black text-lg"
            placeholder="ex) Tokyo, Seoul"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-black">Preferences</label>
          <textarea
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="w-[576px] h-[144px] bg-gray-100 border border-black rounded-xl px-4 py-3 text-black text-lg"
            placeholder="Write your preferences!"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition w-full"
        >
          Recommend
        </button>
      </form>
    </div>
  );
}
