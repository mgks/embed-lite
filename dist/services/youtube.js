export const youtube = {
    name: 'YouTube',
    match: (url) => url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be'),
    generate: (url, options = {}) => {
        let videoId = '';
        if (url.hostname.includes('youtu.be')) {
            videoId = url.pathname.slice(1);
        }
        else {
            videoId = url.searchParams.get('v') || url.pathname.replace('/embed/', '');
        }
        if (!videoId)
            return null;
        let timeQuery = url.searchParams.get('t');
        let startQuery = '';
        if (timeQuery) {
            startQuery = `?start=${parseInt(timeQuery.replace(/\D/g, ''), 10)}`;
        }
        const src = `https://www.youtube.com/embed/${videoId}${startQuery}`;
        const cx = options.className ? ` class="${options.className}"` : '';
        return `<iframe${cx} src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
};
