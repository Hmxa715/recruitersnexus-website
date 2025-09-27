"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useUserData from "@/lib/db/userData"; // assuming this already returns user info

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  job_location: string;
  job_description: string;
  user_id: number;
  applied_at: string;
  status: string;
  username: string;
  email: string;
}

const Applications: React.FC = () => {
  const { userData } = useUserData(); // directly get user info
  const role = userData?.role ?? "admin"; // fallback to admin if role not found

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/applications");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.data);
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Update status
  const updateStatus = async (id: number, status: "shortlisted" | "rejected") => {
    if (
      status === "rejected" &&
      !confirm("Are you sure you want to reject this application?")
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update status");

      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  // Job filter options
  const jobOptions = useMemo(() => {
    const titles = Array.from(new Set(applications.map((a) => a.job_title)));
    return titles.sort();
  }, [applications]);

  // Apply filters
  const filteredApplications = useMemo(() => {
    let apps = [...applications];
    if (role === "hr") {
      apps = apps.filter((a) => a.status !== "rejected");
    }
    if (selectedJob !== "all") {
      apps = apps.filter((a) => a.job_title === selectedJob);
    }
    return apps;
  }, [applications, role, selectedJob]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / perPage);
  const paginatedApplications = filteredApplications.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Counts
  const counts = useMemo(() => {
    return {
      total: filteredApplications.length,
      pending: filteredApplications.filter((a) => a.status === "pending").length,
      shortlisted: filteredApplications.filter((a) => a.status === "shortlisted").length,
      rejected: filteredApplications.filter((a) => a.status === "rejected").length,
    };
  }, [filteredApplications]);

  // Skeleton rows
  const skeletonRows = Array.from({ length: perPage }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: role === "hr" ? 7 : 6 }).map((_, j) => (
        <td key={j} className="p-2 border border-gray-300 bg-gray-200">&nbsp;</td>
      ))}
    </tr>
  ));

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Applications</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FaUsers size={28} />
          <div>
            <p className="text-sm">Total</p>
            <p className="text-xl font-bold">{counts.total}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FaClock size={28} />
          <div>
            <p className="text-sm">Pending</p>
            <p className="text-xl font-bold">{counts.pending}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-md">
          <FaCheckCircle size={28} />
          <div>
            <p className="text-sm">Shortlisted</p>
            <p className="text-xl font-bold">{counts.shortlisted}</p>
          </div>
        </div>
        {role === "admin" && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-md">
            <FaTimesCircle size={28} />
            <div>
              <p className="text-sm">Rejected</p>
              <p className="text-xl font-bold">{counts.rejected}</p>
            </div>
          </div>
        )}
      </div>

      {/* Job filter */}
      {jobOptions.length > 0 && (
        <div>
          <label className="text-sm font-medium mr-2">Filter by Job:</label>
          <select
            className="border px-2 py-1 rounded"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {jobOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ID</th>
              <th className="border border-gray-300 p-2 text-left">Job</th>
              <th className="border border-gray-300 p-2 text-left">User</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Applied At</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              {role === "hr" && (
                <th className="border border-gray-300 p-2 text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? skeletonRows
              : paginatedApplications.length > 0
              ? paginatedApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{app.id}</td>
                    <td className="border border-gray-300 p-2">{app.job_title}</td>
                    <td className="border border-gray-300 p-2">{app.username}</td>
                    <td className="border border-gray-300 p-2">{app.email}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(app.applied_at).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2 capitalize">
                      {app.status}
                    </td>
                    {role === "hr" && (
                      <td className="border border-gray-300 p-2 space-x-2">
                        {app.status === "pending" ? (
                          <>
                            <button
                              onClick={() => updateStatus(app.id, "shortlisted")}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, "rejected")}
                              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td
                      colSpan={role === "hr" ? 7 : 6}
                      className="text-center p-4 text-gray-500 border border-gray-300"
                    >
                      No applications found
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 rounded border ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded border ${
            page === totalPages || totalPages === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Applications;