// src/app/api/public/alumni/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all alumni profiles (PUBLIC - no authentication required)
export async function GET() {
  try {
    const profiles = await prisma.alumniProfile.findMany({
      where: {
        graduationSet: 'JSS3 2025/2026',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        currentJobTitle: true,
        company: true,
        location: true,
        bio: true,
        profileImage: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Public GET error:", error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}