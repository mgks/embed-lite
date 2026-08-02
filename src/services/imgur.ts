import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const imgur: EmbedProvider = {
  name: 'Imgur',
  match: (url) => url.hostname.includes('imgur.com') && url.pathname.includes('/a/'),
  generate: (url, options = {}) => {
    // https://imgur.com/a/ID -> https://imgur.com/a/ID/embed/pubsimple
    const albumId = url.pathname.split('/a/')[1]?.split(/[/?#]/)[0];
    if (!albumId) return null;
    const src = `https://imgur.com/a/${albumId}/embed/pubsimple`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="500" frameborder="0" allowfullscreen></iframe>`;
  }
};
