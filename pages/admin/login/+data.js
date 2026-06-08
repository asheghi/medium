import { PrismaClient } from '@prisma/client';
import { redirect } from 'vike/abort';

const prisma = new PrismaClient();

export async function data() {
  const hasSetup = await prisma.user.findFirst();
  if (!hasSetup) {
    throw redirect('/setup');
  }
  return {};
}
