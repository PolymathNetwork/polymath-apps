// @flow

/**
 * Remove the trailing slash from an URL (for use in constants.js)
 *
 * @param {string} url
 *
 * @returns {string} an URL without the trailing slash
 */
export const normalizeURL = (url: string) => url.replace(/\/$/, '');
