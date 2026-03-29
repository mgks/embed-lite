import { EmbedProvider, EmbedOptions } from '../types.js';

export const instagram: EmbedProvider = {
  name: 'Instagram',
  match: (url) => url.hostname.includes('instagram.com') && (url.pathname.includes('/p/') || url.pathname.includes('/reel/')),
  generate: (url, options = {}) => {
    const cx = options.className ? ` class="${options.className}"` : '';
    // Instagram cleanly handles natively rendered blockquotes via embed.js
    return `
<blockquote${cx} class="instagram-media" data-instgrm-permalink="${url.href}" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    <a href="${url.href}"></a>
  </blockquote>
  <script async src="https://www.instagram.com/embed.js"></script>`.trim();
  }
};
