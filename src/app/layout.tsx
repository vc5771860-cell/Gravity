import type { Metadata } from "next";
import "./globals.css";
import { logout } from "@/app/actions/auth";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevLearn - Premium Teaching Platform",
  description: "Interactive online classes, quizzes, and assignments.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionCookie = (await cookies()).get("session")?.value;
  const session = await decrypt(sessionCookie);

  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="navbar" style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>DevLearn</Link>
          </h2>
          <div>
            {session?.userId ? (
              <form action={logout} style={{ display: "inline" }}>
                 <Link 
                   href={session.role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student"} 
                   className="btn btn-primary" 
                   style={{ marginRight: '1rem' }}
                 >
                   Dashboard
                 </Link>
                 <button type="submit" className="btn btn-secondary">Logout</button>
              </form>
            ) : (
              <>
                <Link href="/login" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Login</Link>
                <Link href="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <main className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
