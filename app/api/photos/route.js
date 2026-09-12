import { getPhotos, createPhoto } from '@/lib/db';
import { isSupabaseConfigured, getSupabaseServerClient } from '@/lib/supabaseClient';
import { ok, created, fail } from '@/lib/apiResponse';
import { requireFields } from '@/lib/validation';

const BUCKET = 'crop-photos';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plotId = searchParams.get('plotId');
  if (!plotId) return fail('Le paramètre plotId est requis');
  try {
    const photos = await getPhotos(plotId);
    return ok(photos);
  } catch (err) {
    return fail(err.message, 500);
  }
}

/**
 * Accepts a JSON payload with either:
 *  - `url`: an already-hosted image URL (used for demo placeholder photos), or
 *  - `dataUrl`: a base64 data URL captured from a file input.
 * When Supabase Storage is configured, `dataUrl` uploads are persisted to the
 * `crop-photos` bucket. In Demo Mode the data URL is stored inline — fine for
 * a hackathon demo, not meant for large production images.
 */
export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return fail('Corps JSON invalide');
  const missing = requireFields(body, ['plot_id', 'farmer_id']);
  if (missing) return fail(missing);
  if (!body.url && !body.dataUrl) return fail('Le champ `url` ou `dataUrl` est requis');

  try {
    let url = body.url;

    if (!url && body.dataUrl && isSupabaseConfigured()) {
      const sb = getSupabaseServerClient();
      const match = /^data:(.+);base64,(.*)$/.exec(body.dataUrl);
      if (!match) return fail('Format de dataUrl invalide');
      const [, mime, base64] = match;
      const ext = mime.split('/')[1] || 'jpg';
      const path = `${body.plot_id}/${Date.now()}.${ext}`;
      const buffer = Buffer.from(base64, 'base64');
      const { error: uploadError } = await sb.storage.from(BUCKET).upload(path, buffer, { contentType: mime });
      if (uploadError) return fail(`Échec de l'envoi vers le stockage : ${uploadError.message}`, 500);
      const { data: publicUrlData } = sb.storage.from(BUCKET).getPublicUrl(path);
      url = publicUrlData.publicUrl;
    } else if (!url) {
      url = body.dataUrl;
    }

    const photo = await createPhoto({ ...body, url });
    return created(photo);
  } catch (err) {
    return fail(err.message, 500);
  }
}
