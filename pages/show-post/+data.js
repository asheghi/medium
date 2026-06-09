import { redirect, render } from 'vike/abort';
import contentSanitizer from '../../server/lib/content-sanitizer.cjs';
import prismaModule from '../../server/lib/prisma';

const { prisma } = prismaModule;
const { sanitizePostHtml } = contentSanitizer;

export async function data(pageContext) {
  const { reqQuery, routeParams, user } = pageContext;
  const slug = routeParams['*'];
  const preview = reqQuery.preview ? reqQuery.preview !== 'false' : false;
  let post = await prisma.post.findFirst({ where: { slug } });
  if (!post || (post.status !== 'PUBLISHED' && !user)) throw render(404);
  if (preview && !user) throw redirect('/auth/login');
  if (preview && post && user) {
    post = { ...post, title: post.draftTitle, content: post.draftContent };
  }
  if (post && post.content) post.content = sanitizePostHtml(post.content);
  if (post) post.published = post.status === 'PUBLISHED';
  return { post, preview };
}
