export const spotify = {
    name: 'Spotify',
    match: (url) => url.hostname.includes('open.spotify.com'),
    generate: (url, options = {}) => {
        // Example: https://open.spotify.com/track/123 -> https://open.spotify.com/embed/track/123
        const path = url.pathname;
        if (!path.match(/^\/(track|album|playlist|episode|show)\/[a-zA-Z0-9]+/))
            return null;
        const src = `https://open.spotify.com/embed${path}`;
        const cx = options.className ? ` class="${options.className}"` : '';
        // Spotify embeds are usually fixed height depending on type, but we enforce wrapper boundaries
        return `<iframe${cx} style="border-radius:12px" src="${src}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
};
