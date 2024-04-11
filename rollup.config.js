const typescript = require("@rollup/plugin-typescript");

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: "src/index.ts",
  output: {
    name: "fofajs",
    file: "dist/index.js",
    format: "umd",
  },
  external: ["node:process", "axios"],
  plugins: [typescript()],
};
