import { stringify, parse } from 'qs';
import { ax } from '../../lib/plugins/axios';
import { postsPerPage } from '../../lib/config';
import { getDebug, parseAxiosError } from '../../lib/utils';

const debug = getDebug('home', 'server');
export const passToClient = ['pageProps', 'urlPathname', 'posts', 'pagination'];

export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const queryParams = parse(url.substring(url.indexOf('?') + 1));
  const page = queryParams && queryParams.page || 1;
  const extra = {};
  const query = stringify({
    sort: ['publishedAt:desc'],
    populate: '*',
    pagination: {
      pageSize: postsPerPage,
      page,
    },
  }, {
    encodeValuesOnly: true, // prettify url
  });
  try {
    const { data, status } = await ax.get(`posts?${query}`);
    if (status === 200) {
      extra.posts = data.data.map((it) => ({
        ...it.attributes,
        id: it.id,
      }));
      extra.pagination = data.meta.pagination;
    } else {
      debug('api response status is not ok!', status, data);
    }
  } catch (e) {
    debug(parseAxiosError(e));
  }
  return {
    pageContext: extra,
  };
}
