"use client";

import { getAllAIWorkers } from "@/services/admin-api";
import { useEffect, useState } from "react";

interface AIWorker {
  id: string;
  name: string;
  description: string;
  status: string;
}

export default function AIWorkers() {
  const [workers, setWorkers] = useState<AIWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(workers)

   useEffect(() => {
      const fetchWorkers = async () => {
        try {
          const response = await getAllAIWorkers();
         setWorkers(response);
        } catch (err: any) {
          console.error("Error fetching users", err);
          setError("Failed to load users.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchWorkers();
    }, []);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">AI Workers</h2>

      {loading ? (
        <p>Loading AI workers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : workers.length === 0 ? (
        <p className="text-gray-500">No AI workers found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white dark:bg-gray-950">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{worker.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{worker.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        worker.status === "APPROVED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : worker.status === "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {worker.status.toUpperCase()}
                    </span>
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
