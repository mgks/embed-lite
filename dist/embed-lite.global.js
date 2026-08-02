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

  // src/utils.ts
  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // src/services/youtube.ts
  var youtube = {
    name: "YouTube",
    match: (url) => url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be"),
    generate: (url, options = {}) => {
      let videoId = "";
      let isShort = false;
      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      } else if (url.pathname.includes("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1].split(/[/?#]/)[0];
        isShort = true;
      } else {
        videoId = url.searchParams.get("v") || url.pathname.replace(/^\/embed\//, "");
      }
      if (!/^[A-Za-z0-9_-]{6,}$/.test(videoId)) return null;
      let timeQuery = url.searchParams.get("t");
      let startQuery = "";
      if (timeQuery) {
        startQuery = `?start=${parseInt(timeQuery.replace(/\D/g, ""), 10)}`;
      }
      const src = `https://www.youtube.com/embed/${videoId}${startQuery}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      const shortAttr = isShort ? 'data-short="true" ' : "";
      return `<iframe${cx} ${shortAttr}src="${escapeAttr(src)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
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
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  };

  // src/services/twitter.ts
  var twitter = {
    name: "Twitter",
    // Match x.com or twitter.com status links
    match: (url) => (url.hostname.includes("twitter.com") || url.hostname.includes("x.com")) && url.pathname.includes("/status/"),
    generate: (url, options = {}) => {
      if (url.hostname === "x.com" || url.hostname === "www.x.com") {
        url.hostname = "twitter.com";
      }
      const safeHref = escapeAttr(url.href);
      const cx = options.className ? ` ${escapeAttr(options.className)}` : "";
      return `
<blockquote class="twitter-tweet${cx}">
    <a href="${safeHref}"></a>
  </blockquote>
  <script async src="https://platform.x.com/widgets.js" charset="utf-8"><\/script>`.trim();
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
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} style="border-radius:12px" src="${escapeAttr(src)}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
  };

  // src/services/codepen.ts
  var codepen = {
    name: "CodePen",
    // e.g. https://codepen.io/ghazi/pen/abcd
    match: (url) => url.hostname.includes("codepen.io") && url.pathname.includes("/pen/"),
    generate: (url, options = {}) => {
      const embedUrl = `https://codepen.io${url.pathname.replace("/pen/", "/embed/")}?default-tab=html%2Cresult`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} height="300" style="width: 100%; border: none;" scrolling="no" title="CodePen Embed" src="${escapeAttr(embedUrl)}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`;
    }
  };

  // src/services/figma.ts
  var figma = {
    name: "Figma",
    // e.g. https://www.figma.com/file/xxxxx/title or https://www.figma.com/design/xxxxx
    match: (url) => url.hostname.includes("figma.com") && (url.pathname.includes("/file/") || url.pathname.includes("/design/") || url.pathname.includes("/proto/")),
    generate: (url, options = {}) => {
      const embedUrl = `https://www.figma.com/embed?embed_host=docmd&url=${encodeURIComponent(url.toString())}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} style="border: none;" width="100%" height="450" src="${escapeAttr(embedUrl)}" allowfullscreen></iframe>`;
    }
  };

  // src/services/reddit.ts
  var reddit = {
    name: "Reddit",
    // e.g. https://www.reddit.com/r/.../comments/...
    match: (url) => url.hostname.includes("reddit.com") && url.pathname.includes("/comments/"),
    generate: (url, options = {}) => {
      const safeHref = escapeAttr(url.href);
      const cx = options.className ? ` ${escapeAttr(options.className)}` : "";
      return `
<blockquote class="reddit-embed-bq${cx}" data-embed-showedits="false">
    <a href="${safeHref}"></a>
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
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="${escapeAttr(embedUrl)}"></iframe>`;
    }
  };

  // src/services/instagram.ts
  var instagram = {
    name: "Instagram",
    match: (url) => url.hostname.includes("instagram.com") && (url.pathname.includes("/p/") || url.pathname.includes("/reel/")),
    generate: (url, options = {}) => {
      const safeHref = escapeAttr(url.href);
      const cx = options.className ? ` ${escapeAttr(options.className)}` : "";
      return `
<blockquote class="instagram-media${cx}" data-instgrm-permalink="${safeHref}" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
    <a href="${safeHref}"></a>
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
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(embedUrl)}" width="500" height="400" style="border:none;overflow:hidden;max-width:100%" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
    }
  };

  // src/services/googlemaps.ts
  var googlemaps = {
    name: "Google Maps",
    // Safely limit scope strictly to Maps "Share -> Embed a Map" natively generated iframes string formats.
    match: (url) => url.hostname.includes("google.com") && url.pathname.includes("/maps/embed") && url.searchParams.has("pb"),
    generate: (url, options = {}) => {
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(url.toString())}" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }
  };

  // src/services/tiktok.ts
  var tiktok = {
    name: "TikTok",
    match: (url) => url.hostname.includes("tiktok.com") && url.pathname.includes("/video/"),
    generate: (url, options = {}) => {
      const videoId = url.pathname.split("/video/")[1]?.split(/[/?#]/)[0];
      if (!videoId) return null;
      if (!/^\d+$/.test(videoId)) return null;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="https://www.tiktok.com/embed/v2/${escapeAttr(videoId)}" width="100%" height="700" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/github.ts
  var github = {
    name: "GitHub Gist",
    match: (url) => url.hostname.includes("gist.github.com"),
    generate: (url, options = {}) => {
      let path = url.pathname.replace(/\/$/, "");
      if (!path.endsWith(".js")) {
        path += ".js";
      }
      const scriptSrc = `https://gist.github.com${path}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      const customStyle = `<style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif !important; } .gist .gist-file { border: 1px solid #e1e4e8 !important; border-radius: 8px !important; } .gist .gist-data { border-bottom: none !important; }</style>`;
      const htmlPayload = `<html><head><base target="_blank">${customStyle}</head><body style="margin:0;padding:0;"><script src="${escapeAttr(scriptSrc)}"><\/script></body></html>`;
      const embedUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlPayload)}`;
      return `<iframe${cx} src="${escapeAttr(embedUrl)}" width="100%" height="250" style="border:none;" frameborder="0" allowfullscreen="true"></iframe>`;
    }
  };

  // src/services/linkedin.ts
  var linkedin = {
    name: "LinkedIn",
    match: (url) => url.hostname.includes("linkedin.com") && (url.pathname.includes("/posts/") || url.pathname.includes("/feed/update/")),
    generate: (url, options = {}) => {
      let urn = "";
      if (url.pathname.includes("/feed/update/urn:li:")) {
        urn = url.pathname.split("/feed/update/")[1]?.split(/[/?#]/)[0];
      } else {
        const match = url.pathname.match(/-(activity|ugcPost|share)-(\d+)/);
        if (match) {
          urn = `urn:li:${match[1]}:${match[2]}`;
        }
      }
      if (!urn) return null;
      const embedUrl = `https://www.linkedin.com/embed/feed/update/${urn}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(embedUrl)}" height="450" width="100%" frameborder="0" allowfullscreen="" title="Embedded LinkedIn Post"></iframe>`;
    }
  };

  // src/services/dailymotion.ts
  var dailymotion = {
    name: "Dailymotion",
    match: (url) => url.hostname.includes("dailymotion.com"),
    generate: (url, options = {}) => {
      const videoId = url.pathname.split("/video/")[1]?.split(/[/?#&_]/)[0];
      if (!videoId) return null;
      const src = `https://www.dailymotion.com/embed/video/${videoId}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture"></iframe>`;
    }
  };

  // src/services/bilibili.ts
  var bilibili = {
    name: "Bilibili",
    match: (url) => url.hostname.includes("bilibili.com"),
    generate: (url, options = {}) => {
      const bvid = url.pathname.split("/video/")[1]?.split(/[/?#]/)[0];
      if (!bvid || !bvid.startsWith("BV")) return null;
      const src = `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen scrolling="no"></iframe>`;
    }
  };

  // src/services/loom.ts
  var loom = {
    name: "Loom",
    match: (url) => url.hostname.includes("loom.com"),
    generate: (url, options = {}) => {
      const videoId = url.pathname.split("/share/")[1]?.split(/[/?#]/)[0];
      if (!videoId) return null;
      const src = `https://www.loom.com/embed/${videoId}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/applemusic.ts
  var applemusic = {
    name: "Apple Music",
    match: (url) => url.hostname.includes("music.apple.com"),
    generate: (url, options = {}) => {
      const src = `https://embed.music.apple.com${url.pathname}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="175" frameborder="0" allow="autoplay *; encrypted-media *;"></iframe>`;
    }
  };

  // src/services/giphy.ts
  var giphy = {
    name: "Giphy",
    match: (url) => url.hostname.includes("giphy.com"),
    generate: (url, options = {}) => {
      let gifId;
      if (url.pathname.includes("/embed/")) {
        gifId = url.pathname.split("/embed/")[1]?.split(/[/?#]/)[0];
      } else {
        const segment = url.pathname.split("/gifs/")[1]?.split(/[/?#]/)[0];
        gifId = segment?.split("-").pop();
      }
      if (!gifId) return null;
      const src = `https://giphy.com/embed/${gifId}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="480" height="360" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/streamable.ts
  var streamable = {
    name: "Streamable",
    match: (url) => url.hostname.includes("streamable.com"),
    generate: (url, options = {}) => {
      const videoId = url.pathname.slice(1).split(/[/?#]/)[0];
      if (!videoId) return null;
      const src = `https://streamable.com/e/${videoId}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/wistia.ts
  var wistia = {
    name: "Wistia",
    match: (url) => url.hostname.includes("wistia.com") || url.hostname.includes("wi.st"),
    generate: (url, options = {}) => {
      const mediaId = url.pathname.split("/medias/")[1]?.split(/[/?#]/)[0];
      if (!mediaId) return null;
      const src = `https://fast.wistia.net/embed/iframe/${mediaId}`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/googledrive.ts
  var googledrive = {
    name: "Google Drive",
    match: (url) => url.hostname.includes("drive.google.com") && url.pathname.includes("/file/d/"),
    generate: (url, options = {}) => {
      const fileId = url.pathname.split("/file/d/")[1]?.split(/[/?#]/)[0];
      if (!fileId) return null;
      const src = `https://drive.google.com/file/d/${fileId}/preview`;
      const cx = options.className ? ` class="${escapeAttr(options.className)}"` : "";
      return `<iframe${cx} src="${escapeAttr(src)}" width="100%" height="450" frameborder="0" allowfullscreen></iframe>`;
    }
  };

  // src/services/index.ts
  var providers = [
    youtube,
    vimeo,
    dailymotion,
    bilibili,
    twitter,
    spotify,
    applemusic,
    soundcloud,
    codepen,
    figma,
    reddit,
    instagram,
    facebook,
    giphy,
    tiktok,
    streamable,
    github,
    linkedin,
    loom,
    wistia,
    googledrive,
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
