import { cookies } from "next/headers";

// Types
export type WorkerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminAIWorker {
  id: string;
  name: string;
  description: string;
  tags: string[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  filePath: string;
  developerId: string;
  pricePerRun: number;
  status: WorkerStatus;
  rejectionReason?: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isDeveloper: boolean;
  role: 'USER' | 'ADMIN';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all pending AI Workers
export async function getPendingWorkers(): Promise<AdminAIWorker[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/get-pending-workers`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  console.log(response);
  if (!response.ok) throw new Error('Failed to fetch pending workers');

  return await response.json();
}

// Approve an AI Worker
export async function approveWorker(id: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/approve-worker/${id}`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to approve worker');
  }

  return await response.json();
}

// Reject an AI Worker with reason
export async function rejectWorker(id: string, reason: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/reject-worker/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reject worker');
  }

  return await response.json();
}

// Fetch all users
export async function getAllUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/get-all-users`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Failed to fetch users');

  return await response.json();
}

// Fetch all AI Workers for admin
export async function getAllAIWorkers(): Promise<AdminAIWorker[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/get-all-aiworkers`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error('Failed to fetch AI Workers');
  }

  return data.allAIWorkers as AdminAIWorker[];
}

// Fetch a specific AI Worker by ID
export async function getAIWorkerById(id: string): Promise<AdminAIWorker> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/get-aiworkers/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error('Failed to fetch AI Worker');
  }

  return data.aiWorker as AdminAIWorker;
}
