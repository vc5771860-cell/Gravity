import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getActiveClasses } from "@/app/actions/classes";
import Link from "next/link";

export default async function StudentDashboard() {
  const sessionCookie = (await cookies()).get("session")?.value;
  const session = await decrypt(sessionCookie);

  // Fetch Student info
  const student = await prisma.user.findUnique({
    where: { id: session?.userId },
  });

  const activeClasses = await getActiveClasses();

  return (
    <div>
      <h1 style={{ background: 'linear-gradient(90deg, var(--primary-color), var(--success-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Student Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Welcome back, {student?.name || "Student"}! See your upcoming classes, join live sessions, and take quizzes.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3>📹 Live Classes</h3>
          <p>Join a session your teacher has started.</p>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {activeClasses.length > 0 ? (
              activeClasses.map((cls) => (
                <Link key={cls.id} href={`/classroom/${cls.id}`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                  Join "{cls.title}" (Teacher: {cls.teacher.name})
                </Link>
              ))
            ) : (
               <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>No live classes are currently in session.</p>
            )}
          </div>
        </div>
        
        <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3>📝 Pending Quizzes</h3>
          <p>You have 1 quiz to complete.</p>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>Take Quiz</button>
        </div>
        
        <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3>📚 Assignments</h3>
          <p>You have 1 upcoming assignment due.</p>
          <a href="/dashboard/student/assignments" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Assignments</a>
        </div>
      </div>
    </div>
  );
}
