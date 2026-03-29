<div align="center">
<p>
  <img width="80" alt="Embed Lite Logo" src="https://github.com/mgks/embed-lite/blob/main/public/src/favicons/apple-touch-icon.png?raw=true" />
  <h1 align="center">Embed Lite</h1>
</p>

<p>
  <a href="https://npmjs.org/package/embed-lite"><img src="https://img.shields.io/npm/v/embed-lite.svg" alt="npm version"></a>
  <a href="https://bundlephobia.com/package/embed-lite"><img src="https://img.shields.io/bundlephobia/minzip/embed-lite" alt="Bundle Size"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
</p>

<p>
  <h4>
    <a href="https://embed.mgks.dev">🚀 Open Web App</a>
  </h4>
</p>
</div>

<br />

**Embed Lite** is an ultra-fast, zero-dependency Typescript and JavaScript library for statically mapping raw URLs directly into secure, ready-to-render HTML iframes or blockquotes entirely on the fly.

By totally dodging bulky asynchronous `oEmbed` network API calls, `embed-lite` achieves zero-latency renders across both the Browser and standard Node.js rendering pipelines simply by parsing regex matches.

## Getting Started

### 1. Usage via CDN (Browsers)
For simple web applications or zero-build environments, you can pull the massively optimized, minified bundle straight from `unpkg`. 

**Setup Instructions:**
```html
<!-- Inject the module payload -->
<script src="https://unpkg.com/embed-lite@latest/dist/embed-lite.global.min.js"></script>
```

**Implementation:**
Once loaded, the library natively exposes the `embedLite` object directly on your global `window`:
```html
<div id="video-container"></div>

<script>
  // Parse natively on the client
  const parsed = window.embedLite.embed("https://youtube.com/watch?v=123");
  
  // Inject the raw iframe string directly!
  if (parsed) {
     document.getElementById('video-container').innerHTML = parsed.html;
  }
</script>
```

### 2. Usage via NPM (Node.js / React / Vue)
If you are developing a modern framework or server-side parser (React, Express, Nuxt, etc), install the Typescript-compatible module dynamically.

**Setup Instructions:**
```bash
npm install embed-lite
```

**Implementation:**
```ts
import { embed } from 'embed-lite';

const targetUrl = "https://x.com/x/status/123";

// Map the URL into HTML, alongside custom CSS targeting classes
const result = embed(targetUrl, { className: 'my-social-embed' });

if (result) {
    console.log(result.html);
    // Returns explicitly isolated payload:
    // <blockquote class="twitter-tweet my-social-embed">...</blockquote>
}
```


## Supported Platforms

We currently actively process and intelligently map the following URLs into explicitly sanitized UI formats:

**Video Ecosystem**
- ✅ **YouTube** (Standard & `.youtu.be` variants)
- ✅ **Vimeo**
- ✅ **Dailymotion**
- ✅ **TikTok**

**Social Media**
- ✅ **Instagram** (Posts & Reels)
- ✅ **Facebook** (Posts & Video Plugins)
- ✅ **X / Twitter**
- ✅ **Reddit**

**Design & Code**
- ✅ **Codepen**
- ✅ **Figma**

**Audio & Mapping**
- ✅ **Spotify** (Tracks, Playlists, Episodes)
- ✅ **SoundCloud**
- ✅ **Google Maps**

## API Reference

### `embed(url: string, options?: EmbedOptions): { html: string } | null`
This is the core mapping payload function. It rigidly parses the incoming `url` parameter and maps it against every platform plugin linearly.

**Arguments:**
- `url` *(required)*: The raw string representation of the target URL.
- `options.className` *(optional)*: Injects a CSS class safely into the root HTML tag (e.g., the root `<iframe>` or `<blockquote>`), allowing you to completely define sizing and bounding boxes downstream.

**Returns:**
- Object containing the rendered `{ html: string }` if a plugin caught and verified the pattern.
- `null` if the URL schema is explicitly unsupported or malformed.

## Extensibility & Architecture
`embed-lite` inherently relies on a decoupled Service Plugin architecture. To support new platforms natively, you just simply declare an object honoring the `EmbedProvider` Typescript Interface:
```ts
export const customService: EmbedProvider = {
  name: 'Service Name',
  match: (url) => url.hostname.includes('example.com'),
  generate: (url, options) => {
    return `<iframe class="${options.className || ''}" src="..."></iframe>`;
  }
}
```
*(We actively process Pull Requests for major new platforms! Please consider contributing if you add custom layers!)*

## Community & Support

- **Maintainer**: [@mgks](https://mgks.dev)
- **Support the Project**: If `embed-lite` saved you from integrating bulky SDK tools, please consider dropping a ⭐ and consider [sponsoring the project](https://github.com/sponsors/mgks).

## License
Distributed under the MIT License. See `LICENSE` for more information.

![Website Badge](https://img.shields.io/badge/.*%20mgks.dev-blue?style=flat&link=https%3A%2F%2Fmgks.dev) ![Sponsor Badge](https://img.shields.io/badge/%20%20Become%20a%20Sponsor%20%20-red?style=flat&logo=github&link=https%3A%2F%2Fgithub.com%2Fsponsors%2Fmgks)