import { EmbedProvider, EmbedOptions } from '../types.js';

export const linkedin: EmbedProvider = {
  name: 'LinkedIn',
  match: (url) => url.hostname.includes('linkedin.com') && (url.pathname.includes('/posts/') || url.pathname.includes('/feed/update/')),
  generate: (url, options = {}) => {
    let urn = '';
    
    if (url.pathname.includes('/feed/update/urn:li:')) {
      // Handles native embed URLs safely extracting raw URN formats
      urn = url.pathname.split('/feed/update/')[1]?.split(/[/?#]/)[0];
    } else {
      // Captures universally generated user post URLs identically resolving internal tracking types natively (e.g., ugcPost, activity, share)
      const match = url.pathname.match(/-(activity|ugcPost|share)-(\d+)/);
      if (match) {
        urn = `urn:li:${match[1]}:${match[2]}`;
      }
    }
    
    if (!urn) return null;

    const embedUrl = `https://www.linkedin.com/embed/feed/update/${urn}`;
    const cx = options.className ? ` class="${options.className}"` : '';
    
    // LinkedIn natively scales internally but bounds are structurally enforced via typical heights
    return `<iframe${cx} src="${embedUrl}" height="450" width="100%" frameborder="0" allowfullscreen="" title="Embedded LinkedIn Post"></iframe>`;
  }
};