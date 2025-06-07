// Types
export interface Agent {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface AgentInput {
  name: string;
  description: string;
  files: File[];
}

export interface RunAgentInput {
  input: string;
}

export interface RunAgentOutput {
  output: string;
  status: 'success' | 'error';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API Functions
export async function getAllAgents(): Promise<Agent[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/get-approved-workers`);
  if (!response.ok) throw new Error('Failed to fetch agents');
  return response.json();
}

export async function getAgentById(id: string): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/get-aiworker/${id}`);
  if (!response.ok) throw new Error('Failed to fetch agent');
  return response.json();
}

export async function runAgent(id: string, input: RunAgentInput): Promise<RunAgentOutput> {
  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/run/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error('Failed to run agent');
  return response.json();
}

export async function uploadAgent(data: AgentInput): Promise<Agent> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  data.files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload agent');
  return response.json();
} 