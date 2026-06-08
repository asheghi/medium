import { PrismaClient } from '@prisma/client';
import { getDebug } from '../../lib/utils';
import contentSanitizer from '../../server/lib/content-sanitizer.cjs';

const prisma = new PrismaClient();
const debug = getDebug('show-post', 'page');
const { sanitizePostHtml } = contentSanitizer;

export const passToClient = [];
export async function onBeforeRender(pageContext) {
  const { url, user, reqQuery } = pageContext;
  const slug = url.substring('/post/'.length, url.indexOf('?') > 0 ? url.indexOf('?') : url.length);
  const preview = reqQuery.preview ? reqQuery.preview !== 'false' : false;
  const extra = { preview };
  let post = await prisma.post.findFirst({ where: { slug } });
  // todo handle error from page context in server.js
  if (!post) extra.redirect = '/404';
  if (post && !post.published && !user) extra.redirect = '/404';
  if (preview && !user) extra.redirect = '/auth/login';
  if (preview && post && user) {
    post = { ...post, title: post.draftTitle, content: post.draftContent };
  }
  if (post && post.content) post.content = sanitizePostHtml(post.content);
  extra.post = post;
  return {
    pageContext: extra,
  };
}
