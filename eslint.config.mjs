import nextConfig from "eslint-config-next";

const eslintConfig = [
  // "Next Js/" and "JavaScript/" are separate sibling projects kept here
  // temporarily for reference only — each has its own tooling and isn't
  // part of this app.
  { ignores: ["Next Js/**", "JavaScript/**"] },
  ...nextConfig,
];

export default eslintConfig;
