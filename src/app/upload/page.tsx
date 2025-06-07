import { UploadForm } from '@/components/UploadForm';

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Agent</h1>
        <p className="text-gray-600 mt-2">
          Share your AI agent with the community. Make sure to include a clear description
          and all necessary source files.
        </p>
      </div>

      <UploadForm />
    </div>
  );
} 