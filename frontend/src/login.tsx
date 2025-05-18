import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const auth = getAuth(firebaseApp);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // ✅ 백엔드에 인증된 사용자로 로그인 요청 (예: 사용자 등록 또는 세션 생성)
      const response = await fetch("https://bridge7.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
          
        },
        body: JSON.stringify({ idToken }), // 필요 시 사용자 정보 포함
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error("백엔드 로그인 실패");
      }


      // 토큰과 사용자 정보 저장
      localStorage.setItem("currentUser", userCredential.user.email || "");
      localStorage.setItem("token", idToken);
      localStorage.setItem("userId", userCredential.user.uid);

      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-2/3 bg-black text-white flex items-center justify-center">
      </div>
      <div className="w-1/3 flex items-center justify-center bg-gray-100 p-12">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 pb-1">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <label className="block mb-2 text-sm font-medium">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[270px] h-[40px] bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
            placeholder="you@example.com"
          />
          <label className="block mb-2 text-sm font-medium mt-4">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[270px] h-[40px] mb-4 bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
            placeholder="********"
          />
          <button type="submit" className="w-full bg-black text-white py-2 rounded">
            LOGIN
          </button>
          <Link to={`/signup`} className="text-right no-underline block text-black-500 pt-1 text-sm">
            SignUp
          </Link>
        </form>
      </div>
    </div>
  );
}