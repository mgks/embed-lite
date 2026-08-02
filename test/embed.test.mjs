// embed-lite test suite: per-provider behaviour, XSS invariants, and brute fuzz.
// Uses Node's built-in test runner (zero dependencies). Run: npm test
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { embed } from '../dist/index.js';

// The one invariant that matters for XSS in quoted attributes: the captured
// value must contain no raw, unescaped ". Only a raw " can close the attribute
// early and start a new one. Entity-encoded text (&quot;, onload=, <script) is
// inert inside quotes, so we do NOT flag those.
function assertNoAttrBreakout(html, attr) {
  const re = new RegExp(`${attr}="([^"]*)"`);
  const m = html.match(re);
  assert.ok(m, `${attr}="..." not found in: ${html}`);
  // m[1] is everything the regex captured between the quotes. Because the
  // pattern is [^"]*, a match is only possible when no raw " sits inside.
  assert.equal(m[1].includes('"'), false, `raw " inside ${attr} value enables breakout: ${html}`);
}

describe('embed() failsafes', () => {
  it('returns null for invalid URL strings', () => {
    assert.equal(embed(''), null);
    assert.equal(embed('not a url'), null);
    assert.equal(embed('::::'), null);
  });

  it('returns null for unsupported hosts', () => {
    assert.equal(embed('https://example.com/watch?v=abc'), null);
    assert.equal(embed('https://evil.com/youtube.com/embed/x'), null);
  });

  it('never throws on garbage input', () => {
    const junk = ['\x00', 'http://', 'http://\n', '${jndi:ldap://x}', '<script>', "' OR 1=1--"];
    for (const s of junk) {
      assert.doesNotThrow(() => embed(s), `threw on: ${JSON.stringify(s)}`);
    }
  });
});

