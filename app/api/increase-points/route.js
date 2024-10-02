import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { telegramId, incrementValue } = await req.json(); // Accept incrementValue in the request

    if (!telegramId || typeof incrementValue !== 'number') {
      return NextResponse.json({ error: 'Invalid telegramId or incrementValue' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { points: { increment: incrementValue } }, // Use the dynamic incrementValue
    });

    return NextResponse.json({ success: true, points: updatedUser.points });
  } catch (error) {
    console.error('Error increasing points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
