const typescript = require("@rollup/plugin-typescript");
const { dts } = require("rollup-plugin-dts");

/** @type {import('rollup').RollupOptions} */
module.exports = [
  {
    input: "src/index.ts",
    output: {
      name: "fofajs",
      file: "dist/index.js",
      format: "umd",
    },
    external: ["node:process", "axios"],
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
