"use client";

import { useActionState } from "react";
import { signup } from "../actions/auth";

export default function Signup() {
  const [state, action, isPending] = useActionState(signup, null);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem 0' }}>
      <div className="card animate-fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create an Account</h2>
        
        {state?.error && (
          <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>
            {state.error}
          </div>
        )}

        <form action={action}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input 
              id="name"
              name="name"
              type="text" 
              className="form-input" 
              required 
            />
          </div>
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
          <div className="form-group">
            <label className="form-label" htmlFor="role">I am a...</label>
            <select 
              id="role"
              name="role"
              className="form-input"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', opacity: isPending ? 0.7 : 1 }}
            disabled={isPending}
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
