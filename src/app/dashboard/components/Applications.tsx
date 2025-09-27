"use client";

import { useEffect, useState } from "react";

type ApplicationData = {
  application_id: number;
  status: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  profile: {
    id: number;
    fname: string | null;
    lname: string | null;
    phone: string | null;
    designation: string | null;
  } | null;
};

export default function Applications({ jobId }: { jobId?: number }) {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch applications (job-specific if HR, all if admin)
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const url = jobId
        ? `/api/applications/job/${jobId}`
        : `/api/applications`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update status (shortlist/reject)
  const updateStatus = async (id: number, status: "shortlisted" | "rejected") => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.application_id === id ? { ...app, status } : app
          )
        );
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {jobId ? "Job Applications" : "All Applications"}
      </h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Designation</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.application_id}>
                <td className="border px-3 py-2">
                  {app.profile
                    ? `${app.profile.fname ?? ""} ${app.profile.lname ?? ""}`
                    : app.user.username}
                </td>
                <td className="border px-3 py-2">{app.user.email}</td>
                <td className="border px-3 py-2">
                  {app.profile?.phone ?? "N/A"}
                </td>
                <td className="border px-3 py-2">
                  {app.profile?.designation ?? "N/A"}
                </td>
                <td className="border px-3 py-2">{app.status}</td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => updateStatus(app.application_id, "shortlisted")}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    ✅ Shortlist
                  </button>
                  <button
                    onClick={() => updateStatus(app.application_id, "rejected")}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
