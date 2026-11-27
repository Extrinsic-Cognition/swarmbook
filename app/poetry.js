// A reading alphabet for the requested poems, not encryption. Live envelopes
// never pass through this adapter: their contents remain unavailable.
export const poetryDisplay = { words: false };
export function poemGlyph(char) {
  const letter = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return /^[a-z]$/.test(letter) ? letter.charCodeAt(0) - 97 : null;
}
export function poemPlainText(body) {
  return body.replace(/^## /gm, '').replace(/^> ?/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
}
export function poemPages(poem, columns = 24, rows = 3) {
  const lines = [];
  for (const verse of poemPlainText(poem.body).split('\n')) {
    let chars = Array.from(verse);
    while (chars.length > columns) {
      let cut = chars.slice(0, columns + 1).lastIndexOf(' ');
      if (cut <= 0) cut = columns;
      lines.push(chars.slice(0, cut).join(''));
      chars = chars.slice(cut);
      if (chars[0] === ' ') chars.shift();
    }
    lines.push(chars.join(''));
  }
  const pages = [];
  for (let i = 0; i < lines.length; i += rows) pages.push(lines.slice(i, i + rows));
  return pages;
}

