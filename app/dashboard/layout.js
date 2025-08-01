"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();

  if (!session) return <p className="p-6 text-white">Loading...</p>;

  const menus =
    session.user.role === "INSTRUCTOR"
      ? [
          {
            name: "📊 All Assignments",
            path: "/dashboard/instructor/allassignments",
          },
          {
            name: "📄 Add Assignments",
            path: "/dashboard/instructor/addassignments",
          },
        ]
      : [
          {
            name: "📚 View Assignments",
            path: "/dashboard/student/assignments",
          },
          {
            name: "📝 My Submissions",
            path: "/dashboard/student/submissions",
          },
        ];

  // Home path based on role
  const homePath =
    session.user.role === "INSTRUCTOR"
      ? "/dashboard/instructor"
      : "/dashboard/student";

  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-4 flex flex-col justify-between">
        <div>
          {/* User Info (clickable) */}
          <Link
            href={homePath}
            className="mb-6 block border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-lg font-bold">{session.user.name}</h2>
            <p className="text-sm text-gray-400">{session.user.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-700 rounded">
              {session.user.role}
            </span>
          </Link>

          {/* Menu */}
          <nav className="space-y-2">
            {menus.map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="block px-3 py-2 rounded hover:bg-gray-700"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-800 text-white p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
