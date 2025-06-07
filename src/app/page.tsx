import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-6">
        Welcome to AIPLAXE
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Your marketplace for powerful AI agents. From data analysis to content generation,
        find the perfect AI worker for your needs.
      </p>
      <div className="flex gap-4">
        <Button size="lg" asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Browse Agents</h3>
          <p className="text-gray-600">
            Explore our collection of AI agents ready to help with your tasks
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Run Tasks</h3>
          <p className="text-gray-600">
            Execute AI agents with your specific inputs and get results instantly
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Upload Agents</h3>
          <p className="text-gray-600">
            Share your own AI agents with the community
          </p>
        </div>
      </div>
    </div>
  );
}
