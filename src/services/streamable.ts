import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const streamable: EmbedProvider = {
  name: 'Streamable',
  match: (url) => url.hostname.includes('streamable.com'),
  generate: (url, options = {}) => {
    const videoId = url.pathname.slice(1).split(/[/?#]/)[0];
    if (!videoId) return null;
    const src = `https://streamable.com/e/${videoId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
  }
};
