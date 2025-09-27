"use client";
import React, { useEffect, useState, useMemo } from "react";
import { FaUsers, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useUserData from "@/lib/db/userData";

interface Application {
  id: number;
  job_id: number;
  job_title: string;
  job_location: string;
  job_description: string;
  user_id: number;
  applied_at: string | null;
  status: string;
  username: string;
  email: string;
}

interface Details {
  qualifications: any[];
  experiences: any[];
}

const Applications: React.FC = () => {
  const { userData } = useUserData();
  const role = userData?.role ?? "";

  // Unconditional hooks
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [details, setDetails] = useState<Details | null>(null);

  const perPage = 10;

  // Fetch all applications on mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch applications");
        setAllApplications(data.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Filter applications based on role and selected job
  useEffect(() => {
    let apps = [...allApplications];

    if (role === "hr") {
      apps = apps.filter((a) => ["pending", "shortlisted"].includes(a.status));
    }

    if (selectedJob !== "all") {
      apps = apps.filter((a) => a.job_title === selectedJob);
    }

    setApplications(apps);
    setPage(1); // Reset page when filtering
  }, [allApplications, selectedJob, role]);

  const updateStatus = async (id: number, status: "shortlisted" | "rejected") => {
    if (status === "rejected" && !confirm("Are you sure you want to reject this application?")) return;

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update status");

      setAllApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const fetchDetails = async (userId: number) => {
    try {
      const res = await fetch(`/api/applications/details/${userId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch details");
      setDetails(data.data);
      setSelectedApp(allApplications.find((a) => a.user_id === userId) || null);
    } catch (err: any) {
      alert(err.message || "Failed to load details");
    }
  };

  // Job filter options
  const jobOptions = useMemo(() => {
    const titles = Array.from(new Set(allApplications.map((a) => a.job_title)));
    return titles.sort();
  }, [allApplications]);

  // Pagination
  const totalPages = Math.ceil(applications.length / perPage);
  const paginatedApplications = applications.slice((page - 1) * perPage, page * perPage);

  // Counts
  const counts = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.status === "pending").length,
      shortlisted: applications.filter((a) => a.status === "shortlisted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }),
    [applications]
  );

  return (
    <>
      {role !== "hr" && role !== "admin" ? (
        <div className="p-4 text-center text-red-600 font-bold">
          Access Denied. This page is accessible to HR and Admin only.
        </div>
      ) : (
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
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Job</th>
                  <th className="border p-2 text-left">User</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Applied At</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedApplications.length > 0 ? (
                  paginatedApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="border p-2">{app.id}</td>
                      <td className="border p-2">{app.job_title}</td>
                      <td className="border p-2">{app.username}</td>
                      <td className="border p-2">{app.email}</td>
                      <td className="border p-2">
                        {app.applied_at ? new Date(app.applied_at).toLocaleString() : "—"}
                      </td>
                      <td className="border p-2 capitalize">{app.status}</td>
                      <td className="border p-2 space-x-2">
                        {role === "hr" && app.status === "pending" && (
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
                        )}

                        {(role === "hr" || role === "admin") && (
                          <button
                            onClick={() => fetchDetails(app.user_id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500 border">
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
              className={`px-3 py-1 rounded border ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1 rounded border ${page === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>

          {/* Details Popup */}
          {selectedApp && details && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  {selectedApp.username} - {selectedApp.job_title}
                </h2>

                <h3 className="font-semibold mt-4">Qualifications</h3>
                <table className="w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Degree</th>
                      <th className="p-2 border">Specialization</th>
                      <th className="p-2 border">CGPA</th>
                      <th className="p-2 border">Year</th>
                      <th className="p-2 border">Institute</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.qualifications.map((q, i) => (
                      <tr key={i}>
                        <td className="p-2 border">{q.degree}</td>
                        <td className="p-2 border">{q.speciallization}</td>
                        <td className="p-2 border">{q.cgpa}</td>
                        <td className="p-2 border">{q.passing_year}</td>
                        <td className="p-2 border">{q.institute}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="font-semibold mt-4">Experience</h3>
                <table className="w-full border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Designation</th>
                      <th className="p-2 border">Organization</th>
                      <th className="p-2 border">From</th>
                      <th className="p-2 border">To</th>
                      <th className="p-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.experiences.map((e, i) => (
                      <tr key={i}>
                        <td className="p-2 border">{e.designation}</td>
                        <td className="p-2 border">{e.organization}</td>
                        <td className="p-2 border">{e.from_date}</td>
                        <td className="p-2 border">{e.to_date}</td>
                        <td className="p-2 border">{e.total_experience}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => {
                      setSelectedApp(null);
                      setDetails(null);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Applications;
