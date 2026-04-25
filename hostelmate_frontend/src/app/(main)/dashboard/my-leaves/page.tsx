"use client";

import { useEffect, useState } from "react";

type Leave = {
  id: number;
  hostel_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  destination: string;
  parent_contact: string;
  contact_number: string;
  status: string;
  warden_comment?: string;
  created_at: string;
};

export default function MyLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/my-leaves`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        My Leave Applications
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border hover:shadow-xl transition"
              >

                {/* 🏨 HOSTEL NAME */}
                <div className="text-center mb-4">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {leave.hostel_name}
                  </p>
                </div>

                {/* 🎯 TYPE + STATUS */}
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {leave.leave_type}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      leave.status === "approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : leave.status === "rejected"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                {/* 📅 DATE BOX */}
                <div className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">From</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {new Date(leave.start_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">To</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* 📄 DETAILS */}
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Reason:</span>{" "}
                    {leave.reason}
                  </p>

                  <p>
                    <span className="text-gray-500">Destination:</span>{" "}
                    {leave.destination}
                  </p>

                  <p>
                    <span className="text-gray-500">Parent Contact:</span>{" "}
                    {leave.parent_contact}
                  </p>

                  <p>
                    <span className="text-gray-500">Your Contact:</span>{" "}
                    {leave.contact_number}
                  </p>
                </div>

                {/* ❌ REJECT REASON */}
                {leave.status === "rejected" && leave.warden_comment && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm">
                    <strong>Rejected Reason:</strong> {leave.warden_comment}
                  </div>
                )}

                {/* FOOTER */}
                <div className="mt-4 pt-3 border-t text-xs text-gray-400">
                  Applied on:{" "}
                  {new Date(leave.created_at).toLocaleString()}
                </div>

              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-500">
              No leave applications found
            </p>
          )}

        </div>
      )}
    </div>
  );
}