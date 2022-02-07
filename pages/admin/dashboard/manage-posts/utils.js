import moment from 'moment';
import { ax } from '../../../../lib/plugins/axios';

export function getTitleLink(post) {
  if (!post.published) {
    return `/admin/post/${post.id}/edit`;
  }
  if (post.published) {
    return `/post/${post.slug}`;
  }
  return '';
}

export async function deletePost(post) {
  const { data, status } = await ax.delete(`posts/${post.id}`);
  if (status !== 200) throw new Error('failed to delete post');
  return post;
}
export async function unPublishPost(post) {
  const { data, status } = await ax.post(`posts/unpublish/${post.id}`);
  if (status !== 200) throw new Error('failed to delete post');
  return post;
}
export function formatDateTime(arg) {
  return moment(arg).fromNow();
}
