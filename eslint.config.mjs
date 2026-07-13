import nextConfig from "eslint-config-next";

const eslintConfig = [
  // "Next Js/" and "JavaScript/" are separate sibling projects kept here
  // temporarily for reference only — each has its own tooling and isn't
  // part of this app.
  // "examples/**" holds standalone mini-projects, each with its own real
  // tooling/tsconfig — not part of this app's own lint/type surface.
  { ignores: ["Next Js/**", "JavaScript/**", "examples/**"] },
  ...nextConfig,
];

export default eslintConfig;
