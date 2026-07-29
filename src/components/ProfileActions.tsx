// src/components/ProfileActions.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface ProfileActionsProps {
  profileId: string;
  profileUserId: string; // The ID of the user who owns this profile
  currentUserId: string | undefined; // The ID of the currently logged-in user
  isAdmin: boolean;
}

export default function ProfileActions({ profileId, profileUserId, currentUserId, isAdmin }: ProfileActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Logic: Can edit if Admin OR Owner. Can delete ONLY if Admin.
  const canEdit = isAdmin || (currentUserId === profileUserId);
  const canDelete = isAdmin;

  if (!canEdit && !canDelete) return null; // Don't show anything if no permissions

  const handleDelete = async () => {
    if (!confirm("⚠️ Are you sure you want to permanently delete this alumni profile? This cannot be undone.")) return;
    
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
      {canEdit && (
        <Link 
          href={`/admin/edit/${profileId}`}
          className="bg-[#6F4E37] text-white text-center px-8 py-3 rounded-lg font-bold hover:bg-[#5a3e2b] transition-colors text-lg shadow-md"
        >
          Edit Profile
        </Link>
      )}
      
      {canDelete && (
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors text-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete Profile'}
        </button>
      )}
    </div>
  );
}