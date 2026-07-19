import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import PresignedS3UploadsRunner from "@/example-runners/FileUploadsBlobStorage/PresignedS3UploadsRunner";

const PROJECT_ROOT = "/Users/lawrencealangomes/Documents/Node Express";

// A clear, scannable, copy-paste-able manual step — NOT prose. This one
// request genuinely goes to a different real host than every other step
// on this page (the bucket itself, not this Express server), so it can't
// live inside PostmanCheck's own steps list — that component always
// targets this app's own fixed localhost port. Do this between step 4.1
// and step 4.3 in the guide below.
function ManualPresignedUploadStep() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Manual Step — Do This Between 4.1 and 4.3 Below</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        This one request does NOT go to this Express server — it goes straight to the real bucket. Create a
        brand-new Postman request (a new tab) and fill in exactly these four fields.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">1. Method</div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border text-orange-500 border-orange-500/40 bg-orange-500/10">PUT</span>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">2. URL</div>
          <div className="text-body text-xs leading-relaxed">
            Paste the real <code className="text-cyan-500">uploadUrl</code> value from step 4.1&apos;s response —
            the whole string, starting with <code className="text-cyan-500">https://minio-...</code>. It stays valid
            for 15 real minutes, so there&apos;s no rush.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">3. Headers tab — add one row</div>
          <pre className="font-mono text-xs text-body bg-surface rounded px-2 py-1.5 border border-border w-fit">Content-Type: image/png</pre>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-[11px] uppercase tracking-wide mb-1">4. Body tab</div>
          <div className="text-body text-xs leading-relaxed mb-1.5">
            Select <code className="text-cyan-500">binary</code>, click <code className="text-cyan-500">Select File</code>, and pick this exact real file:
          </div>
          <pre className="font-mono text-xs text-orange-500 bg-orange-500/10 rounded px-2 py-1.5 whitespace-pre-wrap break-all">
            {PROJECT_ROOT}/examples/FileUploadsBlobStorage/PresignedS3Uploads/public/demo-photo.png
          </pre>
        </div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 mt-3">
        <span className="text-green-500 text-xs">
          Click Send. Expect a plain 200 with an empty body — the real upload just went straight to the bucket,
          never through Express.
        </span>
      </div>
    </div>
  );
}

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md.

function DirectUploadBypassDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Where the real file bytes actually travel — two different real paths</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">THE NAIVE WAY — through Express</div>
          <div className="text-body text-xs leading-relaxed">
            Browser → Express (real bytes pass through here) → Storage. Every upload spends YOUR server&apos;s real
            memory, CPU, and bandwidth — even though Express never actually needed the file itself.
          </div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">THE REAL PATTERN — presigned URL</div>
          <div className="text-body text-xs leading-relaxed">
            Browser → Express (asks for permission, gets a signed URL back — zero bytes here) → Storage (browser
            uploads real bytes DIRECTLY). Express&apos;s real work is deciding who&apos;s allowed to upload what.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">
          Verified directly on this page&apos;s own demo: the real PUT below goes straight to a real MinIO (S3-compatible)
          bucket — never to this app&apos;s own Express server.
        </span>
      </div>
    </div>
  );
}

function CdnEdgeCachingDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What a real CDN adds ON TOP OF the direct-read pattern already proven above</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">No CDN — every reader hits the origin bucket directly</div>
          <div className="text-body text-xs leading-relaxed">
            A reader in Tokyo and a reader in São Paulo both travel all the way to wherever the bucket actually lives
            — same real distance, every single request, no matter how many people already read the exact same file.
          </div>
        </div>
        <div className="rounded-card border border-cyan-500/40 bg-cyan-500/3 px-3 py-2">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-0.5">With a real CDN — cached close to each reader</div>
          <div className="text-body text-xs leading-relaxed">
            The FIRST request in a region still travels to the origin — but the CDN keeps a real copy at an edge
            location near that reader. Every request after that, from anyone nearby, gets served from the edge —
            never touching the origin bucket again until the cache expires.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">
          Same mechanism as the direct-read bypass already proven — a CDN just adds MORE copies, geographically
          closer to each real reader.
        </span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Direct-to-S3 Uploads via Presigned URLs",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "The Naive Way: Uploading THROUGH Express",
              description: "A file's real bytes flow browser → Express → storage. Your server's real memory, CPU, and bandwidth pay for every upload — even though Express never actually needs the file itself.",
            },
            {
              label: "The Real Production Pattern: Ask, Then Upload Directly",
              description: "The client asks Express for permission first — a presigned URL — then uploads the real bytes straight to storage. Express is out of the path entirely once it hands that URL back.",
              example: "POST /photos/upload-url → { uploadUrl } → the client PUTs directly to that URL, not to Express.",
            },
            {
              label: "A Presigned URL Is a Real, Time-Limited, Signed Permission Slip",
              description: "It's cryptographically signed, and it only grants permission to do ONE specific thing (PUT this exact file) for a short real window — 15 minutes in this example — not a standing credential the client could ever reuse or leak.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          Express&apos;s real job in a production upload flow isn&apos;t moving bytes — it&apos;s deciding WHO gets to
          upload WHAT, WHERE, and for HOW LONG, then getting out of the way. The real file traffic goes straight to
          storage.
        </Callout>
        <p>
          The demo below asks a real Express API for a real, signed upload URL, then uploads real file bytes DIRECTLY
          to a real, self-hosted, S3-compatible bucket — a request that never touches Express at all. It then asks
          Express to list what it can see (proving Express can track an upload it never received a byte of), and
          reads the file back from its real public URL — again, without Express in the path.
        </p>
      </>
    ),
    extra: <DirectUploadBypassDiagram />,
    demo: <PresignedS3UploadsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/FileUploadsBlobStorage/PresignedS3Uploads/routes/photos.routes.js", note: "Declares which path/method maps to which controller function — no AWS SDK code here at all." },
      { path: "examples/FileUploadsBlobStorage/PresignedS3Uploads/controllers/photos.controller.js", note: "The ONLY file that talks to S3 — generates the real presigned URL, lists, and deletes." },
      { path: "examples/FileUploadsBlobStorage/PresignedS3Uploads/demo.js", note: "Calls the real API for a URL, then uploads and reads the real file DIRECTLY against the bucket — not through Express." },
      { path: "examples/FileUploadsBlobStorage/PresignedS3Uploads/public/demo-photo.png", note: "A real, valid 400×300 PNG — the exact file the demo above uploads, and the one to pick in Postman's own file picker when trying this yourself." },
    ],
    postmanCheck: (
      <>
        <PostmanCheck
          folderPath="examples/FileUploadsBlobStorage/PresignedS3Uploads"
          runCommand="node server.js"
          runPort={4083}
          steps={[
            {
              method: "POST",
              path: "/photos/upload-url",
              body: JSON.stringify({ fileName: "demo-photo.png", contentType: "image/png" }, null, 2),
              note: "A real demo photo already sits in this example's own public/ folder. Copy the real uploadUrl value out of the response below, then do the manual step underneath this guide before continuing to 4.3.",
              expectStatus: 201,
              expectBody: 'A real JSON object: {"key": "node-express-learning/<a real timestamp>-demo-photo.png", "uploadUrl": "<a real, signed URL, valid 15 minutes>", "publicUrl": "<the future real read URL>"} — the exact key and URLs differ every time you call this.',
            },
            {
              method: "POST",
              path: "/photos/upload-url",
              body: JSON.stringify({}, null, 2),
              note: "Missing both required fields.",
              expectStatus: 400,
              expectBody: '{"error":"fileName and contentType are required"}',
            },
            {
              method: "GET",
              path: "/photos",
              note: "Run this AFTER completing the manual step below — you should now see the real demo-photo.png you uploaded directly, listed here at its real size, 5908 bytes. Open its publicUrl in a browser tab to see the actual real image render.",
              expectStatus: 200,
              expectBody: 'A real JSON object: {"photos":[{"key":"node-express-learning/...-demo-photo.png","size":5908,"publicUrl":"<a real, permanent, public URL>"}]}',
            },
            {
              method: "DELETE",
              path: "/photos",
              note: "Cleans up — removes every real object this example created, leaving the real shared bucket exactly as found.",
              expectStatus: 200,
              expectBody: 'A real JSON object: {"deleted": <the real number of objects removed>}',
            },
          ]}
        />
        <ManualPresignedUploadStep />
      </>
    ),
  },
  {
    heading: "CDN: Serving What You Just Uploaded",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "The Same Bypass Works for Reading, Too",
              description: "The demo in the previous section already proved this — the uploaded file was read back directly from its real public URL, with zero Express involvement in serving it either.",
            },
            {
              label: "A Real CDN Adds ONE More Layer: Caching Close to the Reader",
              description: "A CDN (Cloudflare, CloudFront, Akamai) sits in front of storage at edge locations around the world, caching a real copy near each real reader — so the request never has to travel all the way back to the original bucket's region every time.",
            },
            {
              label: "This Example's Bucket Is Real — But Not Behind an Actual CDN",
              description: "It's a real, direct storage URL with public read enabled, not multiplied across edge locations. The mechanism is the exact same read-bypass already proven — a real CDN is a scaling/latency optimization layered on top of it, not a different mechanism.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A CDN doesn&apos;t change WHO can read a file, or WHAT gets returned — it changes HOW FAR that request has
          to travel. The direct-read pattern already proven on this page is exactly what a real CDN caches at scale.
        </Callout>
        <p>
          This section is conceptual — there&apos;s no separate mini-project to run, since the real read-bypass
          behavior it&apos;s built on was already proven live in the previous section&apos;s demo. What a real CDN
          adds (edge locations, cache invalidation, TTLs) genuinely needs a real CDN provider in front of a real
          bucket to observe directly, which is out of scope for a single learning project — but the underlying
          mechanism is exactly what you already watched work above.
        </p>
      </>
    ),
    extra: <CdnEdgeCachingDiagram />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Routing file uploads through Express (the naive way — receive the bytes, then re-upload them to
        storage yourself) wastes your server&apos;s real memory, CPU, and bandwidth on every single upload. The real
        production pattern flips it: Express only ever hands out a real, time-limited, cryptographically signed
        presigned URL — the client uploads the real bytes DIRECTLY to storage, and reads them back the exact same
        way. A CDN doesn&apos;t change that mechanism at all — it just adds more geographically-close copies of the exact
        same direct-read pattern, so a reader on the other side of the world isn&apos;t paying for distance to the origin
        bucket on every request.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a file needs to get uploaded", "ask Express for permission → a real, time-limited presigned URL, zero bytes involved", "upload directly to storage → Express is already out of the path", "read it back → the same direct-URL pattern, no Express involvement either", "at real scale → a CDN caches that same direct read close to each reader"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "The core interview signal here: knowing that a real production API does NOT stream file bytes through its own server for storage — it generates a presigned URL and gets out of the way. Naive multer-to-local-disk uploads are what a junior implementation looks like; presigned URLs are what a senior one looks like.",
            "A presigned URL is time-limited and scoped to ONE specific action (this exact key, this exact method) — it's not a leaked standing credential, which is exactly why it's safe to hand to an untrusted client.",
            "This same mechanism works for reads, not just writes — direct-to-storage reads are what a CDN caches at scale. Knowing that a CDN is 'the same bypass, plus geographic caching' rather than a totally separate system is a real, precise answer, not a hand-wave.",
            "Real infra choice, if asked: AWS S3 (the original, most-referenced API), Cloudflare R2 (S3-compatible, no egress fees), or a self-hosted S3-compatible server like MinIO (what this example actually uses) — the client-side code barely changes between any of them, since they all speak the same real S3 API.",
          ]}
        />
      </>
    ),
  },
];

export default function FileUploadsBlobStoragePage() {
  return (
    <StudyPage
      title="File Uploads & Blob Storage"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="The real production pattern for file uploads: Express never touches the actual file bytes. It hands out a real, time-limited, signed presigned URL, and the client uploads directly to a real, self-hosted S3-compatible bucket — proven end to end against real infrastructure, plus what a real CDN adds on top of the same direct-read mechanism."
      sections={sections}
    />
  );
}
