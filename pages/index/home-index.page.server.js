import { stringify, parse } from 'qs';
import { marked } from 'marked';
import { ax } from '../../lib/plugins/axios';
import { postsPerPage } from '../../lib/config';
import { getDebug, parseAxiosError } from '../../lib/utils';

const debug = getDebug('home', 'server');
export const passToClient = ['pageProps', 'urlPathname', 'posts', 'pagination'];

export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const queryParams = parse(url.substring(url.indexOf('?') + 1));
  const page = queryParams.page || 1;
  const extra = {};
  const query = stringify({
    sort: ['publishedAt:desc'],
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
      extra.posts = data.data.map((it) => ({ ...it.attributes, id: it.id }))
        .map((it) => ({ ...it, content: marked.parse(it.content || '') }));
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
