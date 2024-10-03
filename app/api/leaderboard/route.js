// /pages/api/leaderboard.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: {
        points: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
