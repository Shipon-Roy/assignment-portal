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

  const fetchSubmissions = () => {
    fetch("/api/submissions")
      .then((res) => res.json())
      .then((subs) => {
        // Count statuses for chart
        const counts = { PENDING: 0, ACCEPTED: 0, REJECTED: 0 };
        subs.forEach((s) => counts[s.status]++);
        setData(
          Object.entries(counts).map(([status, count]) => ({ status, count }))
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
  };

  // Filter + Search + Sort
  const filteredSubs = submissions
    .filter((s) => (filter === "ALL" ? true : s.status === filter))
    .filter(
      (s) =>
        s.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
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
          placeholder="Search by student or assignment"
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
                <th className="px-4 py-2 border">Feedback</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((s, idx) => (
                <tr
                  key={s._id}
                  className={idx % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}
                >
                  <td className="px-4 py-2 border">{s.studentId?.name}</td>
                  <td className="px-4 py-2 border">{s.assignmentId?.title}</td>
                  <td className="px-4 py-2 border">{s.status}</td>
                  <td className="px-4 py-2 border">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <textarea
                      defaultValue={s.feedback || ""}
                      onBlur={(e) =>
                        updateSubmission(s._id, s.status, e.target.value)
                      }
                      className="border p-1 rounded w-full text-sm text-white"
                      placeholder="Add feedback..."
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={s.status}
                      onChange={(e) =>
                        updateSubmission(s._id, e.target.value, s.feedback)
                      }
                      className="p-1 border rounded text-white"
                      disabled={loading}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
