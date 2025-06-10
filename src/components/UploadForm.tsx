"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadAgent } from '@/services/api';
import { toast } from 'sonner';

export function UploadForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading,setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !description || !file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }
    setIsUploading(true);
    setError(null);

   try {
      const agent = await uploadAgent({
        name,
        description,
        files: [file],
      });
      toast.success(`Agent "${agent.name}" uploaded successfully!`);
      // Optionally reset form
      setName('');
      setDescription('');
      setFile(null);
    } catch (error: any) {
      console.error('Error uploading agent:', error);
      toast.error(error.message || 'Failed to upload agent');
    } finally {
      setIsUploading(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files) {
    //   setFiles(Array.from(e.target.files));
    // }
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile ?? null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Upload New Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Agent Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="files">
              Upload .zip file
            </label>
            <Input
              id="files"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              
              required
              disabled={isLoading}
              // accept=".py,.js,.ts,.dockerfile,Dockerfile"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload your agent source files in .zip
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isUploading ? 'Uploading...' : 'Upload Agent'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 