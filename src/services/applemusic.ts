import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const applemusic: EmbedProvider = {
  name: 'Apple Music',
  match: (url) => url.hostname.includes('music.apple.com'),
  generate: (url, options = {}) => {
    // Mirror the album/track path into the embed host
    const src = `https://embed.music.apple.com${url.pathname}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="175" frameborder="0" allow="autoplay *; encrypted-media *;"></iframe>`;
  }
};
