import { EmbedProvider, EmbedOptions } from '../types.js';

export const github: EmbedProvider = {
  name: 'GitHub Gist',
  match: (url) => url.hostname.includes('gist.github.com'),
  generate: (url, options = {}) => {
    let path = url.pathname.replace(/\/$/, '');
    if (!path.endsWith('.js')) {
      path += '.js';
    }
    
    const scriptSrc = `https://gist.github.com${path}`;
    const cx = options.className ? ` class="${options.className}"` : '';
    
    // Wrap the document.write() injection maliciously used by GitHub natively inside a sandboxed Data-URI iframe.
    // This allows robust execution across all modern frameworks (React/Vue/docmd) without blanking out the main DOM pipeline!
    const htmlPayload = `<html><head><base target="_blank"></head><body style="margin:0;padding:0;"><script src="${scriptSrc}"></script></body></html>`;
    const embedUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlPayload)}`;
    
    return `<iframe${cx} src="${embedUrl}" width="100%" height="250" style="border:none;" frameborder="0" allowfullscreen="true"></iframe>`;
  }
};