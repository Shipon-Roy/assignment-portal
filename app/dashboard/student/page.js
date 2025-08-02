"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentHome() {
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

  const mySubmissions = submissions.filter(
    (s) => s.studentId?._id === session.user.id
  );
  const acceptedCount = mySubmissions.filter(
    (s) => s.status === "ACCEPTED"
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {session.user.name} 🎓
        </h1>
        <p className="text-gray-400">Role: {session.user.role}</p>
        <p className="text-gray-400">Email: {session.user.email}</p>
        <p className="text-gray-400">
          Student ID: <span className="font-mono">{session.user.id}</span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">Available Assignments</h2>
          <p className="text-3xl font-bold">{assignments.length}</p>
        </div>
        <div className="bg-purple-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">My Submissions</h2>
          <p className="text-3xl font-bold">{mySubmissions.length}</p>
        </div>
        <div className="bg-green-500 p-4 rounded-lg shadow text-white">
          <h2 className="text-lg">Accepted</h2>
          <p className="text-3xl font-bold">{acceptedCount}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/student/assignments"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            📚 View Assignments
          </Link>
          <Link
            href="/dashboard/student/submissions"
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            📝 My Submissions
          </Link>
        </div>
      </div>
    </div>
  );
}
