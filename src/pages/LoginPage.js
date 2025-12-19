import React from 'react';


const LoginPage = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Login Page</h1>
      <p>This is a dummy login form. Enter your credentials to sign in.</p>
      <form style={{ maxWidth: 400, margin: '32px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="text" placeholder="Username or Email" style={{ padding: 8, fontSize: 16 }} />
        <input type="password" placeholder="Password" style={{ padding: 8, fontSize: 16 }} />
        <button type="submit" style={{ padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
