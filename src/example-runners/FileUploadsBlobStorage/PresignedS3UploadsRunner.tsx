import { execSync } from "node:child_process";

export default async function PresignedS3UploadsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/FileUploadsBlobStorage/PresignedS3Uploads",
  });

  return <>{output}</>;
}
