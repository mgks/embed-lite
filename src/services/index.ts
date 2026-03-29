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

export const providers: EmbedProvider[] = [
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
  tiktok,
  github,
  linkedin,
  googlemaps
];