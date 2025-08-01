"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function InstructorHome() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then(setAssignments);
    fetch("/api/submissions")
      .then((res) => res.json())
      .then(setSubmissions);
  }, []);

  if (!session) return <p className="text-white">Loading...</p>;

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {session.user.name} 👋
        </h1>
        <p className="text-gray-400">Role: {session.user.role}</p>
        <p className="text-gray-400">Email: {session.user.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">Total Assignments</h2>
          <p className="text-3xl font-bold">{assignments.length}</p>
        </div>
        <div className="bg-green-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">Total Submissions</h2>
          <p className="text-3xl font-bold">{submissions.length}</p>
        </div>
        <div className="bg-yellow-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">Pending Reviews</h2>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/instructor/addassignments"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            ➕ Add Assignment
          </Link>
          <Link
            href="/dashboard/instructor/allassignments"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            📋 View All Assignments
          </Link>
          <Link
            href="/dashboard/instructor"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            📊 Review Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
