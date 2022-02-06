import { PrismaClient } from '@prisma/client';
import { getDebug } from '../../lib/utils';

const prisma = new PrismaClient();
const debug = getDebug('show-post', 'page');

export const passToClient = ['post'];
export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const slug = url.substring('/post/'.length);
  const extra = {};
  extra.post = await prisma.post.findFirst({ where: { slug, published: true } });
  console.log('extra:', extra);
  return {
    pageContext: extra,
  };
}
