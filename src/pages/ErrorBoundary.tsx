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
    
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f0f0',
      flexDirection: 'column',
      textAlign: 'center',
    };

    const titleStyle = {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: '#333',
    };

    const subtitleStyle = {
      fontSize: '1.5rem',
      marginBottom: '20px',
      color: '#555',
    };

    const buttonStyle = {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = {
      backgroundColor: '#0056b3',
    };

    const moonStyle = {
      width: '150px',
      height: '150px',
      background: '#F5E1A4',
      borderRadius: '50%',
      margin: '20px auto',
      position: 'relative',
    };

    const faceStyle = {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '50%',
      background: '#FF6B6B',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    const eyesStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      width: '60%',
    };

    const eyeStyle = {
      width: '20px',
      height: '20px',
      background: '#333',
      borderRadius: '50%',
    };

    const birdContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      marginTop: '40px',
    };

    const birdStyle = {
      width: '50px',
      height: '50px',
      backgroundColor: '#3498db',
      borderRadius: '50%',
      position: 'relative',
    };

    const wingStyle = {
      position: 'absolute',
      top: '50%',
      width: '10px',
      height: '20px',
      backgroundColor: '#fff',
    };

    const wingLeftStyle = {
      ...wingStyle,
      left: '-10px',
      transform: 'rotate(45deg)',
    };

    const wingRightStyle = {
      ...wingStyle,
      right: '-10px',
      transform: 'rotate(-45deg)',
    };

    if (this.state.hasError) {
      return (
        <div style={containerStyle}>
          <div style={titleStyle}>
            <span style={{ fontSize: '5rem' }}>404</span>
            <span style={subtitleStyle}>Page Not Found</span>
            <button
              style={buttonStyle}
              onClick={() => (window.location.href = "/")}
              onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            >
              Go Home
            </button>
          </div>

          <div style={moonStyle}>
            <div style={faceStyle}>
              <div style={eyesStyle}>
                <div style={eyeStyle}></div>
                <div style={eyeStyle}></div>
              </div>
            </div>
          </div>

          <div style={birdContainerStyle}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={birdStyle}>
                <div style={wingLeftStyle}></div>
                <div style={wingRightStyle}></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
