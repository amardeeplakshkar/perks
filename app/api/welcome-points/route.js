import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { telegramId } = req.body;

  try {
    await prisma.user.update({
      where: { telegramId },
      data: {
        points: { increment: 500 }, // Add welcome points
        isNewUser: false, // Mark the user as not new anymore
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error granting welcome points" });
  }
}
