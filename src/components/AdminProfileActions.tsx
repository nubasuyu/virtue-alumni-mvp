// src/components/AdminProfileActions.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminProfileActions({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("⚠️ Are you sure you want to permanently delete this alumni profile? This cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/alumni/${profileId}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Profile deleted successfully.");
        router.push('/directory');
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t-2 border-[#6F4E37]/20 flex flex-col sm:flex-row gap-4">
      <Link 
        href={`/admin/edit/${profileId}`}
        className="bg-[#6F4E37] text-white text-center px-8 py-3 rounded-lg font-bold hover:bg-[#5a3e2b] transition-colors text-lg shadow-md"
      >
        Edit This Profile
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors text-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isDeleting ? 'Deleting...' : 'Delete This Profile'}
      </button>
    </div>
  );
}