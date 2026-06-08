import { defaultSiteTitle } from '../../../../lib/config';

export function title(pageContext) {
  return `Edit Post - ${pageContext.data.post.title || defaultSiteTitle}`;
}
