import { defaultSiteTitle } from '../../lib/config';

export function title(pageContext) {
  const { page } = pageContext.data;
  return page > 1
    ? `${defaultSiteTitle} - Page ${page}`
    : `${defaultSiteTitle} - Home Page`;
}
