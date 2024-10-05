// app/api/welcome-points/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { telegramId, points } = await req.json();

    if (!telegramId || !points) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Update the user's points
    await prisma.user.update({
      where: { telegramId },
      data: { points: { increment: points } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error giving welcome points:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
