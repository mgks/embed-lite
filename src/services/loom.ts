import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const loom: EmbedProvider = {
  name: 'Loom',
  match: (url) => url.hostname.includes('loom.com'),
  generate: (url, options = {}) => {
    // https://www.loom.com/share/ID -> https://www.loom.com/embed/ID
    const videoId = url.pathname.split('/share/')[1]?.split(/[/?#]/)[0];
    if (!videoId) return null;
    const src = `https://www.loom.com/embed/${videoId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
  }
};
