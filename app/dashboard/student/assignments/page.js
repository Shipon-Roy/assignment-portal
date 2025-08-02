"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function StudentAssignments() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({});
  const [selected, setSelected] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then(setAssignments);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const payload = {
      submissionUrl: form[selected._id]?.submissionUrl || "",
      note: form[selected._id]?.note || "",
      assignmentId: selected._id,
      studentId: session.user.id,
    };

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccessMsg("✅ Your assignment has been submitted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setSelected(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">📚 My Assignments</h1>

      {successMsg && (
        <div className="mb-4 bg-green-500/20 text-green-300 border border-green-400 px-4 py-2 rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Assignment Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((a) => (
          <div
            key={a._id}
            onClick={() => setSelected(a)}
            className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:border-blue-500 transition duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-blue-400 mb-2">{a.title}</h2>
            <p className="text-gray-300 line-clamp-2">{a.description}</p>
            <p className="text-sm text-gray-400 mt-3">
              📅 Deadline:{" "}
              <span className="text-red-400 font-medium">
                {new Date(a.deadline).toLocaleDateString()}
              </span>
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(a);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              ✏ Submit
            </button>
          </div>
        ))}
      </div>

      {/* Full Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl relative flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-400">
                {selected.title}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✖
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-300 mb-4">{selected.description}</p>
              <p className="text-sm text-gray-400 mb-6">
                📅 Deadline:{" "}
                <span className="text-red-400 font-medium">
                  {new Date(selected.deadline).toLocaleDateString()}
                </span>
              </p>

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="url"
                  placeholder="Submission URL"
                  value={form[selected._id]?.submissionUrl || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [selected._id]: {
                        ...form[selected._id],
                        submissionUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Note (optional)"
                  value={form[selected._id]?.note || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [selected._id]: {
                        ...form[selected._id],
                        note: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                >
                  🚀 Submit Assignment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
