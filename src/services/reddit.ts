import { EmbedProvider, EmbedOptions } from '../types.js';

export const reddit: EmbedProvider = {
  name: 'Reddit',
  // e.g. https://www.reddit.com/r/.../comments/...
  match: (url) => url.hostname.includes('reddit.com') && url.pathname.includes('/comments/'),
  generate: (url, options = {}) => {
    // Reddit allows embedding via its secure blockquote script injection
    const cx = options.className ? ` class="${options.className}"` : '';
    
    return `
<blockquote${cx} class="reddit-embed-bq" data-embed-showedits="false">
    <a href="${url.href}"></a>
  </blockquote>
  <script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>`.trim();
  }
};