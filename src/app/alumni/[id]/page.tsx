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
        
        <Link href="/directory" className="inline-flex items-center text-[#6F4E37] hover:text-[#4A332A] mb-8 font-bold text-lg">
          ← Back to Directory
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border-2 border-[#6F4E37]/30">
          <div className="bg-gradient-to-r from-[#6F4E37] to-[#4A332A] h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12">
              <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg overflow-hidden flex-shrink-0 border-2 border-[#6F4E37]/20">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-[#6F4E37]/10 rounded-full flex items-center justify-center text-4xl font-bold text-[#6F4E37]">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </div>
                )}
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <h1 className="text-4xl font-extrabold text-[#4A332A]">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-xl text-gray-800 mt-2 font-medium">
                  {profile.currentJobTitle || 'JSS3 Graduate'} 
                  {profile.company && <span className="text-gray-600"> at {profile.company}</span>}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-5 py-2 rounded-full text-base font-bold bg-[#6F4E37]/10 text-[#6F4E37] border-2 border-[#6F4E37]/30">
                  Class of {profile.graduationSet}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#6F4E37]/30">
              <h2 className="text-2xl font-bold text-[#6F4E37] mb-4 border-b-2 border-[#6F4E37]/20 pb-2">About</h2>
              {profile.bio ? (
                <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-gray-600 italic text-lg">No biography provided yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-[#6F4E37]/30">
              <h2 className="text-2xl font-bold text-[#6F4E37] mb-4 border-b-2 border-[#6F4E37]/20 pb-2">Details</h2>
              <ul className="space-y-5">
                {profile.location && (
                  <li>
                    <span className="block text-sm font-bold text-[#6F4E37] uppercase">Location</span>
                    <span className="text-lg text-gray-900 font-medium">{profile.location}</span>
                  </li>
                )}
                {profile.company && (
                  <li>
                    <span className="block text-sm font-bold text-[#6F4E37] uppercase">School/Company</span>
                    <span className="text-lg text-gray-900 font-medium">{profile.company}</span>
                  </li>
                )}
                {profile.currentJobTitle && (
                  <li>
                    <span className="block text-sm font-bold text-[#6F4E37] uppercase">Current Status</span>
                    <span className="text-lg text-gray-900 font-medium">{profile.currentJobTitle}</span>
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