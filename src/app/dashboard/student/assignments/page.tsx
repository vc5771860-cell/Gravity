"use client";

import { useState } from "react";

export default function SubmitAssignment() {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Prisma API route
    console.log("Submitting assignment:", { content });
    alert("Assignment submitted successfully!");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div className="card animate-fade-in" style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "var(--primary-color)" }}>Assignment: Build a React App</h2>
        <p style={{ color: "var(--text-secondary)" }}>Due: Tomorrow at 11:59 PM</p>
        <p style={{ marginTop: "1rem" }}>
          Please submit a link to your GitHub repository containing the React application. 
          Make sure the README contains instructions to run the project locally.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h3>Your Submission</h3>
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label className="form-label" htmlFor="content">Repository Link or Notes</label>
          <textarea 
            id="content" 
            className="form-input" 
            rows={5}
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="https://github.com/..."
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Submit Work
        </button>
      </form>
    </div>
  );
}
