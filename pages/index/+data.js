import { PrismaClient } from '@prisma/client';
import { postsPerPage } from '../../lib/config';

const prisma = new PrismaClient();

export async function data(pageContext) {
  const { routeParams } = pageContext;
  const page = +((routeParams && routeParams.page) || 1);
  const postsCount = await prisma.post.count({
    where: {
      published: true,
    },
  });
  const pageCount = Math.ceil(postsCount / postsPerPage);

  const posts = await prisma.post.findMany({
    take: postsPerPage,
    skip: (page - 1) * postsPerPage,
    orderBy: [{ publishedAt: 'desc' }],
    where: {
      published: true,
    },
  });

  return { page, pageCount, posts };
}
