export function headersResponse(pageContext) {
  const { post, preview } = pageContext.data;
  return {
    'Cache-Control': preview || !post.published ? 'no-store' : 'public, max-age=300',
  };
}
