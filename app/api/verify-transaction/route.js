import { prisma } from "../../../lib/prisma";

export async function POST(request) {
  try {
    const { userId, txHash, tonAmount } = await request.json();

    // Check if the transaction already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { txHash },
    });

    if (existingTransaction) {
      return new Response(
        JSON.stringify({ error: "Transaction already verified" }),
        { status: 400 }
      );
    }

    // Verify TON transaction (mock verification here)
    const isVerified = true; // Replace with actual verification logic

    if (isVerified) {
      await prisma.transaction.create({
        data: { userId, txHash, tonAmount, status: "verified" },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { points: { increment: 5000 } },
      });

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Transaction failed" }), {
        status: 400,
      });
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
