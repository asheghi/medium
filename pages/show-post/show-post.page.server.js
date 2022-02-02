import { stringify } from 'qs';
import { marked } from 'marked';
import { ax } from '../../lib/plugins/axios';
import { getDebug, parseAxiosError } from '../../lib/utils';

const debug = getDebug('show-post', 'page');

export const passToClient = ['post'];
export async function onBeforeRender(pageContext) {
  const { url } = pageContext;
  const slug = url.substring('/post/'.length);
  const extra = {};
  const query = stringify({
    populate: '*',
    filter: {
      slug: {
        $eq: slug,
      },
    },
    pagination: {
      pageSize: 1,
    },
  }, {
    encodeValuesOnly: true, // prettify url
  });
  try {
    const { data, status } = await ax.get(`posts?${query}`);
    if (status === 200) {
      [extra.post] = data.data.map((it) => ({
        ...it.attributes,
        content: marked.parse(it.attributes.content || ''),
      }));
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
