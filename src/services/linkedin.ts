import { EmbedProvider, EmbedOptions } from '../types.js';

export const linkedin: EmbedProvider = {
  name: 'LinkedIn',
  match: (url) => url.hostname.includes('linkedin.com') && (url.pathname.includes('/posts/') || url.pathname.includes('/feed/update/')),
  generate: (url, options = {}) => {
    let activityId = '';
    
    if (url.pathname.includes('/feed/update/urn:li:activity:')) {
      // Handles native embed URLs e.g. /feed/update/urn:li:activity:123456789
      activityId = url.pathname.split('urn:li:activity:')[1]?.split(/[/?#]/)[0];
    } else if (url.pathname.includes('-activity-')) {
      // Handles generic user post URLs e.g. /posts/username-activity-123456789-xyz
      activityId = url.pathname.split('-activity-')[1]?.split('-')[0];
    }
    
    if (!activityId) return null;

    const embedUrl = `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;
    const cx = options.className ? ` class="${options.className}"` : '';
    
    // LinkedIn natively scales internally but bounds are structurally enforced via typical heights
    return `<iframe${cx} src="${embedUrl}" height="450" width="100%" frameborder="0" allowfullscreen="" title="Embedded LinkedIn Post"></iframe>`;
  }
};