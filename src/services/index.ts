import { EmbedProvider } from '../types.js';

import { youtube } from './youtube.js';
import { vimeo } from './vimeo.js';
import { twitter } from './twitter.js';
import { spotify } from './spotify.js';
import { codepen } from './codepen.js';
import { figma } from './figma.js';
import { reddit } from './reddit.js';
import { soundcloud } from './soundcloud.js';
import { instagram } from './instagram.js';
import { facebook } from './facebook.js';
import { googlemaps } from './googlemaps.js';
import { tiktok } from './tiktok.js';
import { github } from './github.js';
import { linkedin } from './linkedin.js';
import { dailymotion } from './dailymotion.js';
import { bilibili } from './bilibili.js';
import { loom } from './loom.js';
import { applemusic } from './applemusic.js';
import { giphy } from './giphy.js';
import { streamable } from './streamable.js';
import { wistia } from './wistia.js';
import { googledrive } from './googledrive.js';

export const providers: EmbedProvider[] = [
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