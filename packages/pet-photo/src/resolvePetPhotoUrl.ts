/**
 * Build a display URL for a pet photo from PostgREST / SQL row fields.
 * - Prefer `photo_url` when set (cached public or long-lived URL).
 * - Else build Supabase **public** bucket URL from project URL + bucket + path.
 * Private buckets: use the Storage SDK `createSignedUrl` with `photo_storage_path` instead.
 */
export function resolvePetPhotoPublicUrl(params: {
  supabaseProjectUrl: string;
  photoUrl?: string | null;
  photoBucket?: string | null;
  photoStoragePath?: string | null;
  defaultBucket?: string;
}): string | null {
  const direct = params.photoUrl?.trim();
  if (direct) return direct;

  const path = params.photoStoragePath?.trim();
  if (!path) return null;

  const bucket = params.photoBucket?.trim() || params.defaultBucket || "pet-photos";
  const base = params.supabaseProjectUrl.replace(/\/$/, "");
  const key = path.replace(/^\//, "");
  return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodePathSegments(key)}`;
}

/** Encode each path segment; keep slashes between segments. */
function encodePathSegments(key: string): string {
  return key
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
}
