export const twitter = {
    name: 'Twitter',
    // Match x.com or twitter.com status links
    match: (url) => (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) && url.pathname.includes('/status/'),
    generate: (url, options = {}) => {
        if (url.hostname === 'x.com' || url.hostname === 'www.x.com') {
            url.hostname = 'twitter.com';
        }
        const cx = options.className ? ` class="${options.className}"` : '';
        // Twitter/X uses a standard blockquote + widgets.js payload for secure embedding without iframes.
        return `
<blockquote${cx} class="twitter-tweet">
    <a href="${url.href}"></a>
  </blockquote>
  <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>`.trim();
    }
};
