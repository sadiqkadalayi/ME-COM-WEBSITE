import React from 'react';


const RegisterPage = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Register Page</h1>
      <p>This is a dummy registration form. Fill in your details to create an account.</p>
      <form style={{ maxWidth: 400, margin: '32px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="text" placeholder="Full Name" style={{ padding: 8, fontSize: 16 }} />
        <input type="email" placeholder="Email" style={{ padding: 8, fontSize: 16 }} />
        <input type="password" placeholder="Password" style={{ padding: 8, fontSize: 16 }} />
        <button type="submit" style={{ padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
