import { stringify, parse } from 'qs';
import { PrismaClient } from '@prisma/client';
import { getDebug, parseAxiosError } from '../../lib/utils';
import { postsPerPage } from '../../lib/config';

const prisma = new PrismaClient();

const debug = getDebug('home', 'server');
export const passToClient = [];

export async function onBeforeRender(pageContext) {
  const { routeParams } = pageContext;
  const page = +((routeParams && routeParams.page) || 1);
  const extra = {};
  const postsCount = await prisma.post.count({
    where: {
      published: true,
    },
  });
  extra.page = page;
  extra.pageCount = Math.ceil(postsCount / postsPerPage);

  extra.posts = await prisma.post.findMany({
    take: postsPerPage,
    skip: (page - 1) * postsPerPage,
    orderBy: [{ publishedAt: 'desc' }],
    where: {
      published: true,
    },
  });

  // todo redirect if posts.length === 0
  return {
    pageContext: extra,
  };
}
