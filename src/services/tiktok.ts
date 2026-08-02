import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const tiktok: EmbedProvider = {
  name: 'TikTok',
  match: (url) => url.hostname.includes('tiktok.com') && url.pathname.includes('/video/'),
  generate: (url, options = {}) => {
    // Extract video ID accurately. E.g. https://www.tiktok.com/@username/video/123456789
    const videoId = url.pathname.split('/video/')[1]?.split(/[/?#]/)[0];
    if (!videoId) return null;
    // TikTok numeric IDs only; reject anything else to prevent attribute breakout.
    if (!/^\d+$/.test(videoId)) return null;
    
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    // TikTok natively exposes an incredibly robust /embed/v2 iframe router that eliminates embed.js blockages natively!
    return `<iframe${cx} src="https://www.tiktok.com/embed/v2/${escapeAttr(videoId)}" width="100%" height="700" frameborder="0" allowfullscreen></iframe>`;
  }
};