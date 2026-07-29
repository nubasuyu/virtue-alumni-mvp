// src/app/api/alumni/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to check permissions
async function checkPermissions(id: string, session: any) {
  if (!session) return { allowed: false, profile: null };
  
  const isAdmin = session.user.role === 'SUPER_ADMIN';
  
  const profile = await prisma.alumniProfile.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!profile) return { allowed: false, profile: null };

  // Allow if Admin OR if the logged-in user owns this profile
  const isOwner = session.user.id === profile.userId;
  const allowed = isAdmin || isOwner;

  return { allowed, profile, isAdmin };
}

// 1. GET: Fetch a single profile
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { allowed, profile } = await checkPermissions(id, session);

  if (!allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  // Return full profile data for the edit form
  const fullProfile = await prisma.alumniProfile.findUnique({ where: { id } });
  return NextResponse.json(fullProfile);
}

// 2. PUT: Update the profile
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { allowed, isAdmin } = await checkPermissions(id, session);

  if (!allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  try {
    await prisma.alumniProfile.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        currentJobTitle: body.currentJobTitle || null,
        company: body.company || null,
        location: body.location || null,
        bio: body.bio || null,
        profileImage: body.profileImage || null,
      }
    });
    return NextResponse.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error("PUT API CRASH:", error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// 3. DELETE: Only Admins can delete
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.alumniProfile.findUnique({ where: { id }, select: { userId: true } });
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    await prisma.user.delete({ where: { id: profile.userId } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("DELETE API CRASH:", error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}