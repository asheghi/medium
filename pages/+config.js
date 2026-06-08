import vikeVue from 'vike-vue/config';

const defaultSiteDescription = process.env.VITE_SITE_DESCRIPTION || 'Blog using Vue and Vike';
const defaultSiteTitle = process.env.VITE_SITE_TITLE || 'Blog';

export default {
  clientRouting: false,
  description: defaultSiteDescription,
  extends: [vikeVue],
  favicon: '/fav-icon.svg',
  lang: 'en',
  title: defaultSiteTitle,
};
