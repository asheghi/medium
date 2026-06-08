import { PrismaClient } from '@prisma/client';
import { render } from 'vike/abort';

const prisma = new PrismaClient();

export async function data(pageContext) {
  const { id: postId } = pageContext.routeParams;
  const post = await prisma.post.findUnique({ where: { id: +postId } });
  if (!post) throw render(404);
  return { post };
}
