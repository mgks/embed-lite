import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const bilibili: EmbedProvider = {
  name: 'Bilibili',
  match: (url) => url.hostname.includes('bilibili.com'),
  generate: (url, options = {}) => {
    // Extract bvid from /video/BVxxxxxx path
    const bvid = url.pathname.split('/video/')[1]?.split(/[/?#]/)[0];
    if (!bvid || !bvid.startsWith('BV')) return null;
    const src = `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen scrolling="no"></iframe>`;
  }
};
