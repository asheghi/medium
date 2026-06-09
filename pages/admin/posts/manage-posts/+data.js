import prismaModule from '../../../../server/lib/prisma';

const { prisma } = prismaModule;
export async function data() {
  const posts = await prisma.post.findMany({
    orderBy: [
      { createdAt: 'desc' },
    ],
  });
  return { posts: posts.map((post) => ({ ...post, published: post.status === 'PUBLISHED' })) };
}
