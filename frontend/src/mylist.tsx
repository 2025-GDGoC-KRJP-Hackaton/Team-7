import { useEffect, useState } from "react";
import { Pencil, Plus, Minus, X, Share2, Heart, Copy, Send } from "lucide-react";

export default function MyList() {
  const [lists, setLists] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [checkedListIds, setCheckedListIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [selectedShareId, setSelectedShareId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    try {
      const res = await fetch("https://bridge7.onrender.com/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newTitle.trim() }),
        credentials: 'include', 
      });

      if (!res.ok) throw new Error("리스트 생성 실패");

      setNewTitle("");
    setShowModal(false);
    await fetchLists();
  } catch (err) {
    console.error("리스트 추가 오류:", err);
    alert("리스트를 추가하는 중 오류가 발생했습니다.");
  }
  };

  const fetchLists = async () => {
    try {
      const res = await fetch("https://bridge7.onrender.com/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', 
      });
      if (!res.ok) throw new Error("리스트 불러오기 실패");
      const data = await res.json();

      const hasFavorite = data.some((item: any) => item.name === "My Favorite");
      if (!hasFavorite) {
        const addRes = await fetch("https://bridge7.onrender.com/lists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: "My Favorite" }),
          credentials: 'include', 
        });
        if (addRes.ok) {
          const newItem = await addRes.json();
          setLists([...data, newItem]);
        } else {
          setLists(data);
        }
      } else {
        setLists(data);
      }
    } catch (err) {
      console.error("리스트 로딩 오류:", err);
    }
  };

  const fetchShareLink = async (id: number) => {
  try {
    const res = await fetch(`https://bridge7.onrender.com/lists/${id}/share`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include', 
    });

    if (!res.ok) throw new Error("공유 링크 요청 실패");

    const data = await res.json();
    setShareUrl(data.url); // 서버가 `{ url: "https://..." }` 형태로 응답한다고 가정
    setSelectedShareId(id);
    setShowShareModal(true);
  } catch (err) {
    console.error("공유 링크 불러오기 실패:", err);
    alert("공유 링크를 불러오는 데 실패했습니다.");
  }
};


  const handleDeleteChecked = async () => {
    try {
      for (const id of checkedListIds) {
        await fetch(`https://bridge7.onrender.com/lists/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', 
        });
      }
      fetchLists();
      setCheckedListIds([]);
    } catch (err) {
      console.error("삭제 오류:", err);
    }
  };
  const fetchListDetail = async (id: number) => {
  try {
    const res = await fetch(`https://bridge7.onrender.com/lists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include', 
    });

    if (!res.ok) throw new Error("리스트 상세 불러오기 실패");

    const detail = await res.json();
    setSelected(detail);
  } catch (err) {
    console.error("상세 정보 로딩 오류:", err);
    alert("리스트 상세 정보를 불러오는 데 실패했습니다.");
  }
};


  const toggleCheck = (id: number) => {
    setCheckedListIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCloseDetail = () => setSelected(null);

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (showShareModal && selectedShareId !== null) {
      const generatedUrl = `https://example.com/share/${selectedShareId}`;
      setShareUrl(generatedUrl);
    }
  }, [showShareModal, selectedShareId]);

  return (
    <div className="flex mt-5 flex-1 overflow-hidden">
      <div className={`relative transition-all duration-300 ${selected ? "w-1/2" : "w-full"} px-10 `}>
        <h1 className="text-2xl font-bold mb-4">📋 My Lists</h1>
        <ul className="space-y-3">
          {lists.map((item) => (
            <li
              key={item.id}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 flex justify-between items-center"
              onClick={() => fetchListDetail(item.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Heart className="text-red-400" size={24} />
                  <button
                    className="text-blue-500 text-xs hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchShareLink(item.id);
                    }}
                  >
                    <Share2 size={18} />
                  </button>
                </div>
                <span className="text-lg font-medium">{item.name}</span>
              </div>
              {editMode && item.id !== 1 && (
                <input
                  type="checkbox"
                  checked={checkedListIds.includes(item.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleCheck(item.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5"
                />
              )}
            </li>
          ))}
        </ul>
        <div className="flex absolute m-4 bottom-0 right-0 justify-end items-end *:ml-2">
          {editMode ? (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-green-600 border border-green-600 rounded-xl px-3 py-3 hover:bg-green-100 flex items-center space-x-1"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={handleDeleteChecked}
                disabled={checkedListIds.length === 0}
                className={`text-sm border rounded-xl px-3 py-3 flex items-center space-x-1 ${
                  checkedListIds.length === 0
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-red-600 border-red-600 hover:bg-red-100"
                }`}
              >
                <Minus size={20} />
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setCheckedListIds([]);
                }}
                className="text-sm text-black border border-black rounded-xl px-3 py-3 bg-white hover:bg-gray-100 flex items-center space-x-1"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm text-black border border-black rounded-xl px-3 py-3 bg-white hover:bg-gray-100"
            >
              <Pencil size={20} />
            </button>
          )}
          </div>
      </div>

      {selected && (
        <div className="w-1/2 bg-white shadow-lg p-6 transition-all duration-300">
          <button
            onClick={handleCloseDetail}
            className="text-gray-500 hover:text-black text-xl float-right"
          >
            ✕
          </button>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
            <p className="text-gray-600">{selected.description || "내용이 없습니다."}</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold">새 리스트 이름</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="예: 여름 여행 계획"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewTitle("");
                }}
                className="text-sm text-gray-500 hover:underline"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">공유 링크</h2>
                <Send size={25} />
              </div>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareUrl("");
                  setSelectedShareId(null);
                }}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded"
              >
                <Copy size={25} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
