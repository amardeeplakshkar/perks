import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, referrerId } = await request.json();

  // Check if userId and referrerId are provided
  if (!userId || !referrerId) {
    return NextResponse.json({ error: 'Missing userId or referrerId' }, { status: 400 });
  }

  try {
    // Check if the user (referee) already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
    });

    // If the user already exists, return without giving points
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists. No points awarded.' });
    }

    // Find the referrer by telegramId
    const referrer = await prisma.user.findUnique({
      where: { telegramId: parseInt(referrerId) },
    });

    // If referrer does not exist, return an error
    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    // Create the new user and attach the referrer
    const newUser = await prisma.user.create({
      data: {
        telegramId: parseInt(userId),
        referredByTelegramId: referrer.telegramId,
        isNewUser: false, // Mark user as not new once referred
      },
    });

    // Increment the referrer's points by 500 for the new user
    await prisma.user.update({
      where: { telegramId: referrer.telegramId },
      data: {
        points: {
          increment: 500, // Increase points by 500 for referrer
        },
      },
    });

    return NextResponse.json({ success: true, newUser, referrerPoints: referrer.points + 500 });
  } catch (error) {
    console.error('Error saving referral:', error);
    return NextResponse.json({ error: 'Failed to save referral' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  // Check if userId is provided
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Fetch the user and their referrals (including referrer)
    const user = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
      include: {
        referrals: true,  // Fetch all referrals made by this user
        referredBy: true  // Fetch the referrer of this user
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format the response data to include referrer and referrals
    const response = {
      referrer: user.referredBy ? {
        telegramId: user.referredBy.telegramId,
        username: user.referredBy.username,
        firstName: user.referredBy.firstName,
        lastName: user.referredBy.lastName
      } : null,
      referrals: user.referrals.map(ref => ({
        telegramId: ref.telegramId,
        username: ref.username,
        firstName: ref.firstName,
        lastName: ref.lastName
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}
