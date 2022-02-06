import { stringify, parse } from 'qs';
import { PrismaClient } from '@prisma/client';
import { getDebug, parseAxiosError } from '../../lib/utils';

const prisma = new PrismaClient();

const debug = getDebug('home', 'server');
export const passToClient = ['pageProps', 'urlPathname', 'posts', 'pagination'];

export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const queryParams = parse(url.substring(url.indexOf('?') + 1));
  const page = (queryParams && queryParams.page) || 1;
  const extra = {};

  extra.posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: 'desc' }],
    where: {
      published: true,
    },
  });
  return {
    pageContext: extra,
  };
}
