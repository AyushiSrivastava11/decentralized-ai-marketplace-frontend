// components/admin/RejectModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RejectModal({ onCancel, onConfirm }: { onCancel: () => void, onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-2">Reject Worker</h2>
        <p className="mb-4 text-sm">Please provide a reason for rejection:</p>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onConfirm(reason)}>Confirm Reject</Button>
        </div>
      </div>
    </div>
  );
}
