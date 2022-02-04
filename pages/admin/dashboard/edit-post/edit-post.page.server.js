import { parse } from 'qs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const passToClient = ['pageProps', 'urlPathname', 'routeParams', 'post'];

export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const queryParams = parse(url.substring(url.indexOf('?') + 1));
  const { postId } = queryParams;
  const extra = {};
  if (postId) {
    extra.post = await prisma.post.findUnique({ where: { id: +postId } });
  }
  return {
    pageContext: extra,
  };
}
