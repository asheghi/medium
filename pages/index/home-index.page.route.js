export default (pageContext) => {
  const { url } = pageContext;
  if (url === '/') {
    return {
      routeParams: {
        page: '1',
      },
    };
  }
  const path = url.split('/');
  if (path[1] === 'page' && path.length === 3) {
    const pageStr = path[2];
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(pageStr)) return false;
    return {
      routeParams: {
        page: pageStr,
      },
    };
  }
  return false;
};
