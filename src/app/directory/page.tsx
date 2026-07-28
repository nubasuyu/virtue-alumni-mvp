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
      fullName.includes(search) || job.includes(search) || company.includes(search) || location.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-xl font-bold text-[#6F4E37]">Loading alumni directory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A332A] mb-4">
            JSS3 Alumni Directory
          </h1>
          <p className="text-lg md:text-xl text-[#6F4E37] font-medium">
            Meet the outstanding Junior Secondary graduates of Virtue College
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, school, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-4 text-lg border-2 border-[#6F4E37]/40 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent bg-white text-gray-900"
          />
        </div>

        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow border-2 border-[#6F4E37]/20">
            <p className="text-gray-700 text-lg font-medium">
              {searchTerm ? "No alumni found matching your search." : "No alumni have registered yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlumni.map((alumnus) => (
              <Link
                key={alumnus.id}
                href={`/alumni/${alumnus.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden border-2 border-[#6F4E37]/30"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-20 h-20 bg-[#6F4E37]/10 rounded-full flex items-center justify-center text-2xl font-bold text-[#6F4E37] overflow-hidden flex-shrink-0 border-2 border-[#6F4E37]/20">
                      {alumnus.profileImage ? (
                        <img src={alumnus.profileImage} alt={`${alumnus.firstName} ${alumnus.lastName}`} className="w-full h-full object-cover" />
                      ) : (
                        `${alumnus.firstName[0]}${alumnus.lastName[0]}`
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-[#4A332A]">
                        {alumnus.firstName} {alumnus.lastName}
                      </h3>
                      {alumnus.currentJobTitle && (
                        <p className="text-base text-gray-800 font-medium">{alumnus.currentJobTitle}</p>
                      )}
                    </div>
                  </div>
                  
                  {alumnus.company && (
                    <p className="text-base text-gray-800 mb-2">
                      <span className="font-bold text-[#6F4E37]">School/Company:</span> {alumnus.company}
                    </p>
                  )}
                  
                  {alumnus.location && (
                    <p className="text-base text-gray-800 mb-2">
                      <span className="font-bold text-[#6F4E37]">Location:</span> {alumnus.location}
                    </p>
                  )}
                  
                  {alumnus.bio && (
                    <p className="text-base text-gray-700 mt-3 line-clamp-3">
                      {alumnus.bio}
                    </p>
                  )}
                  
                  <div className="mt-6 text-[#6F4E37] text-base font-bold hover:text-[#4A332A] flex items-center">
                    View Full Profile <span className="ml-2 text-xl">→</span>
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