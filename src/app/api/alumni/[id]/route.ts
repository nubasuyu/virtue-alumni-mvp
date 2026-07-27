// src/app/api/alumni/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // CRITICAL: Await params for Next.js 15+
  const { id } = await params;

  try {
    // 1. Find the profile to get the associated userId
    const profile = await prisma.alumniProfile.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 2. Delete the User (which cascades and deletes the profile automatically)
    await prisma.user.delete({
      where: { id: profile.userId }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    // THIS LINE IS CRITICAL: It will print the exact error to your PowerShell terminal
    console.error("DELETE API CRASH:", error); 
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}