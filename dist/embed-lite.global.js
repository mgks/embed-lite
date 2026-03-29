"use strict";
var embedLite = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    embed: () => embed
  });

  // src/services/youtube.ts
  var youtube = {
    name: "YouTube",
    match: (url) => url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be"),
    generate: (url, options = {}) => {
      let videoId = "";
      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      } else {
        videoId = url.searchParams.get("v") || url.pathname.replace("/embed/", "");
      }
      if (!videoId) return null;
      let timeQuery = url.searchParams.get("t");
      let startQuery = "";
      if (timeQuery) {
        startQuery = `?start=${parseInt(timeQuery.replace(/\D/g, ""), 10)}`;
      }
      const src = `https://www.youtube.com/embed/${videoId}${startQuery}`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} src="${src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  };

  // src/services/vimeo.ts
  var vimeo = {
    name: "Vimeo",
    match: (url) => url.hostname.includes("vimeo.com"),
    generate: (url, options = {}) => {
      const videoId = url.pathname.slice(1).split("/")[0];
      if (!/^\d+$/.test(videoId)) return null;
      const src = `https://player.vimeo.com/video/${videoId}`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} src="${src}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  };

  // src/services/twitter.ts
  var twitter = {
    name: "Twitter",
    // Match x.com or twitter.com status links
    match: (url) => (url.hostname.includes("twitter.com") || url.hostname.includes("x.com")) && url.pathname.includes("/status/"),
    generate: (url, options = {}) => {
      const cx = options.className ? ` class="${options.className}"` : "";
      return `
<blockquote${cx} class="twitter-tweet">
    <a href="${url.href}"></a>
  </blockquote>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>`.trim();
    }
  };

  // src/services/spotify.ts
  var spotify = {
    name: "Spotify",
    match: (url) => url.hostname.includes("open.spotify.com"),
    generate: (url, options = {}) => {
      const path = url.pathname;
      if (!path.match(/^\/(track|album|playlist|episode|show)\/[a-zA-Z0-9]+/)) return null;
      const src = `https://open.spotify.com/embed${path}`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} style="border-radius:12px" src="${src}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
  };

  // src/services/codepen.ts
  var codepen = {
    name: "CodePen",
    // e.g. https://codepen.io/ghazi/pen/abcd
    match: (url) => url.hostname.includes("codepen.io") && url.pathname.includes("/pen/"),
    generate: (url, options = {}) => {
      const embedUrl = `https://codepen.io${url.pathname.replace("/pen/", "/embed/")}?default-tab=html%2Cresult`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} height="300" style="width: 100%; border: none;" scrolling="no" title="CodePen Embed" src="${embedUrl}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`;
    }
  };

  // src/services/figma.ts
  var figma = {
    name: "Figma",
    // e.g. https://www.figma.com/file/xxxxx/title or https://www.figma.com/design/xxxxx
    match: (url) => url.hostname.includes("figma.com") && (url.pathname.includes("/file/") || url.pathname.includes("/design/") || url.pathname.includes("/proto/")),
    generate: (url, options = {}) => {
      const embedUrl = `https://www.figma.com/embed?embed_host=docmd&url=${encodeURIComponent(url.toString())}`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} style="border: none;" width="100%" height="450" src="${embedUrl}" allowfullscreen></iframe>`;
    }
  };

  // src/services/reddit.ts
  var reddit = {
    name: "Reddit",
    // e.g. https://www.reddit.com/r/.../comments/...
    match: (url) => url.hostname.includes("reddit.com") && url.pathname.includes("/comments/"),
    generate: (url, options = {}) => {
      const cx = options.className ? ` class="${options.className}"` : "";
      return `
<blockquote${cx} class="reddit-embed-bq" data-embed-showedits="false">
    <a href="${url.href}"></a>
  </blockquote>
  <script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"><\/script>`.trim();
    }
  };

  // src/services/soundcloud.ts
  var soundcloud = {
    name: "SoundCloud",
    match: (url) => url.hostname.includes("soundcloud.com"),
    generate: (url, options = {}) => {
      const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="${embedUrl}"></iframe>`;
    }
  };

  // src/services/instagram.ts
  var instagram = {
    name: "Instagram",
    match: (url) => url.hostname.includes("instagram.com") && (url.pathname.includes("/p/") || url.pathname.includes("/reel/")),
    generate: (url, options = {}) => {
      const cx = options.className ? ` class="${options.className}"` : "";
      return `
<blockquote${cx} class="instagram-media" data-instgrm-permalink="${url.href}" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    <a href="${url.href}"></a>
  </blockquote>
  <script async src="https://www.instagram.com/embed.js"><\/script>`.trim();
    }
  };

  // src/services/facebook.ts
  var facebook = {
    name: "Facebook",
    match: (url) => url.hostname.includes("facebook.com") && (url.pathname.includes("/posts/") || url.pathname.includes("/videos/") || url.searchParams.has("v")),
    generate: (url, options = {}) => {
      const isVideo = url.pathname.includes("/videos/") || url.searchParams.has("v");
      const endpoint = isVideo ? "video.php" : "post.php";
      const embedUrl = `https://www.facebook.com/plugins/${endpoint}?href=${encodeURIComponent(url.toString())}&show_text=true`;
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} src="${embedUrl}" width="500" height="400" style="border:none;overflow:hidden;max-width:100%" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
    }
  };

  // src/services/googlemaps.ts
  var googlemaps = {
    name: "Google Maps",
    // Safely limit scope strictly to Maps "Share -> Embed a Map" natively generated iframes string formats.
    match: (url) => url.hostname.includes("google.com") && url.pathname.includes("/maps/embed") && url.searchParams.has("pb"),
    generate: (url, options = {}) => {
      const cx = options.className ? ` class="${options.className}"` : "";
      return `<iframe${cx} src="${url.toString()}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }
  };

  // src/services/index.ts
  var providers = [
    youtube,
    vimeo,
    twitter,
    spotify,
    codepen,
    figma,
    reddit,
    soundcloud,
    instagram,
    facebook,
    googlemaps
  ];

  // src/index.ts
  function embed(urlStr, options = {}) {
    try {
      const parsedUrl = new URL(urlStr);
      for (const provider of providers) {
        if (provider.match(parsedUrl)) {
          const html = provider.generate(parsedUrl, options);
          if (html) {
            return { html };
          }
        }
      }
    } catch (error) {
      return null;
    }
    return null;
  }
  return __toCommonJS(index_exports);
})();
