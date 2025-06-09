import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AgentCard } from '@/components/AgentCard';
import { Agent, getAllAgents } from '@/services/api';


export default async function DashboardPage() {
  let agents: Agent[] = [];

  try {
    agents = await getAllAgents();
    console.log('Fetched agents:', agents);
  } catch (err) {
    console.error('Failed to load agents on dashboard:', err);
    // Optional fallback UI
    return <div className="text-red-500">Failed to load agents. Please try again later.</div>;
  }

  const featuredAgents = agents.slice(0, 3); // Show first 3 agents as featured

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/upload">Upload New Agent</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">Featured Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/agents">
                <span className="flex items-center">
                  Browse All Agents
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/upload">
                <span className="flex items-center">
                  Upload New Agent
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 