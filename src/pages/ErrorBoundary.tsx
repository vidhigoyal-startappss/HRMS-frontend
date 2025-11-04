import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("Error caught in Error Boundary: ", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const containerStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "radial-gradient(circle at top, #0f2027, #203a43, #2c5364)",
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
      overflow: "hidden",
      position: "relative",
    };

    const titleStyle = {
      fontSize: "6rem",
      fontWeight: "900",
      marginBottom: "0.5rem",
      letterSpacing: "5px",
      color: "#ffffff",
      textShadow: "0 0 20px rgba(255,255,255,0.3)",
    };

    const subtitleStyle = {
      fontSize: "1.5rem",
      marginBottom: "30px",
      color: "rgba(255,255,255,0.7)",
    };

    const buttonStyle = {
      padding: "14px 35px",
      fontSize: "1.1rem",
      background: "linear-gradient(45deg, #00c6ff, #0072ff)",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 5px 20px rgba(0, 114, 255, 0.4)",
      transition: "all 0.3s ease",
    };

    const moonStyle = {
      width: "160px",
      height: "160px",
      background: "radial-gradient(circle at 30% 30%, #fff8dc, #d4c098)",
      borderRadius: "50%",
      position: "absolute",
      top: "10%",
      right: "15%",
      boxShadow: "0 0 60px rgba(255,255,200,0.4)",
      animation: "float 6s ease-in-out infinite",
    };

    const starsContainer = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      zIndex: 0,
    };

    const starStyle = {
      position: "absolute",
      width: "2px",
      height: "2px",
      background: "white",
      borderRadius: "50%",
      opacity: 0.8,
      animation: "twinkle 2s infinite ease-in-out",
    };

    const floatingBirdStyle = {
      width: "60px",
      height: "60px",
      background: "linear-gradient(135deg, #00b4db, #0083b0)",
      borderRadius: "50%",
      position: "absolute",
      bottom: "15%",
      left: "20%",
      boxShadow: "0 0 25px rgba(0,180,219,0.6)",
      animation: "fly 8s ease-in-out infinite alternate",
    };

    const globalStyles = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
      }

      @keyframes fly {
        0% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(50px, -50px) rotate(10deg); }
        100% { transform: translate(-30px, 30px) rotate(-10deg); }
      }

      button:hover {
        transform: scale(1.08);
        box-shadow: 0 10px 30px rgba(0, 114, 255, 0.6);
      }
    `;

    // Generate random stars
    const stars = Array.from({ length: 30 }).map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    }));

    return (
      <div style={containerStyle}>
        <style>{globalStyles}</style>
        <div style={starsContainer}>
          {stars.map((star, i) => (
            <div key={i} style={{ ...starStyle, ...star }} />
          ))}
        </div>

        <div style={moonStyle}></div>
        <div style={floatingBirdStyle}></div>

        <h1 style={titleStyle}>Oops!</h1>
        <p style={subtitleStyle}>Something went wrong. Let’s get you back on track.</p>
        <button
          style={buttonStyle}
           onClick={() => (window.location.href = "https://hrms1-kappa.vercel.app/")}
        >
          Go to the Login Link Again https://hrms1-kappa.vercel.app/
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
