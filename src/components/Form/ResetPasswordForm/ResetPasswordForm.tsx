import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../../../api/auth";
const ResetPasswordForm = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/api/auth/reset-password", { token, password });
    alert("Password updated");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};