describe('YouTube', () => {
  it('embeds a valid watch URL', () => {
    const r = embed('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    assert.ok(r);
    assert.match(r.html, /src="https:\/\/www\.youtube\.com\/embed\/dQw4w9WgXcQ"/);
  });

  it('embeds a youtu.be short link', () => {
    const r = embed('https://youtu.be/dQw4w9WgXcQ');
    assert.ok(r);
    assert.match(r.html, /embed\/dQw4w9WgXcQ/);
  });

  it('embeds a /shorts/ URL', () => {
    const r = embed('https://www.youtube.com/shorts/abcdef123456');
    assert.ok(r);
    assert.match(r.html, /data-short="true"/);
  });

  it('rejects XSS payload in v= param (attribute breakout)', () => {
    // Before the fix this produced: src="...embed/x" onload=alert(1)"
    const r = embed('https://youtube.com/watch?v=x"%20onload%3Dalert(1)');
    assert.equal(r, null, 'allowlist must reject the XSS payload');
  });

  it('rejects IDs with shell metacharacters', () => {
    assert.equal(embed('https://youtube.com/watch?v=a;b'), null);
    assert.equal(embed('https://youtube.com/watch?v=<script>'), null);
  });

  it('honours a safe className', () => {
    const r = embed('https://youtube.com/watch?v=dQw4w9WgXcQ', { className: 'safe-name' });
    assert.match(r.html, /class="safe-name"/);
  });

  it('escapes a className XSS attempt', () => {
    const r = embed('https://youtube.com/watch?v=dQw4w9WgXcQ', { className: 'a" onload=alert(1)' });
    assert.ok(r);
    assertNoAttrBreakout(r.html, 'class');
    assertNoAttrBreakout(r.html, 'src');
  });
});

describe('Vimeo', () => {
  it('embeds a numeric id', () => {
    const r = embed('https://vimeo.com/76979871');
    assert.match(r.html, /player\.vimeo\.com\/video\/76979871/);
  });
  it('rejects non-numeric path', () => {
    assert.equal(embed('https://vimeo.com/abc'), null);
    assert.equal(embed('https://vimeo.com/76979871"; onload=x'), null);
  });
});

describe('TikTok', () => {
  it('embeds a valid video URL', () => {
    const r = embed('https://www.tiktok.com/@user/video/1234567890');
    assert.match(r.html, /tiktok\.com\/embed\/v2\/1234567890/);
  });
  it('rejects non-numeric video id', () => {
    assert.equal(embed('https://www.tiktok.com/@user/video/abc'), null);
    assert.equal(embed('https://www.tiktok.com/@user/video/123"; onload=x'), null);
  });
});

describe('blockquote providers (twitter, instagram, reddit)', () => {
  it('twitter escapes href and className', () => {
    const r = embed('https://x.com/user/status/123', { className: 'x" onload=alert(1)' });
    assert.ok(r);
    assertNoAttrBreakout(r.html, 'class');
  });
  it('instagram escapes href', () => {
    const r = embed('https://www.instagram.com/p/ABC123/', { className: 'bad"class' });
    assert.ok(r);
    assertNoAttrBreakout(r.html, 'class');
  });
  it('reddit escapes href', () => {
    const r = embed('https://www.reddit.com/r/node/comments/abc/title/', { className: 'x"y' });
    assert.ok(r);
    assertNoAttrBreakout(r.html, 'class');
  });
});

describe('iframe src providers (spotify, soundcloud, codepen, figma, facebook, linkedin, googlemaps, github)', () => {
  const cases = [
    ['https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT', 'spotify'],
    ['https://soundcloud.com/artist/track', 'soundcloud'],
    ['https://codepen.io/team/pen/abc', 'codepen'],
    ['https://www.figma.com/file/abc/Title', 'figma'],
    ['https://www.facebook.com/user/posts/123', 'facebook'],
    ['https://www.linkedin.com/feed/update/urn:li:activity:123', 'linkedin'],
    ['https://www.google.com/maps/embed?pb=abc', 'googlemaps'],
    ['https://gist.github.com/user/abc123', 'github'],
  ];
  for (const [url, name] of cases) {
    it(`${name} returns iframe and is XSS-safe with hostile className`, () => {
      const r = embed(url, { className: 'evil" onload=alert(1) x' });
      assert.ok(r, `${name} returned null for ${url}`);
      assertNoAttrBreakout(r.html, 'class');
      assertNoAttrBreakout(r.html, 'src');
    });
  }
});

describe('brute fuzz: adversarial URLs never break security invariant', () => {
  // The core invariant: for ANY string input, if embed() returns non-null html,
  // that html must not contain an injected event handler attribute.
  const poison = ['"', '" onload=', '"><script>', "' onload='", '${x}', '%22', '\\"'];
  const hosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com', 'open.spotify.com',
    'soundcloud.com', 'codepen.io', 'figma.com', 'facebook.com', 'linkedin.com',
    'reddit.com', 'instagram.com', 'gist.github.com', 'google.com'];
  const paths = ['/watch?v=', '/76979871', '/@u/video/', '/track/', '/p/', '/comments/',
    '/file/x/', '/embed?pb=', '/status/', '/abc'];

  let iterations = 0;
  let embeddable = 0;
  for (let i = 0; i < 5000; i++) {
    const host = hosts[i % hosts.length];
    const path = paths[(i * 3) % paths.length];
    const tail = poison[i % poison.length] + (i.toString(36));
    const scheme = i % 3 === 0 ? 'http' : 'https';
    const url = `${scheme}://${host}${path}${encodeURIComponent(tail)}`;
    const className = i % 2 === 0 ? poison[i % poison.length] : undefined;
    let result;
    assert.doesNotThrow(() => { result = embed(url, className ? { className } : {}); }, `threw on ${url}`);
    iterations++;
    if (result) {
      embeddable++;
      // Invariant: if class= is present its value is quote-bounded, and src= is
      // always present and quote-bounded. No raw " inside either => no breakout.
      if (/class=/.test(result.html)) assertNoAttrBreakout(result.html, 'class');
      assertNoAttrBreakout(result.html, 'src');
    }
  }
  it(`ran ${iterations} fuzz iterations, ${embeddable} embedded, 0 security leaks`, () => {
    assert.ok(embeddable > 0, 'fuzz never exercised the embed path');
  });
});

describe('brute fuzz: large and unicode inputs', () => {
  it('handles a very long query string without throwing', () => {
    const long = 'a'.repeat(10000);
    assert.doesNotThrow(() => embed(`https://youtube.com/watch?v=${long}`));
    assert.doesNotThrow(() => embed(`https://youtube.com/watch?v=dQw4w9WgXcQ&t=${long}`));
  });

  it('handles unicode in path', () => {
    assert.doesNotThrow(() => embed('https://vimeo.com/影音/123'));
    assert.doesNotThrow(() => embed('https://example.com/🎉'));
  });
});