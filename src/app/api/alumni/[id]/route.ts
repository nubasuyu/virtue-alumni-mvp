// src/app/api/alumni/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 1. GET: Fetch a single profile (Used to pre-fill the Edit form)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET API CRASH:", error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// 2. PUT: Update the profile (Used when you click "Save Changes")
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
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

// 3. DELETE: Remove the profile
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: profile.userId }
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("DELETE API CRASH:", error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}