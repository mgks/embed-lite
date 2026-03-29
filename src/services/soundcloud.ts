import { EmbedProvider, EmbedOptions } from '../types.js';

export const soundcloud: EmbedProvider = {
  name: 'SoundCloud',
  match: (url) => url.hostname.includes('soundcloud.com'),
  generate: (url, options = {}) => {
    // SC native oEmbed requires URL encoding. Typical embed path:
    // https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/ID&...
    // But SC embed widget gracefully handles raw permalinks:
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    const cx = options.className ? ` class="${options.className}"` : '';
    
    return `<iframe${cx} width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="${embedUrl}"></iframe>`;
  }
};
