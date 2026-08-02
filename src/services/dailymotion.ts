import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const dailymotion: EmbedProvider = {
  name: 'Dailymotion',
  match: (url) => url.hostname.includes('dailymotion.com'),
  generate: (url, options = {}) => {
    const videoId = url.pathname.split('/video/')[1]?.split(/[/?#&_]/)[0];
    if (!videoId) return null;
    const src = `https://www.dailymotion.com/embed/video/${videoId}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>`;
  }
};
