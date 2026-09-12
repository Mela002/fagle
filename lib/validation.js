export function requireFields(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    return `Champ(s) requis manquant(s) : ${missing.join(', ')}`;
  }
  return null;
}

export function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}
