// src/app/alumni/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AlumniProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const profile = await prisma.alumniProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link 
          href="/directory" 
          className="inline-flex items-center text-[#6F4E37] hover:text-[#4A332A] mb-8 font-medium"
        >
          ← Back to Directory
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-[#6F4E37]/10">
          <div className="bg-gradient-to-r from-[#6F4E37] to-[#4A332A] h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md overflow-hidden flex-shrink-0">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#6F4E37]/10 rounded-full flex items-center justify-center text-3xl font-bold text-[#6F4E37]">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {profile.currentJobTitle || 'JSS3 Graduate'} 
                  {profile.company && <span className="text-gray-400"> at {profile.company}</span>}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#6F4E37]/10 text-[#6F4E37] border border-[#6F4E37]/20">
                  Class of {profile.graduationSet}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6 border border-[#6F4E37]/10">
              <h2 className="text-xl font-bold text-[#6F4E37] mb-4 border-b border-gray-100 pb-2">About</h2>
              {profile.bio ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No biography provided yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 border border-[#6F4E37]/10">
              <h2 className="text-xl font-bold text-[#6F4E37] mb-4 border-b border-gray-100 pb-2">Details</h2>
              <ul className="space-y-4">
                {profile.location && (
                  <li>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Location</span>
                    <span className="text-gray-900">{profile.location}</span>
                  </li>
                )}
                {profile.company && (
                  <li>
                    <span className="block text-xs font-medium text-gray-500 uppercase">School/Company</span>
                    <span className="text-gray-900">{profile.company}</span>
                  </li>
                )}
                {profile.currentJobTitle && (
                  <li>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Current Status</span>
                    <span className="text-gray-900">{profile.currentJobTitle}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}