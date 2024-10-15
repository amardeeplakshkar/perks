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

    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Reset daily plays if last played date is not today
    if (user.lastPlayedDate?.toISOString().split("T")[0] !== todayString) {
      user.dailyPlays = 0; // Reset daily plays
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
        lastPlayedDate: today, // Update lastPlayedDate to today's date
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
