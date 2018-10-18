// @flow

import { URL } from 'url';

/**
 * Compose url from base and path handling trailing slashes in the base
 *
 * @param {string} base base URL
 * @param {string} path absolute or relative path
 *
 * @returns {string} a composed URL
 *
 * Behavior differs whether path is absolute (leading slash) or relative (no leading slash)
 *
 * Examples:
 *   - composeUrl('https://some.website/', '/absolute/path') returns 'https://some.website/absolute/path'
 *   - composeUrl('https://some.website/', 'relative/path') returns 'https://some.website/relative/path'
 *   - composeUrl('https://some.website/with/path', '/absolute/path') returns 'https://some.website/absolute/path'
 *   - composeUrl('https://some.website/with/path', 'relative/path') returns 'https://some.website/with/path/relative/path'
 */
export const composeURL = (base: string, path: string) =>
  new URL(path, base).href;
