import { prisma } from "../../../lib/prisma";

export const POST = async (req) => {
  try {
    const { userId, points } = await req.json(); // Parse JSON body

    // Ensure both userId and points are provided
    console.log(userId, points);

    if (!userId || points === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing userId or points." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert userId to the correct type if needed (e.g., integer)
    const telegramId = parseInt(userId, 10);
    console.log(telegramId);

    const user = await prisma.user.update({
      where: { telegramId },
      data: { points: { increment: points } },
    });

    return new Response(
      JSON.stringify({ message: "Points added successfully", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding points:", error);
    return new Response(JSON.stringify({ error: "Failed to update points." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const OPTIONS = async () => {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST" },
  });
};
