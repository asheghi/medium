import moment from 'moment';
import { ax } from '../../../../lib/plugins/axios';

export const DRAFTS = 'drafts';
export const PUBLISHED = 'published';

export function getTitleLink(post, currentTab) {
  if (currentTab === DRAFTS) {
    return `/admin/post/${post.id}/edit`;
  }
  if (currentTab === PUBLISHED) {
    return `/post/${post.slug}`;
  }
  return '';
}

export async function deletePost(post) {
  const { status } = await ax.delete(`admin/posts/${post.id}`);
  if (status !== 200) throw new Error('failed to delete post');
  return post;
}
export async function unPublishPost(post) {
  const { data, status } = await ax.post(`admin/posts/${post.id}/unpublish`, {
    expectedVersion: post.version,
  });
  if (status !== 200) throw new Error('failed to unpublish post');
  return data;
}
export function formatDateTime(arg) {
  return moment(arg).fromNow();
}
