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
    return <p className="p-6">Please log in to view submissions.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s._id} className="bg-gray-700 p-4 rounded shadow">
              <h2 className="font-semibold">{s.assignmentId.title}</h2>
              <p>
                Status: <span className="font-medium">{s.status}</span>
              </p>
              {s.feedback && (
                <p className="text-sm text-gray-300">Feedback: {s.feedback}</p>
              )}
              <a
                href={s.submissionUrl}
                target="_blank"
                className="text-blue-500 underline"
              >
                View Submission
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
