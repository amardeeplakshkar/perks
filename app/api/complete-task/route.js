import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { telegramId, taskId, points } = await req.json();

    if (!telegramId || !taskId || !points) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Assuming you have logic to mark the task as completed
    const user = await prisma.user.update({
      where: { telegramId: telegramId },
      data: {
        points: {
          increment: points, // Increment points
        },
        completedTasks: {
          push: taskId, // Use `push` to add the taskId to the array
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error processing task completion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
