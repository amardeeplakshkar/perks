import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const { telegramId, walletAddress, isConnected } = await request.json();

    const user = await prisma.user.update({
      where: { telegramId },
      data: {
        walletAddress,
        isWalletConnected: isConnected,
      },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error updating wallet connection:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update wallet connection" }),
      { status: 500 }
    );
  }
}
