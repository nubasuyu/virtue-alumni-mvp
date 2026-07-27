// src/app/admin/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  currentJobTitle: string;
  company: string;
  location: string;
  bio: string;
  user: { email: string };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "", password: "Virtue2026!", firstName: "", lastName: "",
    currentJobTitle: "", company: "", location: "", bio: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchAlumni();
  }, [status, router]);

  const fetchAlumni = async () => {
    try {
      const res = await fetch("/api/alumni");
      if (res.ok) setAlumniList(await res.json());
    } catch (error) {
      console.error("Failed to fetch alumni", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({ error: 'Unknown error' }));
      
      if (res.ok) {
        alert("Alumni added successfully!");
        setFormData({ email: "", password: "Virtue2026!", firstName: "", lastName: "", currentJobTitle: "", company: "", location: "", bio: "" });
        await fetchAlumni();
      } else {
        alert(`Failed to add: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("An error occurred while adding alumni");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/alumni/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAlumniList(prev => prev.filter(a => a.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to delete: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#6F4E37]">Loading...</div>;
  if (session?.user?.role !== "SUPER_ADMIN") return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-red-600">Access Denied</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      <header className="bg-white shadow border-b border-[#6F4E37]/10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#6F4E37]">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage JSS3 2025/2026 Graduate Set • Welcome, {session.user.email}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-8 border border-[#6F4E37]/10">
          <h2 className="text-xl font-bold mb-4 text-[#6F4E37]">Add New Alumni</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" placeholder="Email Address *" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <input type="text" placeholder="First Name *" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <input type="text" placeholder="Last Name *" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <input type="text" placeholder="Current School/Status" value={formData.currentJobTitle} onChange={(e) => setFormData({...formData, currentJobTitle: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <input type="text" placeholder="School/Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent" />
            <textarea placeholder="Short Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent md:col-span-2" />
            <button type="submit" disabled={loading} className="bg-[#6F4E37] text-white py-2 px-4 rounded hover:bg-[#5a3e2b] disabled:bg-gray-400 md:col-span-2 font-medium transition-colors">
              {loading ? "Adding..." : "Add Alumni"}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border border-[#6F4E37]/10">
          <h2 className="text-xl font-bold mb-4 text-[#6F4E37]">Registered Alumni ({alumniList.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FDFBF7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status / School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alumniList.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No alumni added yet.</td></tr>
                ) : (
                  alumniList.map((alumni) => (
                    <tr key={alumni.id} className="hover:bg-[#FDFBF7]">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{alumni.firstName} {alumni.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{alumni.user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{alumni.currentJobTitle} {alumni.company && `@ ${alumni.company}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => handleDelete(alumni.id)} disabled={deletingId === alumni.id} className="text-red-600 hover:text-red-900 text-sm font-medium disabled:text-gray-400">
                          {deletingId === alumni.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}