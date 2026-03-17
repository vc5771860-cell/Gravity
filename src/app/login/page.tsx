"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";

export default function Login() {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="card animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        
        {state?.error && (
          <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>
            {state.error}
          </div>
        )}

        <form action={action}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              className="form-input" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              className="form-input" 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', opacity: isPending ? 0.7 : 1 }}
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
