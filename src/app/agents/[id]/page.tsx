import { notFound } from 'next/navigation';
import { AgentForm } from '@/components/AgentForm';
import { getAgentById } from '@/services/api';

interface AgentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  try {
    const agent = await getAgentById(params.id);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{agent.name}</h1>
          <p className="text-gray-600 mt-2">{agent.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Added {new Date(agent.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Run Agent</h2>
          <AgentForm agentId={agent.id} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 