import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const wistia: EmbedProvider = {
  name: 'Wistia',
  match: (url) => url.hostname.includes('wistia.com') || url.hostname.includes('wi.st'),
  generate: (url, options = {}) => {
    // Extract hashed ID from /medias/ID path
    const mediaId = url.pathname.split('/medias/')[1]?.split(/[/?#]/)[0];
    if (!mediaId) return null;
    const src = `https://fast.wistia.net/embed/iframe/${mediaId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
  }
};
