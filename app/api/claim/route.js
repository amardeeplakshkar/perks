import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, taskId, points } = await req.json();

    if (!userId || !taskId || points === undefined) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    console.log("Received telegramId:", userId);
    console.log("Received taskId:", taskId);

    // Convert userId to ObjectId
    const userIdObjectId = new ObjectId(userId);

    // Find the user in the database
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
    });

    if (!existingUser) {
      console.error("User not found with telegramId:", userId);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const userIdString = existingUser.id;
    console.log("Found userId:", userIdString);

    // Convert taskId to ObjectId
    const taskIdObjectId = new ObjectId(taskId);

    // Check if task is already completed
    const existingCompletion = await prisma.taskCompletion.findFirst({
      where: {
        userId: userIdString,
        taskId: taskIdObjectId.toString(),
      },
    });

    if (existingCompletion) {
      return new Response(JSON.stringify({ error: "Task already completed" }), {
        status: 400,
      });
    }

    // Create a new task completion entry
    await prisma.taskCompletion.create({
      data: {
        userId: userIdString,
        taskId: taskIdObjectId.toString(),
        completed: true,
      },
    });

    // Update user points
    await prisma.user.update({
      where: { id: userIdString },
      data: { points: { increment: points } },
    });

    return new Response(
      JSON.stringify({ message: "Task claimed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error claiming task:", error);
    return new Response(JSON.stringify({ error: "Failed to claim task" }), {
      status: 500,
    });
  }
}
