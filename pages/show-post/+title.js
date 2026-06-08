import { defaultSiteTitle } from '../../lib/config';

export function title(pageContext) {
  const { post } = pageContext.data;
  return post ? `${post.title} - ${defaultSiteTitle}` : defaultSiteTitle;
}
