import React, { useEffect, useState } from "react";

function Clock() {
  const [loginTime, setLoginTime] = useState<any>(null); // Timestamp when user logged in
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    let timer;
    if (loginTime) {
      timer = setInterval(() => {
        const now: any = new Date();
        const diff = now - loginTime;
        setElapsedTime(diff);
      }, 1000);
    }

    return () => clearInterval(timer); // Cleanup
  }, [loginTime]);

  const handleLogin = () => {
    const currentDate = new Date();
    setLoginTime(currentDate);
    setIsLoggedIn(true);
  };

  const handleLogoff = () => {
    setLoginTime(null);
    setElapsedTime(0);
    setIsLoggedIn(false);
    // You can also clear tokens, Redux state, etc here
    console.log("User logged off!");
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="space-y-6 w-full h-full bg-white  py-10 px-5 shadow-md">
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-blue-950 text-white border-m p-2 rounded-sm"
          >
            Login
          </button>
        ) : (
          <>
            <>
              <h2>Logged in : {formatTime(elapsedTime)}</h2>
            </>
            <>
              <button
                onClick={handleLogoff}
                className="bg-blue-950 text-white border-m p-2 rounded-sm"
              >
                Log Off
              </button>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default Clock;
