import { prisma } from "../../../lib/prisma";

export const POST = async (req) => {
  try {
    const { userId, points } = await req.json();

    if (!userId || points === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing userId or points." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const telegramId = parseInt(userId, 10); // Ensure userId is converted to a number
    console.log(telegramId, points);

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

    return new Response(
      JSON.stringify({ error: "Failed to update points." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Handle preflight requests for CORS
export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Allow": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
