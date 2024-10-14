import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET user with completed tasks
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get("telegramId");
    const allUsers = await prisma.user.findMany({
      include: {
        taskCompletions: true, // Include task completions
      },
    });

    console.log("All users with their task completions:", allUsers);

    // Validate telegramId
    if (!telegramId) {
      return NextResponse.json(
        { error: "Invalid user data: telegramId is missing" },
        { status: 400 }
      );
    }

    // Fetch user along with their completed tasks
    const user = await prisma.user.findUnique({
      where: { telegramId: parseInt(telegramId) }, // Assuming telegramId is an integer
      include: { taskCompletions: true }, // Include completed tasks
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract completed task IDs
    const completedTaskIds = user.taskCompletions.map((tc) => tc.taskId);

    return NextResponse.json({
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
      hasClaimedWelcomePoints: user.hasClaimedWelcomePoints,
      completedTaskIds,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create or fetch a user
export async function POST(req) {
  try {
    const userData = await req.json();

    // Validate incoming data
    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: "Invalid user data: telegramId is missing" },
        { status: 400 }
      );
    }

    // Check if user exists based on telegramId
    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
      include: { taskCompletions: true }, // Include completed tasks
    });

    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: {
          telegramId: userData.id,
          username: userData.username || "",
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          points: 0,
          hasClaimedWelcomePoints: false,
        },
        include: { taskCompletions: true }, // Include completed tasks
      });
    }

    // Extract completed task IDs
    const completedTaskIds = user.taskCompletions.map((tc) => tc.taskId);

    return NextResponse.json({
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      points: user.points,
      hasClaimedWelcomePoints: user.hasClaimedWelcomePoints,
      completedTaskIds,
    });
  } catch (error) {
    console.error("Error processing user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
