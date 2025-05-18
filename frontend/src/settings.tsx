import { useState } from "react";

export default function Setting() {
  const [name, setName] = useState("")
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");

  const handleNameChange = async () => {
    if (!name.trim()) {
    alert("이름을 입력해주세요.");
    return;
  }
    try {
      const res = await fetch("https://bridge7.onrender.com/auth/name", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("이름 변경 실패");
      alert("이름이 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error(err);
      alert("이름 변경 중 오류가 발생했습니다.");
    }
  };

  const handlePasswordChange = async () => {
  try {
    const res = await fetch("https://bridge7.onrender.com/auth/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }), // 🔧 수정 포인트
      credentials: 'include', 
    });

    if (!res.ok) throw new Error("비밀번호 변경 실패");
    alert("비밀번호가 성공적으로 변경되었습니다.");
  } catch (err) {
    console.error(err);
    alert("비밀번호 변경 중 오류가 발생했습니다.");
  }
};

  const handleDeleteAccount = async () => {
    //eslint-disable-next-line no-restricted-globals
    if (confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        const res = await fetch("https://bridge7.onrender.com/user", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include', 
        });

        if (!res.ok) throw new Error("회원 탈퇴 실패");
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.clear();
        window.location.href = "/login";
      } catch (err) {
        console.error(err);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen px-8 py-16 bg-blue-50 text-gray-800 max-w-xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* 이름 수정 */}
      <div className="space-y-2">
        <label className="block font-semibold">Change name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Name"
          className="w-[512px] h-[40px] bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
        />
        <button
          onClick={handleNameChange}
          className="bg-black text-white px-4 py-2 rounded hover:bg-green-600 "
        >
          Change
        </button>
      </div>

      {/* 비밀번호 수정 */}
      <div className="space-y-2">
        <label className="block font-semibold">Change Password</label>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-[512px] h-[40px] bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
        />
        <button
          onClick={handlePasswordChange}
          className="bg-black text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Change
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div className="border-t pt-6">
        <button
          onClick={handleDeleteAccount}
          className="text-red-500 font-semibold hover:underline"
        >
          Delete Account    
        </button>
      </div>
    </div>
  );
}