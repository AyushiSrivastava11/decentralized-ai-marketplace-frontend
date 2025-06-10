"use client";

import { AgentForm } from "@/components/AgentForm";
import { getAgentById } from "@/services/api";
import { useEffect, useState } from "react";
import { Agent } from "@/services/api";
import React from "react"; // <-- needed for React.use()
import { Button } from "@/components/ui/button";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>; // this is now a Promise
}

// Example: you'll replace this with a real API later
async function checkUserOwnsAgent(agentId: string): Promise<boolean> {
  // Simulate API call → right now we fake it
  return false;
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = React.use(params); // official way → unwrapping the Promise param

  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ownsAgent, setOwnsAgent] = useState<boolean>(false);
  const [runsToBuy, setRunsToBuy] = useState<number>(1);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  console.log(agent)

  useEffect(() => {
    async function fetchAgent() {
      try {
        const fetchedAgent = await getAgentById(id);
        setAgent(fetchedAgent);

        const ownership = await checkUserOwnsAgent(id);
        setOwnsAgent(ownership);
      } catch (err) {
        console.error("Failed to load agent:", err);
        setError("Failed to load agent. Please try again later.");
      }
    }

    fetchAgent();
  }, [id]);

  const handleBuyRuns = async () => {
    setIsBuying(true);
    try {
      // Call your API to buy runs here.
      console.log(`Buying ${runsToBuy} runs for agent ${agent?.id}`);
      alert(`Successfully bought ${runsToBuy} runs!`);
      setOwnsAgent(true);
    } catch (err) {
      console.error("Error buying runs:", err);
      alert("Failed to buy runs. Please try again.");
    } finally {
      setIsBuying(false);
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
          Price per run:{" "}
          <span className="font-medium">${agent.pricePerRun}</span>
        </p>
      </div>

      {ownsAgent ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Run Agent</h2>
          <AgentForm agentId={agent.id} />

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Integrate via API</h3>
            <p className="text-sm text-gray-600 mt-2">
              Use this endpoint to run the agent in your own app:
            </p>
            <code className="block bg-gray-100 p-2 rounded text-sm mt-2">
              POST {process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aiworker/run/
              {agent.id}
            </code>
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
            Total price: ${agent.pricePerRun * runsToBuy}
          </p>

         
          <Button className="w-full text-center" asChild>
            <span
              onClick={handleBuyRuns}
              role="button"
              tabIndex={0}
              aria-disabled={isBuying}
              
            >
              {isBuying ? "Processing..." : "Buy Runs & Run Agent"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
