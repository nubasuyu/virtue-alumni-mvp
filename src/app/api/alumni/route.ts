import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profiles = await prisma.alumniProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: 'Failed to fetch alumni' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, firstName, lastName, currentJobTitle, company, location, bio } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ALUMNI',
        profile: {
          create: {
            firstName,
            lastName,
            currentJobTitle: currentJobTitle || null,
            company: company || null,
            location: location || null,
            bio: bio || null,
            graduationSet: 'JSS3 2025/2026',
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }
    
    console.error("POST error:", error);
    return NextResponse.json({ error: 'Failed to create alumni' }, { status: 500 });
  }
}