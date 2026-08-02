import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const giphy: EmbedProvider = {
  name: 'Giphy',
  match: (url) => url.hostname.includes('giphy.com'),
  generate: (url, options = {}) => {
    // Handles two URL shapes:
    //   giphy.com/gifs/title-slug-ID  (ID is the trailing alphanumeric token)
    //   giphy.com/embed/ID            (direct embed)
    let gifId;
    if (url.pathname.includes('/embed/')) {
      gifId = url.pathname.split('/embed/')[1]?.split(/[/?#]/)[0];
    } else {
      // /gifs/segment -> take the last segment, then the trailing ID after the last dash
      const segment = url.pathname.split('/gifs/')[1]?.split(/[/?#]/)[0];
      gifId = segment?.split('-').pop();
    }
    if (!gifId) return null;
    const src = `https://giphy.com/embed/${gifId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="480" height="360" frameborder="0" allowfullscreen></iframe>`;
  }
};
