"use strict";

import minify from "@node-minify/core";
import htmlMinifier from "@node-minify/html-minifier";
import cssnano from "@node-minify/cssnano";
import terser from "@node-minify/terser";
import fs from "fs-extra";

const DIRECTORY = "dist";

fs.removeSync(DIRECTORY);
fs.ensureDirSync(DIRECTORY);
fs.copySync("./src/favicon.svg", `${DIRECTORY}/favicon.svg`);

minify({
  compressor: terser,
  input: "./src/main.js",
  output: `./${DIRECTORY}/main.js`,
  options: {
    module: true,
  },
});
minify({
  compressor: htmlMinifier,
  input: "./src/index.html",
  output: `./${DIRECTORY}/index.html`,
});
minify({
  compressor: cssnano,
  input: "./src/style.css",
  output: `./${DIRECTORY}/style.css`,
});
