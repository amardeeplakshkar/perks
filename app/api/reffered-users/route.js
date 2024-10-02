// pages/api/referred-users.js

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get('telegramId');

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }

    // Fetch the user with the specified telegramId
    const user = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) }, // Make sure to convert to number
      include: { referrals: true }, // Include referred users
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ referrals: user.referrals });
  } catch (error) {
    console.error('Error fetching referred users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
