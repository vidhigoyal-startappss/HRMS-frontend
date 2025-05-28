import React, { useState } from "react";
import InputField from "../components/common/InputField";
import Button from "../components/common/ButtonComp";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import { toast } from 'react-toastify';
import { login } from "../feature/User/userSlice";
import axios from "axios";

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
  setErrorMsg("");

  try {
    const response = await axios.post("http://localhost:3001/api/login", {
      email,
      password,
    });

    const user = response.data.user;

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));

      toast.success("Login successful!");

      if (["admin", "superadmin", "hr"].includes(user.role.toLowerCase())) {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee");
      }
    } else {
      setErrorMsg("User not found");
      toast.error("User not found");
    }
  } catch (err: any) {
    console.error(err);
    const msg =
      err.response?.data?.message || "Invalid credentials or server error.";
    setErrorMsg(msg);
    toast.error(msg);
  }
};


  return (
    <>
      <img src="/logo.webp" alt="Logo" className="logo fixed top-4 left-4 w-20" />

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
