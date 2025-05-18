import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecommendationItem } from "./data/type";
import { Heart } from "lucide-react";

export default function Recommendation() {
  const location = useLocation();
  const stateResults = location.state as RecommendationItem[] | undefined;
  const [results, setResults] = useState<RecommendationItem[]>([]);

  const userId = localStorage.getItem("userId");

  

  const fetchRecommendations = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return [];
    }

    try {
      const res = await fetch(`https://bridge7.onrender.com/ai-assistant/recommendations/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("추천 결과 요청 실패");

      const data = await res.json();
      return data.suggestions || data;
    } catch (err) {
      console.error("추천 요청 실패", err);
      alert("추천 결과를 불러오는 데 실패했습니다.");
      return [];
    }
  };

  const handleLikeOne = async (item: RecommendationItem) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://bridge7.onrender.com/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // 있으면 추가
      },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        address: item.address,
        description: item.description,
      }),
    });

    const result = await res.text();
    console.log("응답 상태:", res.status);
    console.log("응답 결과:", result);

    if (!res.ok) throw new Error("좋아요 실패");

    alert(`"${item.name}" 좋아요 상태가 변경되었습니다.`);
  } catch (err) {
    console.error("좋아요 요청 실패:", err);
    alert("좋아요 처리 중 오류 발생");
  }
};



  useEffect(() => {
    setResults([]);

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetchRecommendations().then(setResults);
  }, [location.key]);

  if (results.length === 0) {
    return <div className="p-10 text-center">추천 중입니다...</div>;
  }

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">추천 장소</h1>
      {results.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow p-4 rounded space-y-2"
        >
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <p className="text-gray-700">{item.description}</p>

          {/* 주소와 하트를 같은 선상에 배치 */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">{item.address}</p>
            <button
              onClick={() => handleLikeOne(item)}
              className="text-red-500 hover:scale-110 transition"
              aria-label={`좋아요 ${item.name}`}
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
