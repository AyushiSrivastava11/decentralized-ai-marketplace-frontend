"use client";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Agent } from '@/services/api';

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">{agent.name}</CardTitle>
          {/* <CardDescription className="text-sm text-gray-500">
            Added {new Date(agent.createdAt).toLocaleDateString()}
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{agent.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
} 