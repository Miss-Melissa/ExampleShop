// GoBackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // React Router v6

function BackBtn() {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous page
    } else {
      navigate('/'); // If no history, go to the homepage
    }
  };

  return (
    <button onClick={handleGoBack} className="go-back-btn">
      ← Back
    </button>
  );
}

export default BackBtn;
