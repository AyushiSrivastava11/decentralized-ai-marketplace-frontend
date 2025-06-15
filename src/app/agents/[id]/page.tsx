"use client";

import { AgentForm } from "@/components/AgentForm";
import { getAgentById } from "@/services/api";
import { use, useEffect, useState } from "react";
import { Agent } from "@/services/api";
import React from "react";
import { Button } from "@/components/ui/button";
import AgentPaymentButton from "@/components/AgentPaymentButton";
import { useAuth, User } from "@/contexts/auth-context";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

async function checkUserOwnsAgent(agentId: string, userId: string): Promise<boolean> {
  if (!userId) return false;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/${userId}/purchased-workers/${agentId}`,
    { credentials: "include" }
  );

  const data = await res.json();
  console.log("Ownership check response:", data);
  return data.owns;
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = React.use(params);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ownsAgent, setOwnsAgent] = useState<boolean>(false);
  const [runsToBuy, setRunsToBuy] = useState<number>(1);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    async function fetchAgent() {
      try {
        const fetchedAgent = await getAgentById(id);
        setAgent(fetchedAgent);

        if (userId) {
          const ownership = await checkUserOwnsAgent(id, userId);
          setOwnsAgent(ownership);
        }
      } catch (err) {
        console.error("Failed to load agent:", err);
        setError("Failed to load agent. Please try again later.");
      }
    }

    fetchAgent();
  }, [id]);

  const generateApiKey = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aiworker/api-key/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          aiWorkerId: agent?.id,
          runs: 10, // or allow user to choose this
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to generate API key: " + data.message);
        return;
      }

      setApiKey(data.data.apiKey);
    } catch (err) {
      console.error("Error generating API key:", err);
      alert("Failed to generate API key");
    }
  };

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  if (!agent) {
    return <p className="text-center text-gray-500 mt-8">Loading agent...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{agent.name}</h1>
        <p className="text-gray-600 mt-2">By {agent.developer?.name}</p>
        <p className="text-gray-600 mt-2">{agent.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          Price per run: <span className="font-medium">₹{agent.pricePerRun}</span>
        </p>
      </div>

      {ownsAgent ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Run Agent</h2>
          <AgentForm agentId={agent.id} inputSchema={{ properties: agent.inputSchema }} />

          <div className="mt-6 border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold">Integrate via API</h3>

            <p className="text-sm text-gray-600">
              You can run this agent in your own backend using the external API endpoint:
            </p>

            <code className="block bg-gray-100 p-2 rounded text-sm">
              POST {process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/external-execute/{agent.id}
            </code>

            {!apiKey ? (
              <Button onClick={generateApiKey} className="mt-4">
                Generate API Key
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-green-700 font-semibold">✅ API Key Generated:</p>
                <code className="block bg-green-100 p-2 rounded text-sm">{apiKey}</code>

                <p className="text-sm text-gray-700">Use this key in your backend like this:</p>
                <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`const axios = require("axios");

const runAgent = async () => {
  const res = await axios.post(
    "${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/external-execute/${agent.id}",
    {
      input: {
        // your input matching schema
      },
    },
    {
      headers: {
        Authorization: "Bearer ${apiKey}"
      }
    }
  );

  console.log("Agent output:", res.data);
};

runAgent();`}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8 p-6 border rounded shadow-sm bg-white space-y-4">
          <h2 className="text-xl font-semibold text-center">Rent this Agent</h2>
          <p className="text-center text-gray-600">
            You don't own this agent yet. Pay per run.
          </p>

          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm font-medium">Number of runs:</label>
            <input
              type="number"
              min={1}
              value={runsToBuy}
              onChange={(e) => setRunsToBuy(Number(e.target.value))}
              className="border px-3 py-2 rounded w-24 text-center"
            />
          </div>

          <p className="text-center text-gray-700 font-medium mt-2">
            Total price: ₹{agent.pricePerRun * runsToBuy}
          </p>

          <div className="flex justify-center mt-4">
            {user && (
              <AgentPaymentButton
                aiWorkerId={agent.id}
                pricePerRun={agent.pricePerRun}
                user={user}
                cycles={runsToBuy}
                isBuying={isBuying}
                onPaymentSuccess={() => setOwnsAgent(true)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
