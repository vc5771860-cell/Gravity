"use client";

import { useState } from "react";

export default function CreateAssignment() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Prisma API route
    console.log("Saving assignment:", { title, description, dueDate });
    alert("Assignment saved locally!");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "2rem" }}>Create New Assignment</h2>
      <form onSubmit={handleSaveAssignment} className="card animate-fade-in">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Assignment Title</label>
          <input 
            id="title" 
            type="text" 
            className="form-input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="desc">Description</label>
          <textarea 
            id="desc" 
            className="form-input" 
            rows={5}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dueDate">Due Date</label>
          <input 
            id="dueDate" 
            type="datetime-local" 
            className="form-input" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Publish Assignment
        </button>
      </form>
    </div>
  );
}
