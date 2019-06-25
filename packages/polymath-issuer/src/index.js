/**
 * This code is here to enable the progressive migration from Legacy to Modern.
 * There are several levels in which Modern can replace Legacy functionality
 * for a given route:
 * 1. App level: Runs Modern on its own, Legacy is not used for this route
 * 2. Router level: A subtree of Legacy is replaced by a subtree imported
 * from Modern.
 *
 * There are two main capabilities that this setup allows:
 * 1. To render the Modern or Legacy dApp depending on the current route.
 * 2. To transform routes before mounting either app.
 *
 * NOTE: In theory we could also have logic to resolve values required for the
 * redirected route that might not exist yet. Though this would require, an
 * extra initialization step that might complicate things, so if possible lets
 * avoid it.
 */

const redirectors = [
  /*
  Example:

  {
    pattern: /dashboard\/(.+)\/dividends/,
    makeRoute: (params: string[]) => {
      const [symbol] = params;
      return `/securityTokens/${symbol}/dividends`;
    },
  },
  
  */
  // {
  //   pattern: /securityTokens\/(.+)\/checkpoints\/(.+)\/dividends\/new/,
  //   makeRoute: (params: string[]) => {
  //     const [symbol, checkpointId, dividendId] = params;
  //     return `/dashboard/${symbol}/checkpoints/${checkpointId}/dividends/new`;
  //   },
  // },
];

/**
 * This is a map that determines wether the Legacy or the Modern App
 * should be mounted. If there's no match, we default to Legacy.
 */
const modernAppRoutePatterns = [
  // Example: /securityTokens\/(.+)\/dividends/
];

function getRoutePath() {
  return window.location.href
    .split('/')
    .slice(3)
    .join('/');
}

function initializeApp() {
  // See if there is a redirection match and get the redirection route
  // if so.
  const path = getRoutePath();

  let redirectionMatch;
  let matchingRedirector;
  redirectors.forEach(redirector => {
    if (redirectionMatch) {
      return;
    }

    redirectionMatch = path.match(redirector.pattern);
    matchingRedirector = redirector;
  });

  // If there's no redirection we render the proper app
  if (!redirectionMatch) {
    mountApp();
    return;
  }

  // Parse parameters from redirector's regex
  const params = redirectionMatch.slice(1);
  const targetUrl = matchingRedirector.makeRoute(params);

  // Redirect to route defined by redirector
  window.location = targetUrl;
}

// Mounts the right app depending on the current route
function mountApp() {
  const path = getRoutePath();
  let match;
  modernAppRoutePatterns.forEach(pattern => {
    if (match) {
      return;
    }
    match = path.match(pattern);
  });

  if (match) {
    console.log('Mounting: Modern dApp');
    require('./mountModern');
    return;
  }

  console.log('Mounting: Legacy dApp');
  require('./mountLegacy');
}

initializeApp();
