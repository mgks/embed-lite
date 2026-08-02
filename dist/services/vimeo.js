import { escapeAttr } from '../utils.js';
export const vimeo = {
    name: 'Vimeo',
    match: (url) => url.hostname.includes('vimeo.com'),
    generate: (url, options = {}) => {
        const videoId = url.pathname.slice(1).split('/')[0];
        if (!/^\d+$/.test(videoId))
            return null;
        const src = `https://player.vimeo.com/video/${videoId}`;
        const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
        return `<iframe${cx} src="${escapeAttr(src)}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
};
