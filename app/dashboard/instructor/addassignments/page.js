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
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, instructorId: session.user.id }),
    });

    if (res.ok) {
      setForm({ title: "", description: "", deadline: "" });
      setShowModal(false);
      setSuccessMsg("✅ Assignment created successfully!");
      fetchAssignments();
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    const res = await fetch(`/api/assignments/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSuccessMsg("🗑️ Assignment deleted successfully!");
      fetchAssignments();
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  if (!session || session.user.role !== "INSTRUCTOR") {
    return <p className="p-6">You are not authorized to view this page.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ➕ Add Assignment
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 bg-green-500/20 border border-green-400 text-green-300 px-4 py-2 rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              Create New Assignment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-300"
              >
                ✅ Create Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assignment List */}
      <h2 className="text-lg font-semibold mb-3">Existing Assignments</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-400">No assignments created yet.</p>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 hover:border-blue-500 transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold text-blue-400">{a.title}</h3>
                <p className="text-gray-300">{a.description}</p>
                <p className="text-sm text-gray-400 mt-1">
                  📅 Deadline:{" "}
                  <span className="text-red-400 font-medium">
                    {new Date(a.deadline).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(a._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-semibold transition"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
