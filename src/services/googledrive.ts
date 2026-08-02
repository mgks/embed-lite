import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const googledrive: EmbedProvider = {
  name: 'Google Drive',
  match: (url) => url.hostname.includes('drive.google.com') && url.pathname.includes('/file/d/'),
  generate: (url, options = {}) => {
    // https://drive.google.com/file/d/ID/view -> /file/d/ID/preview
    const fileId = url.pathname.split('/file/d/')[1]?.split(/[/?#]/)[0];
    if (!fileId) return null;
    const src = `https://drive.google.com/file/d/${fileId}/preview`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
  }
};
