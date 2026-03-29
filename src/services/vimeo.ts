import { EmbedProvider, EmbedOptions } from '../types.js';

export const vimeo: EmbedProvider = {
  name: 'Vimeo',
  match: (url) => url.hostname.includes('vimeo.com'),
  generate: (url, options = {}) => {
    const videoId = url.pathname.slice(1).split('/')[0];
    if (!/^\d+$/.test(videoId)) return null;

    const src = `https://player.vimeo.com/video/${videoId}`;
    const cx = options.className ? ` class="${options.className}"` : '';
    return `<iframe${cx} src="${src}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
};