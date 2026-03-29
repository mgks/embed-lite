import { EmbedProvider, EmbedOptions } from '../types.js';

export const tiktok: EmbedProvider = {
  name: 'TikTok',
  match: (url) => url.hostname.includes('tiktok.com') && url.pathname.includes('/video/'),
  generate: (url, options = {}) => {
    // Extract video ID accurately. E.g. https://www.tiktok.com/@username/video/123456789
    const videoId = url.pathname.split('/video/')[1]?.split(/[/?#]/)[0];
    if (!videoId) return null;
    
    const cx = options.className ? ` ${options.className}` : '';
    // TikTok heavily relies on their native embed.js script interpreting the blockquote perfectly!
    return `
<blockquote class="tiktok-embed${cx}" cite="${url.href}" data-video-id="${videoId}" style="max-width: 605px; min-width: 325px;">
    <section>
      <a target="_blank" title="Watch on TikTok" href="${url.href}">Watch on TikTok</a>
    </section>
  </blockquote>
  <script async src="https://www.tiktok.com/embed.js"></script>`.trim();
  }
};