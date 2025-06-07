"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { runAgent, RunAgentOutput } from '@/services/api';

interface AgentFormProps {
  agentId: string;
}

export function AgentForm({ agentId }: AgentFormProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<RunAgentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await runAgent(agentId, { input });
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Enter your input here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
            disabled={isLoading}
          />
          
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          {output && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Output:</h3>
              <p className="whitespace-pre-wrap">{output.output}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Running...' : 'Run Agent'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 