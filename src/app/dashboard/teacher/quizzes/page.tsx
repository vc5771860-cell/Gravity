"use client";

import { useState } from "react";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctOption: 0 }]);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Prisma API route
    console.log("Saving quiz:", { title, questions });
    alert("Quiz saved locally!");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "2rem" }}>Create a New Quiz</h2>
      <form onSubmit={handleSaveQuiz} className="card animate-fade-in">
        <div className="form-group">
          <label className="form-label" htmlFor="quizTitle">Quiz Title</label>
          <input 
            id="quizTitle" 
            type="text" 
            className="form-input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <hr style={{ margin: "2rem 0", borderColor: "var(--border-color)" }} />

        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "var(--surface-color-light)", borderRadius: "var(--border-radius)" }}>
            <h4>Question {index + 1}</h4>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Question Text" 
                className="form-input" 
                value={q.text} 
                onChange={(e) => {
                  const newQ = [...questions];
                  newQ[index].text = e.target.value;
                  setQuestions(newQ);
                }}
                required 
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {q.options.map((opt, optIndex) => (
                <input 
                  key={optIndex}
                  type="text" 
                  placeholder={`Option ${optIndex + 1}`} 
                  className="form-input" 
                  value={opt} 
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[index].options[optIndex] = e.target.value;
                    setQuestions(newQ);
                  }}
                  required 
                />
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Correct Option (1-4)</label>
              <select 
                className="form-input"
                value={q.correctOption}
                onChange={(e) => {
                  const newQ = [...questions];
                  newQ[index].correctOption = parseInt(e.target.value);
                  setQuestions(newQ);
                }}
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary" onClick={handleAddQuestion} style={{ marginRight: "1rem" }}>
          Add Question
        </button>
        <button type="submit" className="btn btn-primary">
          Save Quiz
        </button>
      </form>
    </div>
  );
}
