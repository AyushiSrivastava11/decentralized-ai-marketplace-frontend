"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadAgent } from '@/services/api';

export function UploadForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [inputSchema, setInputSchema] = useState('');
  const [outputSchema, setOutputSchema] = useState('');
  const [pricePerRun, setPricePerRun] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!name || !description || !tags || !file) {
        throw new Error('Please fill all required fields');
      }

      // Validate JSON schemas
      try {

        if (inputSchema !== "") {
          JSON.parse(inputSchema);
        }
        if (outputSchema !== "") {
          JSON.parse(outputSchema);
        }

      } catch (err) {
        throw new Error('Invalid JSON format in input/output schema');
      }

      // Validate price
      const price = parseFloat(pricePerRun);
      if (isNaN(price) || price < 0) {
        throw new Error('Please enter a valid price');
      }

      await uploadAgent({
        name,
        description,
        tags,
        inputSchema,
        outputSchema,
        pricePerRun: price,
        file: file,
      });
      
      router.push('/agents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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
              Agent Name*
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
              Description*
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
            <label className="block text-sm font-medium mb-1" htmlFor="tags">
              Tags* (comma-separated)
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. nlp, text-generation, classification"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="inputSchema">
              Input Schema (JSON) (Optional)
            </label>
            <Textarea
              id="inputSchema"
              value={inputSchema}
              onChange={(e) => setInputSchema(e.target.value)}
              placeholder='e.g. {"type": "object", "properties": {"text": {"type": "string"}}}'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="outputSchema">
              Output Schema (JSON) (Optional)
            </label>
            <Textarea
              id="outputSchema"
              value={outputSchema}
              onChange={(e) => setOutputSchema(e.target.value)}
              placeholder='e.g. {"type": "object", "properties": {"result": {"type": "string"}}}'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="pricePerRun">
              Price Per Run* (₹)
            </label>
            <Input
              id="pricePerRun"
              type="number"
              step="0.01"
              min="0"
              value={pricePerRun}
              onChange={(e) => setPricePerRun(e.target.value)}
              placeholder="e.g. 10.00"
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the price in Indian Rupees (₹)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="file">
              Agent File* (ZIP)
            </label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              disabled={isLoading}
              accept=".zip"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload your agent as a ZIP file containing all necessary files
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Agent'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 