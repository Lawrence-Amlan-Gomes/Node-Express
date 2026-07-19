// Calls the real, running Express API (server.js) over real HTTP for the
// upload-url/list/delete routes — but the actual file upload and the
// actual file read below do NOT go through Express at all. They go
// straight to the real S3-compatible bucket, which is the entire point
// of this pattern: Express only ever hands out permission, it never
// touches a single byte of the real file.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { app } from "./server.js";

// A real, genuine 400×300 PNG file, sitting right in this example's own
// public/ folder — the exact same file the page's Postman guide points at.
const REAL_FILE_CONTENTS = readFileSync(new URL("./public/demo-photo.png", import.meta.url));
const REAL_CONTENT_TYPE = "image/png";

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Ask the real API for a real, one-time upload URL — through Express.
  console.log("Asking Express for a real presigned upload URL...");
  const urlRes = await fetch(`${base}/photos/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: "demo-photo.png", contentType: REAL_CONTENT_TYPE }),
  });
  const { key, uploadUrl, publicUrl } = await urlRes.json();
  console.log(`Got a real key: ${key}`);
  console.log(`Got a real, time-limited upload URL (expires in 15 minutes): ${uploadUrl.slice(0, 80)}...\n`);

  // THE ACTUAL UPLOAD — a real PUT straight to the bucket, NOT to Express.
  console.log("Uploading the real file bytes DIRECTLY to the bucket (bypassing Express entirely)...");
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": REAL_CONTENT_TYPE },
    body: REAL_FILE_CONTENTS,
  });
  console.log(`Real upload response status: ${uploadRes.status} (${uploadRes.status === 200 ? "success" : "failed"})\n`);

  // Ask Express what it can see — through Express again.
  console.log("Asking Express to list real objects (Express never received these bytes):");
  const listRes = await fetch(`${base}/photos`);
  const { photos } = await listRes.json();
  console.log(photos);

  // THE ACTUAL READ — a real GET straight to the public URL, NOT to Express either.
  console.log("\nReading the real file back DIRECTLY from its public URL (bypassing Express again):");
  const readRes = await fetch(publicUrl);
  // A real Buffer of the real bytes that came back — a PNG isn't printable text.
  const readBody = Buffer.from(await readRes.arrayBuffer());
  console.log(`Real read status: ${readRes.status} | Real bytes received: ${readBody.length}`);
  // A real, byte-for-byte comparison against the original file on disk.
  console.log(Buffer.compare(readBody, REAL_FILE_CONTENTS) === 0 ? "Byte-for-byte identical to the original file that was uploaded." : "MISMATCH — something is wrong.");

  console.log("\nExpress generated permission, and read a directory listing back — but at no point did the real file bytes pass through it, in either direction.");

  // Clean up after this run — a real, shared bucket, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/photos`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});
