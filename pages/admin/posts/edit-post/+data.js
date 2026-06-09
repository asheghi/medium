import { render } from 'vike/abort';
import prismaModule from '../../../../server/lib/prisma';

const { prisma } = prismaModule;

export async function data(pageContext) {
  const { id: postId } = pageContext.routeParams;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw render(404);
  return { post: { ...post, published: post.status === 'PUBLISHED' } };
}
