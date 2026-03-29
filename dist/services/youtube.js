export const youtube = {
    name: 'YouTube',
    match: (url) => url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be'),
    generate: (url, options = {}) => {
        let videoId = '';
        let isShort = false;
        if (url.hostname.includes('youtu.be')) {
            videoId = url.pathname.slice(1);
        }
        else if (url.pathname.includes('/shorts/')) {
            videoId = url.pathname.split('/shorts/')[1].split(/[/?#]/)[0];
            isShort = true;
        }
        else {
            videoId = url.searchParams.get('v') || url.pathname.replace(/^\/embed\//, '');
        }
        videoId = videoId?.split(/[?&#/]/)[0]; // Sanitize edge cases
        if (!videoId)
            return null;
        let timeQuery = url.searchParams.get('t');
        let startQuery = '';
        if (timeQuery) {
            startQuery = `?start=${parseInt(timeQuery.replace(/\D/g, ''), 10)}`;
        }
        const src = `https://www.youtube.com/embed/${videoId}${startQuery}`;
        const cx = options.className ? ` class="${options.className}"` : '';
        const shortAttr = isShort ? 'data-short="true" ' : '';
        return `<iframe${cx} ${shortAttr}src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
};
