// src/app/directory/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  currentJobTitle: string;
  company: string;
  location: string;
  bio: string;
  profileImage: string | null;
}

export default function DirectoryPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await fetch("/api/public/alumni");
      if (res.ok) {
        const data = await res.json();
        setAlumni(data);
      }
    } catch (error) {
      console.error("Failed to fetch alumni", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((alumnus) => {
    const fullName = `${alumnus.firstName} ${alumnus.lastName}`.toLowerCase();
    const job = (alumnus.currentJobTitle || "").toLowerCase();
    const company = (alumnus.company || "").toLowerCase();
    const location = (alumnus.location || "").toLowerCase();
    
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      job.includes(search) ||
      company.includes(search) ||
      location.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-xl text-[#6F4E37]">Loading alumni directory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#6F4E37] mb-4">
            JSS3 Alumni Directory
          </h1>
          <p className="text-lg text-gray-600">
            Meet the outstanding Junior Secondary graduates of Virtue College
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, school, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent bg-white"
          />
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">
              {searchTerm ? "No alumni found matching your search." : "No alumni have registered yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <Link
                key={alumnus.id}
                href={`/alumni/${alumnus.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-[#6F4E37]/10"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#6F4E37]/10 rounded-full flex items-center justify-center text-xl font-bold text-[#6F4E37] overflow-hidden flex-shrink-0">
                      {alumnus.profileImage ? (
                        <img 
                          src={alumnus.profileImage} 
                          alt={`${alumnus.firstName} ${alumnus.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${alumnus.firstName[0]}${alumnus.lastName[0]}`
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {alumnus.firstName} {alumnus.lastName}
                      </h3>
                      {alumnus.currentJobTitle && (
                        <p className="text-sm text-gray-600">{alumnus.currentJobTitle}</p>
                      )}
                    </div>
                  </div>
                  
                  {alumnus.company && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-[#6F4E37]">School/Company:</span> {alumnus.company}
                    </p>
                  )}
                  
                  {alumnus.location && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium text-[#6F4E37]">Location:</span> {alumnus.location}
                    </p>
                  )}
                  
                  {alumnus.bio && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                      {alumnus.bio}
                    </p>
                  )}
                  
                  <div className="mt-4 text-[#6F4E37] text-sm font-semibold hover:text-[#4A332A] flex items-center">
                    View Full Profile <span className="ml-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}