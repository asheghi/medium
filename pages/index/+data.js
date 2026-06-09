import { postsPerPage } from '../../lib/config';
import prismaModule from '../../server/lib/prisma';

const { prisma } = prismaModule;

export async function data(pageContext) {
  const { routeParams } = pageContext;
  const page = +((routeParams && routeParams.page) || 1);
  const postsCount = await prisma.post.count({
    where: {
      status: 'PUBLISHED',
    },
  });
  const pageCount = Math.ceil(postsCount / postsPerPage);

  const posts = await prisma.post.findMany({
    take: postsPerPage,
    skip: (page - 1) * postsPerPage,
    orderBy: [{ publishedAt: 'desc' }],
    where: {
      status: 'PUBLISHED',
    },
  });

  return {
    page,
    pageCount,
    posts: posts.map((post) => ({ ...post, published: post.status === 'PUBLISHED' })),
  };
}
