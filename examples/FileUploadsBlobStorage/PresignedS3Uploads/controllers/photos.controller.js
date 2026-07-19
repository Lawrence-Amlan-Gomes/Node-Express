// The real AWS SDK calls (and the real presigned-URL generation) live
// here — the routes file never talks to S3 directly, only this
// controller does.
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// A real S3 client, pointed at a real, self-hosted, S3-compatible (MinIO)
// endpoint instead of AWS itself — the same client code works against
// either, since MinIO speaks the real S3 API.
const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  // MinIO needs path-style URLs (host/bucket/key) — real AWS S3 defaults
  // to virtual-hosted style (bucket.host/key) instead.
  forcePathStyle: true,
});

// The real bucket this example connects to — genuinely shared with a
// different real project (a "products/" prefix already lives there).
const BUCKET = process.env.S3_BUCKET;
// Every real object this example creates lives under this one dedicated
// prefix — this is what keeps it from ever touching the bucket's other
// real, unrelated data.
const PREFIX = "node-express-learning/";

// Handles POST /photos/upload-url — the real point of this whole
// section. Express never receives the file's actual bytes here — it
// only generates a real, time-limited, signed URL that grants
// permission to PUT one specific object, then hands that URL back.
async function createUploadUrl(req, res) {
  // Real values the client says it wants to upload — nothing else is trusted yet.
  const { fileName, contentType } = req.body;
  // A real, minimal validation — both fields are genuinely required to sign anything.
  if (!fileName || !contentType) {
    return res.status(400).json({ error: "fileName and contentType are required" });
  }
  // A real, unique key — timestamped so two uploads with the same fileName never collide.
  const key = `${PREFIX}${Date.now()}-${fileName}`;
  // getSignedUrl actually cryptographically signs a real PutObject request
  // — it does NOT upload anything itself, it just proves permission to.
  const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }), {
    // This exact URL stops working after 900 real seconds (15 minutes) —
    // long enough for a real person to copy it into a new Postman request,
    // set headers, pick a file, and send, without racing a clock. A
    // shorter window (the original build used 60s) is a real, common
    // production choice too, but only when the upload happens
    // programmatically right after the URL is generated — not when a
    // human is manually working through a multi-step GUI in between.
    expiresIn: 900,
  });
  // The real, permanent URL the uploaded file will be readable at, once it exists.
  const publicUrl = `${process.env.S3_PUBLIC_URL}/${key}`;
  // Hand back the real key, the real one-time upload URL, and the real future read URL.
  res.status(201).json({ key, uploadUrl, publicUrl });
}

// Handles GET /photos — Express asks S3 what real objects exist under
// its own dedicated prefix. This proves Express can track and manage
// uploads it never actually received a single byte of.
async function listPhotos(req, res) {
  // A real S3 API call, scoped to ONLY this example's own prefix.
  const result = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX }));
  // Real objects (or an empty list, if none exist yet) — mapped into a smaller, real shape.
  const photos = (result.Contents ?? []).map((object) => ({
    key: object.Key,
    size: object.Size,
    publicUrl: `${process.env.S3_PUBLIC_URL}/${object.Key}`,
  }));
  // Send back the real, current list.
  res.status(200).json({ photos });
}

// Handles DELETE /photos — clears every real object under this
// example's own dedicated prefix, with no reseed. Used by demo.js to
// leave this real shared bucket exactly as it was found when it's done.
async function deleteAllPhotos(req, res) {
  // Find every real object under this example's own prefix first.
  const result = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: PREFIX }));
  // Real objects to delete — DeleteObjectsCommand needs just their real keys.
  const objects = (result.Contents ?? []).map((object) => ({ Key: object.Key }));
  // Only actually call delete if there's real work to do — an empty
  // Objects array is a real, documented S3 error, not a harmless no-op.
  if (objects.length > 0) {
    await client.send(new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: objects } }));
  }
  // Confirm the real number of objects actually removed.
  res.status(200).json({ deleted: objects.length });
}

export { createUploadUrl, listPhotos, deleteAllPhotos };
