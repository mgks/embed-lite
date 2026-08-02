/**
 * Shared HTML escaping helpers.
 * All URL-derived and option-derived values are interpolated into HTML
 * attributes, so they must be escaped to prevent attribute breakout (CWE-79).
 */

// Escape a value intended for an HTML attribute value (quoted with ").
// Covers & " < > which are the characters that can break out of an attribute.
export function escapeAttr(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Escape a value intended for HTML text content.
export function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
