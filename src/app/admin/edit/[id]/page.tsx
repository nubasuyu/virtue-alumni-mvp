// src/app/admin/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EditAlumniPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', currentJobTitle: '', company: '',
    location: '', bio: '', profileImage: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && params.id) {
      fetch(`/api/alumni/${params.id}`)
        .then(res => {
          if (res.status === 401) {
            setAccessDenied(true);
            setLoading(false);
            return null;
          }
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then(data => {
          if (data) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              currentJobTitle: data.currentJobTitle || '',
              company: data.company || '',
              location: data.location || '',
              bio: data.bio || '',
              profileImage: data.profileImage || ''
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setAccessDenied(true);
          setLoading(false);
        });
    }
  }, [status, params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/alumni/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert("Profile updated successfully!");
        router.push(`/alumni/${params.id}`);
      } else {
        const errData = await res.json();
        alert(`Failed to update: ${errData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#6F4E37] text-xl">Loading...</div>;
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] text-red-600">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You do not have permission to edit this profile.</p>
        <button onClick={() => router.back()} className="bg-[#6F4E37] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#5a3e2b]">
          Go Back
        </button>
      </div>
    );
  }

  const inputClass = "w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] text-lg bg-white";
  const labelClass = "block text-sm font-bold text-[#6F4E37] mb-1 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl border-2 border-[#6F4E37]/20">
        <h1 className="text-3xl font-extrabold text-[#6F4E37] mb-6 border-b pb-4">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>First Name</label><input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Last Name</label><input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Current School/Status</label><input value={formData.currentJobTitle} onChange={e => setFormData({...formData, currentJobTitle: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>School/Company</label><input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Location</label><input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass} /></div>
          <div><label className={labelClass}>Bio</label><textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={4} className={inputClass} /></div>
          
          <div className="flex gap-4 pt-6 border-t">
            <button type="submit" disabled={saving} className="bg-[#6F4E37] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5a3e2b] disabled:bg-gray-400 transition-colors text-lg flex-1">
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors text-lg">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}