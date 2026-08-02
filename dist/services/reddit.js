import { escapeAttr } from '../utils.js';
export const reddit = {
    name: 'Reddit',
    // e.g. https://www.reddit.com/r/.../comments/...
    match: (url) => url.hostname.includes('reddit.com') && url.pathname.includes('/comments/'),
    generate: (url, options = {}) => {
        // Reddit allows embedding via its secure blockquote script injection
        const safeHref = escapeAttr(url.href);
        const cx = options.className ? ` ${escapeAttr(options.className)}` : '';
        return `
<blockquote class="reddit-embed-bq${cx}" data-embed-showedits="false">
    <a href="${safeHref}"></a>
  </blockquote>
  <script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>`.trim();
    }
};
