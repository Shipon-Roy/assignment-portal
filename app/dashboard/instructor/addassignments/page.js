"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function InstructorAssignmentsPage() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then(setAssignments);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, instructorId: session.user.id }),
    });
    setForm({ title: "", description: "", deadline: "" });
    const updated = await fetch("/api/assignments").then((res) => res.json());
    setAssignments(updated);
  };

  if (!session || session.user.role !== "INSTRUCTOR") {
    return <p className="p-6">You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Assignments</h1>

      {/* Assignment creation form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Assignment
        </button>
      </form>

      {/* List of assignments */}
      <h2 className="text-lg font-semibold mb-2">Existing Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments created yet.</p>
      ) : (
        assignments.map((a) => (
          <div key={a._id} className="bg-gray-700 p-4 rounded shadow mb-3">
            <h3 className="font-bold">{a.title}</h3>
            <p>{a.description}</p>
            <p className="text-sm text-gray-400">
              Deadline: {new Date(a.deadline).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
