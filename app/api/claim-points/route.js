import { NextResponse } from "next/server";
import {prisma} from "../../../lib/prisma"; // Adjust path to your Prisma setup

// Handle POST request to add welcome points
export async function POST(request) {
  try {
    const { telegramId, points } = await request.json();

    if (!telegramId) {
      return NextResponse.json({ error: "Telegram ID is required." }, { status: 400 });
    }

    // Check if the user already claimed points
    const user = await prisma.user.findUnique({
      where: { telegramId: telegramId.toString() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.hasClaimedWelcomePoints) {
      return NextResponse.json(
        { error: "You have already claimed your welcome points." },
        { status: 403 }
      );
    }

    // Update user points and set `hasClaimedWelcomePoints` to true
    const updatedUser = await prisma.user.update({
      where: { telegramId: telegramId.toString() },
      data: {
        points: user.points + points,
        hasClaimedWelcomePoints: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error claiming points:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
