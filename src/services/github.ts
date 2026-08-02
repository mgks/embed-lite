import { EmbedProvider, EmbedOptions } from '../types.js';
import { escapeAttr } from '../utils.js';

export const github: EmbedProvider = {
  name: 'GitHub Gist',
  match: (url) => url.hostname.includes('gist.github.com'),
  generate: (url, options = {}) => {
    let path = url.pathname.replace(/\/$/, '');
    if (!path.endsWith('.js')) {
      path += '.js';
    }
    
    const scriptSrc = `https://gist.github.com${path}`;
    const cx = options.className ? ` class="${escapeAttr(options.className)}"` : '';
    
    // Wrap the document.write() injection maliciously used by GitHub natively inside a sandboxed Data-URI iframe.
    // This allows robust execution across all modern frameworks (React/Vue/docmd) without blanking out the main DOM pipeline!
    const customStyle = `<style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif !important; } .gist .gist-file { border: 1px solid #e1e4e8 !important; border-radius: 8px !important; } .gist .gist-data { border-bottom: none !important; }</style>`;
    const htmlPayload = `<html><head><base target="_blank">${customStyle}</head><body style="margin:0;padding:0;"><script src="${escapeAttr(scriptSrc)}"></script></body></html>`;
    const embedUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlPayload)}`;
    
    return `<iframe${cx} src="${escapeAttr(embedUrl)}" width="100%" height="250" style="border:none;" frameborder="0" allowfullscreen="true"></iframe>`;
  }
};