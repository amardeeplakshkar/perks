import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    // Logging the received data for debugging
    console.log("Received data:", body);

    const { telegramId, points = 500 } = body; // Default value for points

    // Log if telegramId or points are missing
    if (!telegramId) {
      console.log("Missing telegramId");
      return NextResponse.json(
        { error: "Invalid data: telegramId is required" },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    // Log if user is not found
    if (!user) {
      console.log("User not found:", telegramId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the user has already claimed the welcome points
    if (user.hasClaimedWelcomePoints) {
      console.log("Welcome points already claimed for:", telegramId);
      return NextResponse.json(
        { error: "Welcome points already claimed" },
        { status: 400 }
      );
    }

    // Update the user's points and mark them as having claimed the welcome points
    await prisma.user.update({
      where: { telegramId },
      data: {
        points: { increment: points },
        hasClaimedWelcomePoints: true,
      },
    });

    console.log("Points granted successfully to:", telegramId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error giving welcome points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
