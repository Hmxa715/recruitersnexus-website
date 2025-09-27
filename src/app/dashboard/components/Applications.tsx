"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type Application = {
  id: number;
  user_id: string;
  job_id: number;
  applied_at: string;
  status: string | null;
  user?: {
    username: string;
    email: string;
  };
};

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // update status handler
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
          status === "rejected"
            ? prev.filter((app) => app.id !== id) // remove from view
            : prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <p className="p-4">Loading applications...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Candidate</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Job ID</th>
                <th className="px-4 py-3 text-left">Applied At</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="px-4 py-3">{app.user?.username || "N/A"}</td>
                  <td className="px-4 py-3">{app.user?.email}</td>
                  <td className="px-4 py-3">{app.job_id}</td>
                  <td className="px-4 py-3">
                    {new Date(app.applied_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {app.status || "Pending"}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(app.id, "shortlisted")}
                      disabled={app.status === "shortlisted"}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      <Check size={16} /> Shortlist
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <X size={16} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
