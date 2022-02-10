import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function onBeforeRender() {
  const hasSetup = await prisma.user.findFirst();
  if (!hasSetup) {
    return {
      pageContext: {
        redirect: '/setup',
      },
    };
  }
  return null;
}
