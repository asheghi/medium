export function title(pageContext) {
  return pageContext.is404 ? 'Page not Found!' : 'Server Crashed!';
}
