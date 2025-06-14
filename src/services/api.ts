
import { cookies } from "next/headers";

// Types
export interface Agent {
  id: string;
  name: string;
  description: string;
  tags: string[];
  inputSchema: Record<string, unknown>; // or a specific interface if you know the shape
  outputSchema: Record<string, unknown>; // or a specific interface if you know the shape
  pricePerRun: number;
  isPublic: boolean;
  filePath: string;
  createdAt: string; // ISO date string from API
  updatedAt: string;
  developerId: string;
  developer: {
    id: string;
    email?: string;
    name?: string;
    // Add more if your API returns extra developer fields
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // assuming these enum values
  rejectionReason?: string | null;
}

export interface AgentInput {
  name: string;
  description: string;
  tags: string;
  inputSchema: string;
  outputSchema: string;
  pricePerRun: number;
  file: File;
}

// export interface RunAgentInput {
//   input: string;
// }

export interface RunAgentOutput {
  output: string;
  status: 'success' | 'error';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API Functions
// export async function getAllAgents(): Promise<Agent[]> {
//   try{
//   const cookieStore = await cookies();
//   const token = cookieStore.get('token')?.value;
//   // console.log('Fetching approved agents from:', `${API_BASE_URL}/api/v1/aiworker/get-approved-workers`);
//   const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/get-approved-workers`,
//     {method: 'GET',
//       headers: {
//         'Cookie': `token=${token}`,
//         // 'Authorization': `bearer ${token}`
//       },
//       cache: 'no-store', // Ensure fresh data
//     }
//   );
//   // console.log('Response status:', response.status);
//   // console.log('Get all agents response:', response);
//   // if (!response.ok) throw new Error('Failed to fetch agents');

//   const data = await response.json();
//   return data.aiApprovedWorkers as Agent[];
// } catch (error) {
//   console.error('Error fetching agents:', error);
//   throw error; // Re-throw to handle it in the calling function
//   }
// }



export async function getAllAgents(): Promise<Agent[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/aiworker/get-approved-workers`,
      {
        method: "GET",
        credentials: "include", // <-- key point here
        cache: "no-store", // Ensure fresh data
      }
    );

    const data = await response.json();
    return data.aiApprovedWorkers as Agent[];
  } catch (error) {
    console.error("Error fetching agents:", error);
    throw error; // Re-throw to handle it in the calling function
  }
}


export async function getAgentById(id: string): Promise<Agent> {
  const response = await fetch(`${API_BASE_URL}/api/v1/user/get-aiworker/${id}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Failed to fetch agent');

  const data = await response.json();

  return data.aiWorker as Agent;
}


// export async function runAgent(id: string, input: {text:string}, userId:string): Promise<RunAgentOutput> {
//   const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/run/${id}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({input,userId,aiWorkerId : id}),
//     credentials: 'include', // Include cookies for session management
//   });
//   if (!response.ok) throw new Error('Failed to run agent');
//   return response.json();
// }
export async function runAgent(
  id: string,
  input: Record<string, any>,
  userId: string
): Promise<RunAgentOutput> {
  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/run/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input,
      userId,
      aiWorkerId: id,
    }),
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to run agent');
  return response.json();
}


export async function uploadAgent(data: AgentInput): Promise<Agent> {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
 formData.append('tags', data.tags);
  formData.append('inputSchema', data.inputSchema);
  formData.append('outputSchema', data.outputSchema);
  formData.append('pricePerRun', data.pricePerRun.toString());
  formData.append('file', data.file);

  const response = await fetch(`${API_BASE_URL}/api/v1/aiworker/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include', 
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload agent');
  }
  return response.json();
} 

