import { EmbedProvider, EmbedOptions } from '../types.js';

export const googlemaps: EmbedProvider = {
  name: 'Google Maps',
  // Safely limit scope strictly to Maps "Share -> Embed a Map" natively generated iframes string formats.
  match: (url) => url.hostname.includes('google.com') && url.pathname.includes('/maps/embed') && url.searchParams.has('pb'),
  generate: (url, options = {}) => {
    const cx = options.className ? ` class="${options.className}"` : '';
    // Map bounds are perfectly styled when aspect-ratio natively inherits from the docmd container.
    return `<iframe${cx} src="${url.toString()}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
};
