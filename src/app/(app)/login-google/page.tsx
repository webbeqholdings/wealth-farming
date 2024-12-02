'use client'

import React from 'react';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Trigger the redirect to the server-side API route
    window.location.href = '/api/auth/login-google'; // This will hit the route handler above
  };

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
