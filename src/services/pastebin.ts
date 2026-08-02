import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const pastebin: EmbedProvider = {
  name: 'Pastebin',
  match: (url) => url.hostname.includes('pastebin.com'),
  generate: (url, options = {}) => {
    // https://pastebin.com/abc123 -> /embed/abc123 (skip raw/ paths)
    const pasteId = url.pathname.slice(1).split(/[/?#]/)[0];
    if (!pasteId || pasteId === 'raw' || pasteId.length < 4) return null;
    const src = `https://pastebin.com/embed/${pasteId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="400" frameborder="0"></iframe>`;
  }
};
