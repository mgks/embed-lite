import { EmbedProvider, EmbedOptions } from '../types.js';

export const facebook: EmbedProvider = {
  name: 'Facebook',
  match: (url) => url.hostname.includes('facebook.com') && (url.pathname.includes('/posts/') || url.pathname.includes('/videos/') || url.searchParams.has('v')),
  generate: (url, options = {}) => {
    // Determine context (post/video) and select Facebook's appropriate social PHP plugin
    const isVideo = url.pathname.includes('/videos/') || url.searchParams.has('v');
    const endpoint = isVideo ? 'video.php' : 'post.php';
    const embedUrl = `https://www.facebook.com/plugins/${endpoint}?href=${encodeURIComponent(url.toString())}&show_text=true`;
    
    const cx = options.className ? ` class="${options.className}"` : '';
    // Facebook iframes normally require dynamic sizing, so we constrain its width strictly.
    return `<iframe${cx} src="${embedUrl}" width="500" height="400" style="border:none;overflow:hidden;max-width:100%" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
  }
};
