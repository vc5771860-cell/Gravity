export default function Home() {
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Learn & Teach in Real-Time
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        DevLearn is the ultimate platform for educators offering interactive video classes, live quizzes, leadboards, and assignment management.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
        <div className="card">
          <h3>📹 Live Video Classes</h3>
          <p>Host many-to-many communication using low latency WebRTC.</p>
        </div>
        <div className="card">
          <h3>📝 Interactive Quizzes</h3>
          <p>Challenge students with real-time quizzes and display live leaderboards.</p>
        </div>
        <div className="card">
          <h3>📚 Manage Assignments</h3>
          <p>Easily distribute assignments, collect submissions, and track grades.</p>
        </div>
      </div>
    </div>
  );
}
