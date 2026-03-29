export const figma = {
    name: 'Figma',
    // e.g. https://www.figma.com/file/xxxxx/title or https://www.figma.com/design/xxxxx
    match: (url) => url.hostname.includes('figma.com') && (url.pathname.includes('/file/') || url.pathname.includes('/design/') || url.pathname.includes('/proto/')),
    generate: (url, options = {}) => {
        // Figma provides a standard /embed endpoint where the url is passed as a query param
        const embedUrl = `https://www.figma.com/embed?embed_host=docmd&url=${encodeURIComponent(url.toString())}`;
        const cx = options.className ? ` class="${options.className}"` : '';
        return `<iframe${cx} style="border: none;" width="100%" height="450" src="${embedUrl}" allowfullscreen></iframe>`;
    }
};
