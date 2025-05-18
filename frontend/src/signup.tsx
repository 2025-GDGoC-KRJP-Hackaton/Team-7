import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./firebase";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const auth = getAuth(firebaseApp);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 예시: 사용자 정보 저장
      localStorage.setItem("currentUser", userCredential.user.email || "");
      localStorage.setItem("token", idToken);

      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다. 이메일을 확인하거나 비밀번호를 다시 설정해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-2/3 bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">picture</h1>
      </div>
      <div className="w-1/3 flex items-center justify-center bg-gray-100 p-12">
        <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80 pb-1">
          <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
          <label className="block mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[270px] h-[40px] mb-4 bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
          />
          <label className="block mb-2 text-sm font-medium">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[270px] h-[40px] mb-4 bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
          />
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[270px] h-[40px] mb-4 bg-gray-300 rounded-full px-4 text-gray-800 placeholder-gray-500 outline-none"
            placeholder="at least 6 characters"
          />
          <button type="submit" className="w-full bg-black text-white py-2 rounded">
            Confirm
          </button>
          <Link to={`/login`} className="text-right no-underline block text-black-500 pt-1 text-sm">
            login
          </Link>
        </form>
      </div>
    </div>
  );
}
