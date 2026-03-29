import { EmbedProvider, EmbedOptions } from '../types.js';

export const codepen: EmbedProvider = {
  name: 'CodePen',
  // e.g. https://codepen.io/ghazi/pen/abcd
  match: (url) => url.hostname.includes('codepen.io') && url.pathname.includes('/pen/'),
  generate: (url, options = {}) => {
    // Convert /pen/ to /embed/
    const embedUrl = `https://codepen.io${url.pathname.replace('/pen/', '/embed/')}?default-tab=html%2Cresult`;
    const cx = options.className ? ` class="${options.className}"` : '';
    
    return `<iframe${cx} height="300" style="width: 100%; border: none;" scrolling="no" title="CodePen Embed" src="${embedUrl}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`;
  }
};