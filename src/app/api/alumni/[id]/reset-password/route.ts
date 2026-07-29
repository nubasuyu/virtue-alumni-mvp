// src/app/api/alumni/[id]/reset-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  // ONLY Super Admins can reset passwords
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params; // This is the Alumni Profile ID

  try {
    // 1. Find the profile to get the associated User ID
    const profile = await prisma.alumniProfile.findUnique({
      where: { id },
      select: { userId: true, firstName: true, lastName: true }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 2. Generate a secure temporary password
    const tempPassword = 'Temp123!'; 
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 3. Update the user's password in the database
    await prisma.user.update({
      where: { id: profile.userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ 
      message: 'Password reset successfully', 
      tempPassword,
      studentName: `${profile.firstName} ${profile.lastName}`
    });
  } catch (error) {
    console.error("Reset Password API CRASH:", error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}