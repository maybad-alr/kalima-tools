/**
 * Decorative text generator: maps Latin letters to Unicode look-alike
 * styles (bold serif, script, fraktur, circled, small-caps…) plus
 * Arabic-friendly decorations (kashida elongation, ornamental frames).
 * Pure character mapping — no external data.
 */

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function mapUpper(offset) {
  return ALPHA.split('').map((_, i) => String.fromCodePoint(offset + i)).join('');
}

function pair(upper, lower) {
  const map = new Map();
  for (let i = 0; i < 26; i++) {
    const U = Array.from(upper)[i];
    const L = Array.from(lower)[i];
    map.set(ALPHA[i], U);
    map.set(ALPHA[i].toLowerCase(), L);
  }
  return map;
}

const STYLES = {
  bold: pair(mapUpper(0x1D400), mapUpper(0x1D41A)),
  italic: pair(mapUpper(0x1D434), mapUpper(0x1D44E)),
  boldItalic: pair(mapUpper(0x1D468), mapUpper(0x1D482)),
  script: pair(mapUpper(0x1D49C), mapUpper(0x1D4B6)),
  boldScript: pair(mapUpper(0x1D4D0), mapUpper(0x1D4EA)),
  fraktur: pair(mapUpper(0x1D504), mapUpper(0x1D51E)),
  double: pair(mapUpper(0x1D56C), mapUpper(0x1D586)),
  outlined: pair(mapUpper(0x1D5D4), mapUpper(0x1D5EE)),
  shadow: pair(mapUpper(0x1D608), mapUpper(0x1D622)),
  smallcaps: (() => {
    const sc = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ';
    const m = new Map();
    for (let i = 0; i < 26; i++) {
      m.set(ALPHA[i], Array.from(sc)[i]);
      m.set(ALPHA[i].toLowerCase(), Array.from(sc)[i]);
    }
    return m;
  })()
};

const DIGIT_MAPS = {
  circled: '⓪①②③④⑤⑥⑦⑧⑨',
  fullwidth: '０１２３４５６７８９'
};

export function listFancyStyles() {
  return [
    { id: 'bold', labelEn: 'Bold Serif', labelAr: 'عريض' },
    { id: 'italic', labelEn: 'Italic Serif', labelAr: 'مائل' },
    { id: 'boldItalic', labelEn: 'Bold Italic', labelAr: 'عريض مائل' },
    { id: 'script', labelEn: 'Script', labelAr: 'خط يدوي' },
    { id: 'boldScript', labelEn: 'Bold Script', labelAr: 'يدوي عريض' },
    { id: 'fraktur', labelEn: 'Fraktur', labelAr: 'قوطي' },
    { id: 'double', labelEn: 'Double Struck', labelAr: 'مظلل مزدوج' },
    { id: 'outlined', labelEn: 'Outlined', labelAr: 'مفرّغ' },
    { id: 'shadow', labelEn: 'Shadow', labelAr: 'مظلل' },
    { id: 'smallcaps', labelEn: 'Small Caps', labelAr: 'أحرف صغيرة' },
    { id: 'circled', labelEn: 'Circled', labelAr: 'مُحاط بدائرة' },
    { id: 'fullwidth', labelEn: 'Fullwidth', labelAr: 'عريض العرض' },
    { id: 'kashida', labelEn: 'Kashida Elongation (Arabic)', labelAr: 'تطويل بالكشيدة' },
    { id: 'framed', labelEn: 'Ornament Frame', labelAr: 'إطار زخرفي' }
  ];
}

function mapCharMap(input, map, digitMap) {
  return Array.from(String(input || ''))
    .map((ch) => {
      if (map.has(ch)) return map.get(ch);
      if (digitMap && /\d/.test(ch)) return Array.from(digitMap)[Number(ch)];
      return ch;
    })
    .join('');
}

/**
 * Apply a decorative style to Latin text. Arabic text passes through the
 * Latin styles unchanged (those ranges only exist for Latin); kashida and
 * framed styles are the Arabic-native decorations.
 */
export function fancyText(input, style = 'bold') {
  const str = String(input || '');
  switch (style) {
    case 'kashida':
      // Stretch eligible Arabic letters with tatweel (never before
      // non-joining letters ة ا د ذ ر ز و or non-Arabic)
      return Array.from(str)
        .map((ch, i, arr) => {
          const next = arr[i + 1] || '';
          if (/[ء-ي]/.test(ch) && !/[دذرزوةا]/.test(ch) && /[ء-ي]/.test(next)) {
            return ch + 'ـ';
          }
          return ch;
        })
        .join('');
    case 'framed':
      return `❝ ${str} ❞`;
    case 'circled':
      return mapCharMap(str, new Map(), DIGIT_MAPS.circled);
    case 'fullwidth':
      return Array.from(str)
        .map((ch) => (ch === ' ' ? ' ' : ch.charCodeAt(0) >= 0x21 && ch.charCodeAt(0) <= 0x7e
          ? String.fromCodePoint(ch.charCodeAt(0) + 0xFEE0)
          : ch))
        .join('');
    default: {
      const map = STYLES[style] || STYLES.bold;
      return mapCharMap(str, map, null);
    }
  }
}
