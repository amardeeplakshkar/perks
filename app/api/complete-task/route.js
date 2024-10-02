import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { telegramId } = await req.json();

    if (!telegramId) {
      return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 });
    }

    // Find the user to check if the task has already been completed
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (user.taskCompleted) {
      return NextResponse.json({ error: 'Task has already been completed' }, { status: 400 });
    }

    // Update the user to mark the task as completed and increment points
    const updatedUser = await prisma.user.update({
      where: { telegramId },
      data: { taskCompleted: true, points: { increment: 200 } }, // Increment points by 200
    });

    return NextResponse.json({ success: true, points: updatedUser.points });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
