// /pages/api/claim-points.js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { telegramId, points } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (user && user.hasClaimedWelcomePoints) {
        return res.status(400).json({ error: "Points already claimed." });
      }

      await prisma.user.update({
        where: { telegramId },
        data: { points: user.points + points, hasClaimedWelcomePoints: true },
      });

      res.status(200).json({ message: "Points claimed successfully." });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
