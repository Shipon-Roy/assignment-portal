"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function StudentAssignments() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    submissionUrl: "",
    note: "",
    assignmentId: "",
  });

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then(setAssignments);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, studentId: session.user.id }),
    });
    alert("Submitted!");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assignments</h1>
      {assignments.map((a) => (
        <div key={a._id} className="bg-gray-700 p-4 rounded shadow mb-4">
          <h2 className="font-bold">{a.title}</h2>
          <p>{a.description}</p>
          <p className="text-sm text-gray-500">
            Deadline: {new Date(a.deadline).toLocaleDateString()}
          </p>
          <form onSubmit={handleSubmit} className="mt-2 space-y-2">
            <input type="hidden" value={a._id} onChange={() => {}} />
            <input
              name="submissionUrl"
              placeholder="Submission URL"
              onChange={(e) =>
                setForm({
                  ...form,
                  submissionUrl: e.target.value,
                  assignmentId: a._id,
                })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              name="note"
              placeholder="Note"
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full p-2 border rounded"
            ></textarea>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
