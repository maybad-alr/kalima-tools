/**
 * ZATCA Phase-1 QR (TLV Base64) decoder.
 * Decodes the Base64 TLV payload found in simplified tax invoice QR codes
 * into readable fields and runs compliance checks.
 */

export function base64ToBytes(base64) {
  const clean = String(base64 || '').replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function utf8BytesToString(bytes) {
  return new TextDecoder('utf-8').decode(bytes);
}

const TAG_NAMES = {
  1: { en: 'Seller Name', ar: 'اسم المورد / المنشأة' },
  2: { en: 'VAT Registration Number', ar: 'الرقم الضريبي' },
  3: { en: 'Timestamp (ISO 8601)', ar: 'الوقت والتاريخ' },
  4: { en: 'Invoice Total (with VAT)', ar: 'إجمالي الفاتورة (مع الضريبة)' },
  5: { en: 'VAT Total', ar: 'إجمالي ضريبة القيمة المضافة' },
  6: { en: 'Invoice Hash (SHA-256)', ar: 'تجزئة الفاتورة (المرحلة 2)' },
  7: { en: 'Digital Signature', ar: 'التوقيع الرقمي' },
  8: { en: 'Public Key', ar: 'المفتاح العام' }
};

/**
 * Decode a ZATCA TLV Base64 string. Pure function; returns a structured report.
 */
export function decodeZatcaTLV(base64String) {
  const cleanStr = (base64String || '').trim();
  if (!cleanStr) {
    return { valid: false, errorKey: 'emptyInput' };
  }

  let bytes;
  try {
    bytes = base64ToBytes(cleanStr);
  } catch {
    return { valid: false, errorKey: 'invalidBase64' };
  }

  try {
    let index = 0;
    const fields = {};

    while (index < bytes.length) {
      const tag = bytes[index++];
      if (index >= bytes.length) return { valid: false, errorKey: 'truncated' };

      let len = bytes[index++];
      if (len === 0x82) {
        len = (bytes[index] << 8) | bytes[index + 1];
        index += 2;
      } else if (len > 127) {
        return { valid: false, errorKey: 'unsupportedLength' };
      }

      if (index + len > bytes.length) {
        return { valid: false, errorKey: 'truncated' };
      }

      const value = utf8BytesToString(bytes.slice(index, index + len));
      index += len;

      fields[tag] = {
        tag,
        labelEn: TAG_NAMES[tag]?.en || `Tag ${tag}`,
        labelAr: TAG_NAMES[tag]?.ar || `حقل رقم ${tag}`,
        value
      };
    }

    const hasTags1To5 = [1, 2, 3, 4, 5].every((t) => !!fields[t]);
    const vat = fields[2]?.value || '';
    const vatValid = /^3\d{13}3$/.test(vat);

    const tagsFound = Object.keys(fields).map(Number).sort((a, b) => a - b);

    return {
      valid: hasTags1To5,
      errorKey: hasTags1To5 ? null : 'missingMandatoryTags',
      fields,
      tagsFound,
      vatCompliant: vatValid,
      phase2: !!fields[6],
      checks: {
        mandatoryTags: hasTags1To5,
        vatFormat: vatValid,
        timestampISO: !!fields[3] && !isNaN(Date.parse(fields[3].value)),
        totalNumeric: !!fields[4] && !isNaN(Number(fields[4].value)),
        vatNotExceedTotal: !!fields[4] && !!fields[5] && Number(fields[5].value) <= Number(fields[4].value)
      }
    };
  } catch {
    return { valid: false, errorKey: 'decodeFailed' };
  }
}

/**
 * Encode fields to ZATCA TLV Base64 (used for the tool's sample generator).
 */
export function generateZatcaTLV({ sellerName, vatNumber, timestamp, total, vatTotal }) {
  const parts = [];
  const tag = (n, value) => {
    const v = new TextEncoder().encode(String(value));
    if (v.length < 128) {
      parts.push(new Uint8Array([n, v.length, ...v]));
    } else {
      parts.push(new Uint8Array([n, 0x82, (v.length >> 8) & 0xff, v.length & 0xff, ...v]));
    }
  };
  tag(1, sellerName || 'Acme Trading');
  tag(2, vatNumber || '300000000000003');
  tag(3, timestamp || new Date().toISOString());
  tag(4, Number(total || 0).toFixed(2));
  tag(5, Number(vatTotal || 0).toFixed(2));
  const totalLen = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(totalLen);
  let off = 0;
  for (const p of parts) { out.set(p, off); off += p.length; }
  return bytesToBase64(out);
}
