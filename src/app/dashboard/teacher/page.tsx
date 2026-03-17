import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createClassSession } from "@/app/actions/classes";

export default async function TeacherDashboard() {
  const sessionCookie = (await cookies()).get("session")?.value;
  const session = await decrypt(sessionCookie);

  // Fetch Teacher info
  const teacher = await prisma.user.findUnique({
    where: { id: session?.userId },
    include: {
      classes: {
        orderBy: { startTime: 'desc' },
        take: 3
      }
    }
  });

  return (
    <div>
      <h1 style={{ background: 'linear-gradient(90deg, var(--success-color), var(--primary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Teacher Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Welcome back, {teacher?.name || "Teacher"}! Manage your classes, quizzes, and assignments here.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3>📹 Start a New Class</h3>
          <p>Create a live WebRTC session for your students.</p>
          <form action={createClassSession} style={{ marginTop: "1rem" }}>
            <div className="form-group" style={{ marginBottom: "0.5rem" }}>
              <input 
                name="title" 
                type="text" 
                placeholder="Topic: Web Development..." 
                className="form-input" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Start Live Class
            </button>
          </form>

          <h4 style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Recent Submissions / Sessions</h4>
          <ul style={{ listStyle: "none", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            {teacher?.classes.map(c => (
              <li key={c.id} style={{ padding: "0.5rem", background: "var(--surface-color-light)", borderRadius: "var(--border-radius)", marginBottom: "0.5rem" }}>
                {c.title} - {new Date(c.startTime).toLocaleDateString()}
              </li>
            ))}
            {teacher?.classes.length === 0 && <li>No previous classes.</li>}
          </ul>
        </div>
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3>📝 Quizzes</h3>
          <p>Create and manage quizzes for your students.</p>
          <a href="/dashboard/teacher/quizzes" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>Manage Quizzes</a>
        </div>
        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3>📚 Assignments</h3>
          <p>Review student submissions and grades.</p>
          <a href="/dashboard/teacher/assignments" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Assignments</a>
        </div>
      </div>
    </div>
  );
}
