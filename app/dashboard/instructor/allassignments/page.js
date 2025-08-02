"use client";
import { useEffect, useState } from "react";
import StatusChart from "@/components/StatusChart";

export default function InstructorDashboard() {
  const [data, setData] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selected, setSelected] = useState(null);

  const fetchSubmissions = () => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then((subs) => {
        const counts = { PENDING: 0, ACCEPTED: 0, REJECTED: 0 };
        subs.forEach((s) => counts[s.status]++);
        setData(
          Object.entries(counts).map(([status, count]) => ({
            status,
            count,
          }))
        );
        setSubmissions(subs);
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateSubmission = async (id, status, feedback) => {
    setLoading(true);
    await fetch(`/api/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback }),
    });
    fetchSubmissions();
    setLoading(false);
    setSelected(null);
  };

  const filteredSubs = submissions
    .filter((s) => (filter === "ALL" ? true : s.status === filter))
    .filter(
      (s) =>
        s.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId?._id?.toLowerCase().includes(search.toLowerCase()) ||
        s.assignmentId?.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <div className="p-6">
      {/* Chart */}
      <div className="mb-8">
        <StatusChart data={data} />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded text-white bg-gray-700"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by name, ID, or assignment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded text-white bg-gray-700"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Table */}
      {filteredSubs.length === 0 ? (
        <p>No submissions match your criteria.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded shadow">
          <table className="min-w-full border border-gray-200 text-white">
            <thead className="bg-gray-900 sticky top-0">
              <tr>
                <th className="px-4 py-2 border">Student</th>
                <th className="px-4 py-2 border">Assignment</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Submitted At</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((s, idx) => (
                <tr
                  key={s._id}
                  className={`cursor-pointer ${
                    idx % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
                  }`}
                  onClick={() => setSelected(s)}
                >
                  <td className="px-4 py-2 border">
                    {s.studentId?.name}
                    <span className="text-xs text-gray-400 block">
                      ID: {s.studentId?._id}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">{s.assignmentId?.title}</td>
                  <td className="px-4 py-2 border">{s.status}</td>
                  <td className="px-4 py-2 border">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-blue-400 underline">
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white">
                Review Submission
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✖
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <p>
                <span className="font-semibold">Student:</span>{" "}
                {selected.studentId?.name}
                <span className="text-sm text-gray-400 ml-2">
                  (ID: {selected.studentId?._id})
                </span>
              </p>
              <p>
                <span className="font-semibold">Assignment:</span>{" "}
                {selected.assignmentId?.title}
              </p>
              <p className="text-gray-300">
                {selected.assignmentId?.description}
              </p>
              <p>
                <span className="font-semibold">Submitted At:</span>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Submission URL:</span>{" "}
                <a
                  href={selected.submissionUrl}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  Open Link
                </a>
              </p>
              {selected.note && (
                <p>
                  <span className="font-semibold">Student Note:</span>{" "}
                  {selected.note}
                </p>
              )}

              {/* Status & Feedback */}
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setSelected({ ...selected, status: e.target.value })
                  }
                  className="p-2 border rounded text-white bg-gray-800"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Feedback</label>
                <textarea
                  value={selected.feedback || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, feedback: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  rows="3"
                  placeholder="Add feedback..."
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-700 p-4">
              <button
                onClick={() =>
                  updateSubmission(
                    selected._id,
                    selected.status,
                    selected.feedback
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
