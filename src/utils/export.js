/**
 * Pro export helpers: CSV building (RFC-4180 escaping) + browser download.
 * UTF-8 BOM is prepended for CSV so Excel opens Arabic columns correctly.
 */

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export function toCsv(rows) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

/**
 * Trigger a client-side file download. CSV gets a BOM automatically.
 */
export function downloadText(filename, text) {
  const isCsv = filename.toLowerCase().endsWith('.csv');
  const blob = new Blob([isCsv ? '\uFEFF' + text : text], {
    type: isCsv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
