export default (pageContext) => {
  const { urlPathname } = pageContext;
  if (urlPathname === '/') {
    return {
      routeParams: {
        page: '1',
      },
    };
  }
  const path = urlPathname.split('/');
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
