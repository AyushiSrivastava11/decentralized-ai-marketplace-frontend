"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export function NavigationMenu() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center font-bold text-xl">
              AIPLAXE
            </Link>
            {user && (
              <div className="ml-10 flex items-center space-x-4">
                <Link href="/agents" className="text-gray-700 hover:text-gray-900">
                  Browse Agents
                </Link>
                <Link href="/upload" className="text-gray-700 hover:text-gray-900">
                  Upload Agent
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Button variant="outline" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 