import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  const { telegramId } = await req.json();

  if (!telegramId) {
    return NextResponse.json(
      { error: "Telegram ID is required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const now = new Date();

    // Reset daily plays if last played was more than 8 hours ago
    if (user.lastPlayedDate) {
      const lastPlayed = new Date(user.lastPlayedDate);
      const hoursSinceLastPlay = Math.abs(now - lastPlayed) / 36e5; // Calculate hours difference

      if (hoursSinceLastPlay >= 8) {
        user.dailyPlays = 0; // Reset daily plays if more than 8 hours have passed
      }
    }

    // Check if the user has reached the daily limit of plays
    if (user.dailyPlays >= 3) {
      return NextResponse.json(
        { error: "Daily play limit reached." },
        { status: 400 }
      );
    }

    // Check if the user has enough points to play
    if (user.points < 100) {
      return NextResponse.json(
        { error: "Insufficient points." },
        { status: 400 }
      );
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: {
        points: user.points - 100, // Deduct 100 points
        dailyPlays: user.dailyPlays + 1, // Increment daily plays
        lastPlayedDate: now, // Update lastPlayedDate to the current date and time
      },
    });

    return NextResponse.json({
      success: true,
      dailyPlays: updatedUser.dailyPlays, // Return updated daily plays
      points: updatedUser.points, // Return updated points
    });
  } catch (error) {
    console.error("Error in play-game API:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
