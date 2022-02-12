import debug from 'debug';

export function parseAxiosError(error) {
  let msg = error.message || 'something_went_wrong';
  if (error.response) {
    const { headers, status, data } = error.response;
    if (data && data.errors && data.errors.length) {
      const [first] = data.errors;
      msg = first;
    }
    return {
      data,
      status,
      headers,
      msg,
    };
  } if (error.request) {
    return { req: error.request, msg };
  }
  return { msg };
}

export function getDebug(name, type) {
  let namespace = `app:${name}`;
  if (type) {
    namespace += `:${type}`;
  }
  return debug(namespace);
}

export function fixBackButtonReload() {
  if (import.meta.env.SSR) return;
  window.addEventListener('pageshow', (event) => {
    const historyTraversal = event.persisted
      || (typeof window.performance !== 'undefined'
        && window.performance.navigation.type === 2);
    if (historyTraversal) {
      // Handle page restore.
      window.location.reload();
    }
  });
}
