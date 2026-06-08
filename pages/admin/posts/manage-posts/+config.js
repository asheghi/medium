const defaultSiteTitle = process.env.VITE_SITE_TITLE || 'Blog';

export default {
  headersResponse: { 'Cache-Control': 'no-store' },
  title: `Dashboard - ${defaultSiteTitle}`,
};
