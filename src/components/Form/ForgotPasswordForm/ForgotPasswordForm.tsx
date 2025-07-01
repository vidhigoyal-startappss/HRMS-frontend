const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/api/auth/forgot-password", { email });
    alert("Check your email for reset link");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
      <button type="submit">Send Reset Link</button>
    </form>
  );
};
