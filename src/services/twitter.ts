import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const twitter: EmbedProvider = {
  name: 'Twitter',
  // Match x.com or twitter.com status links
  match: (url) => (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) && url.pathname.includes('/status/'),
  generate: (url, options = {}) => {
    if (url.hostname === 'x.com' || url.hostname === 'www.x.com') {
        url.hostname = 'twitter.com';
    }
    const safeHref = escapeAttr(url.href);
    const cx = options.className ? ` ${escapeAttr(options.className)}` : '';
    // Twitter/X uses a standard blockquote + widgets.js payload for secure embedding without iframes.
    return `
<blockquote class="twitter-tweet${cx}">
    <a href="${safeHref}"></a>
  </blockquote>
  <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>`.trim();
  }
};