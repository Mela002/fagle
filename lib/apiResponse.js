export function ok(data, meta = {}) {
  return Response.json({ success: true, data, ...meta });
}

export function created(data, meta = {}) {
  return Response.json({ success: true, data, ...meta }, { status: 201 });
}

export function fail(message, status = 400, details = undefined) {
  return Response.json({ success: false, error: message, details }, { status });
}

export function unauthorized(message = 'Accès non autorisé') {
  return fail(message, 401);
}

export function notFound(message = 'Introuvable') {
  return fail(message, 404);
}
