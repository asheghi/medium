import { PrismaClient } from '@prisma/client';

export const passToClient = ['pageProps', 'urlPathname', 'posts'];
const prisma = new PrismaClient();
export async function onBeforeRender() {
  const extra = {};
  extra.posts = await prisma.post.findMany({
    orderBy: [
      { createdAt: 'desc' },
    ],
  });
  return {
    pageContext: extra,
  };
}
