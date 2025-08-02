"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function StudentSubmissionsPage() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/submissions")
        .then((res) => res.json())
        .then((data) => {
          const mySubs = data.filter(
            (s) => s.studentId._id === session.user.id
          );
          setSubmissions(mySubs);
        });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="p-6 text-white">Please log in to view submissions.</div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/20 text-green-400 border-green-400";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">📝 My Submissions</h1>

      {submissions.length === 0 ? (
        <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow text-center">
          You have not submitted any assignments yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((s) => (
            <div
              key={s._id}
              className="bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              {/* Title */}
              <h2 className="text-xl font-semibold text-blue-400 mb-2">
                {s.assignmentId.title}
              </h2>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border w-fit ${getStatusColor(
                  s.status
                )}`}
              >
                {s.status}
              </span>

              {/* Feedback */}
              {s.feedback && (
                <p className="text-gray-300 mt-3 text-sm">
                  💬 <span className="italic">{s.feedback}</span>
                </p>
              )}

              {/* View Submission */}
              <a
                href={s.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                🔗 View Submission
              </a>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-2">
                Submitted on {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
