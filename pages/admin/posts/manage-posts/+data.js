import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function data() {
  const posts = await prisma.post.findMany({
    orderBy: [
      { createdAt: 'desc' },
    ],
  });
  return { posts };
}
