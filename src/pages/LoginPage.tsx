import React, { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/ButtonComp";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { login } from "../feature/User/userSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("/user.json");
    const users = await res.json();

    const user = users.find(
      (u: any) => u.username === email && u.password === password
    );

    if (user) {
      setErrorMsg("");
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));

      // ✅ REDIRECT BASED ON ROLE
      if (["admin", "hr"].includes(user.role)) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      setErrorMsg("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    setErrorMsg("Something went wrong.");
  }
};


  return (
    <>
      {/* Logo fixed at top-left */}
      <img src="/logo.webp" alt="Logo" className="logo" />

      <div className="flex items-center justify-center min-h-screen p-4 bg-image">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {errorMsg && (
            <p className="text-red-500 mb-4 text-center">{errorMsg}</p>
          )}
          <form onSubmit={handleSubmit}>
            <InputField
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleEmailChange}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
            <div>
              <p className="text-gray-500 pb-2 text-right text-sm cursor-pointer">
                Forgot password?
              </p>
            </div>
            <Button
              name="Login"
              cls="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md transition"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
