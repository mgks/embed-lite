import { EmbedProvider, EmbedOptions } from '../types.js';

export const twitter: EmbedProvider = {
  name: 'Twitter',
  // Match x.com or twitter.com status links
  match: (url) => (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) && url.pathname.includes('/status/'),
  generate: (url, options = {}) => {
    const cx = options.className ? ` class="${options.className}"` : '';
    // Twitter/X uses a standard blockquote + widgets.js payload for secure embedding without iframes.
    return `
<blockquote${cx} class="twitter-tweet">
    <a href="${url.href}"></a>
  </blockquote>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`.trim();
  }
};