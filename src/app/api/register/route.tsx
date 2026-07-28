// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, password, firstName, lastName, currentJobTitle, company, location, bio, profileImage
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await prisma.user.create({
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
            profileImage: profileImage || null,
            graduationSet: 'JSS3 2025/2026',
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json({ message: 'Registration successful', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}