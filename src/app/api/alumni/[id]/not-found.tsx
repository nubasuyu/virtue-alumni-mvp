// src/app/alumni/[id]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Alumni Not Found</h2>
      <p className="text-gray-600 mb-8">The profile you are looking for does not exist.</p>
      <Link href="/directory" className="text-blue-600 hover:underline font-medium">
        ← Return to Directory
      </Link>
    </div>
  );
}