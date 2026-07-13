import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import CurlDemoRunner from "@/example-runners/ApiTestingTools/CurlDemoRunner";
import PostmanCollectionRunner from "@/example-runners/ApiTestingTools/PostmanCollectionRunner";
import HttpRequestFileRunner from "@/example-runners/ApiTestingTools/HttpRequestFileRunner";
import PostmanMockUI from "@/components/PostmanMockUI";

const sections: StudySection[] = [
  {
    heading: "You've Already Been Watching This Tool: curl",
    paragraphs: [
      "Every single demo in this app so far has been verified with curl behind the scenes — it's the universal, always-installed, terminal-based way to send a real HTTP request. No install, no GUI, no extension: just a command. curl -s http://localhost:PORT/some/path sends a real GET request and prints the real response body. -X POST changes the method, -H adds a header, -d sends a body.",
      "This matters beyond just this project: curl is available on basically every server, container, and CI machine you'll ever touch professionally — when a GUI tool isn't installed (or isn't allowed) on a machine you're debugging on, curl still is. It's worth being genuinely comfortable with it, not just aware it exists.",
    ],
    demo: <CurlDemoRunner />,
    demoCommand: "node curl-demo.js",
    filePointer: {
      path: "examples/ApiTestingTools/CurlWorkflow/curl-demo.js",
      note: "A real, self-contained todos API just for this — starts it on a fixed port, then runs these exact curl commands against it for real.",
    },
  },
  {
    heading: "GUI Tools: Postman and Thunder Client",
    paragraphs: [
      "curl is fast for a one-off request, but tedious for a whole API you're actively building — remembering every header and body by hand gets old. Postman (a standalone desktop/web app) and Thunder Client (a lightweight VS Code extension) solve that: you save each request once, organize them into a collection, and click to (re)send instead of retyping a command.",
      "Postman is the industry-standard choice — cloud sync, team-shared collections, environments (swap a base URL between \"local\" and \"staging\" with one click), and scripting for things like auto-extracting a token from a login response into later requests. Thunder Client is deliberately lighter: it lives right inside VS Code, so if you're already in your editor, there's no separate app to switch to — a real, common choice for smaller personal or solo projects like this one.",
      "This example ships a real, importable Postman collection (postman-collection.json) with four requests. Postman itself is a separate app you'd install yourself — it can't run inside this page — so below is a static illustration of what the real Postman window looks like with this exact collection open: a sidebar of saved requests on the left, the method/URL bar and Send button in the middle, the response panel underneath. Click a request in the sidebar to see its response change.",
      "Every status code and response body in that illustration is the exact real result already verified below by actually running these requests against a real server — nothing in it is invented, only the surrounding window chrome is a mockup rather than a screenshot of the real app.",
    ],
    extra: <PostmanMockUI />,
    demo: <PostmanCollectionRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ApiTestingTools/PostmanCollection/postman-collection.json",
      note: "A real Postman Collection v2.1 file — File → Import in Postman, point it at this file, and every request above shows up ready to send.",
    },
  },
  {
    heading: "The Plain-Text Format Underneath: .http Files",
    paragraphs: [
      "There's a third option that's neither a terminal command nor a proprietary app format: a plain .http file, read directly by VS Code's \"REST Client\" extension, Thunder Client itself, and JetBrains IDEs' built-in HTTP client. Each request is just plain text — a method, a URL, optional headers, and an optional body — separated by ### lines. No JSON schema to generate, no app to open; it's a real file that lives in your project and gets reviewed in a pull request like any other code.",
      "requests.http in this example has the same four requests, in the same plain-text format an extension would actually read. As with the Postman collection, the demo below sends those exact requests directly to prove they genuinely work — three different tools across this topic, all doing the identical underlying thing to the identical kind of API.",
    ],
    demo: <HttpRequestFileRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      {
        path: "examples/ApiTestingTools/HttpRequestFile/requests.http",
        note: "A real, plain-text request file — readable on its own even without the extension installed.",
      },
      {
        path: "examples/ApiTestingTools/HttpRequestFile/server.js",
        note: "A real, self-contained todos API just for this.",
      },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. curl, Postman, Thunder Client, and .http files are all doing the exact same underlying thing — sending a real HTTP request and showing you the real response — just with different amounts of ceremony and persistence. None of them are \"more correct\" than the others; picking one is a workflow preference, not a technical requirement. What actually matters is being comfortable manually exploring an API you're building BEFORE writing automated tests for it (Stage E) — you need to know what it actually does before you can assert what it should do.",
    ],
    extra: (
      <ComparisonCard
        tone="good"
        title="What to say in the interview"
        points={[
          "curl is the lowest-common-denominator tool — no install, works on any server/container/CI box, worth being genuinely fluent in.",
          "Postman and Thunder Client save/organize requests into collections — the real productivity win once you're testing more than one or two endpoints repeatedly.",
          ".http files are plain text, reviewable in a PR, and readable even without the extension that runs them — a real, lightweight alternative to a proprietary collection format.",
          "Manually exploring an API (any of these tools) is a genuinely different activity from automated testing (Jest/Supertest, Stage E) — one is exploration, the other is a regression safety net.",
        ]}
      />
    ),
  },
];

export default function ApiTestingToolsPage() {
  return (
    <StudyPage
      title="API Testing Tools: curl, Postman & Thunder Client"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="Now that there's a real Express app to poke at, here's how you'd actually explore it by hand — the same curl workflow already used to verify every demo in this app, plus the GUI alternatives (Postman, Thunder Client) and the plain-text .http format underneath them."
      sections={sections}
    />
  );
}
