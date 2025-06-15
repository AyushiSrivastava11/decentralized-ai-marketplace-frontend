"use client";
import { AgentCard } from "@/components/AgentCard";
import { getAllAgents, Agent } from "@/services/api";
import { useEffect, useState } from "react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const fetchedAgents = await getAllAgents();
        setAgents(fetchedAgents);
      } catch (err) {
        console.error("Failed to load agents on dashboard:", err);
        setError("Failed to load agents. Please try again later.");
      }
    }

    fetchAgents();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <p className="text-gray-600 mt-2">
          Browse our collection of AI agents ready to help with your tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {agents.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No agents available yet. Be the first to upload one!
        </p>
      )}

      {error && (
        <p className="text-center text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
}
