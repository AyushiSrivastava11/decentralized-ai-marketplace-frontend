"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AdminAIWorker,
  getPendingWorkers,
  approveWorker,
  rejectWorker,
} from "@/services/admin-api";
import RejectModal from "./RejectModal";

export default function PendingWorkers() {
  const [workers, setWorkers] = useState<AdminAIWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const fetchPendingWorkers = async () => {
    try {
      const response = await getPendingWorkers();
      setWorkers(response);
    } catch (err: any) {
      console.error("Error loading pending workers", err);
      setError(err?.message || "Failed to load pending workers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWorkers();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveWorker(id);
      setWorkers((prev) => prev.filter((w) => w.id !== id));
    } catch (err: any) {
      console.error("Approve failed:", err);
      setError("Failed to approve worker.");
    }
  };

  const handleReject = (id: string) => {
    setSelectedWorkerId(id);
  };

  const confirmReject = async (reason: string) => {
    if (!selectedWorkerId) return;

    try {
      await rejectWorker(selectedWorkerId, reason);
      setWorkers((prev) => prev.filter((w) => w.id !== selectedWorkerId));
    } catch (err: any) {
      console.error("Reject failed:", err);
      setError("Failed to reject worker.");
    } finally {
      setSelectedWorkerId(null); // close modal
    }
  };

  if (loading) return <p>Loading pending workers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Workers</h2>

      {workers.length === 0 ? (
        <p className="text-gray-500">No pending workers found.</p>
      ) : (
        <ul className="space-y-4">
          {workers?.map((worker) => (
            <li
              key={worker.id}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div>
                <h3 className="font-semibold">{worker.name}</h3>
                <p className="text-sm">{worker.description}</p>
                <p className="text-xs text-gray-500">Status: {worker.status}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => handleApprove(worker.id)}>
                  ✔️ Approve
                </Button>
                <Button variant="destructive" onClick={() => handleReject(worker.id)}>
                  🗑️ Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedWorkerId && (
        <RejectModal
          onCancel={() => setSelectedWorkerId(null)}
          onConfirm={confirmReject}
        />
      )}
    </div>
  );
}
