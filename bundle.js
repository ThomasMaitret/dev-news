import minify from "@node-minify/core";
import htmlMinifier from "@node-minify/html-minifier";
import cssnano from "@node-minify/cssnano";
import uglifyES from "@node-minify/uglify-es";
import fs from "fs-extra";

const DIRECTORY = "dist";

fs.removeSync(DIRECTORY);
fs.ensureDirSync(DIRECTORY);
fs.copySync("./src/favicon.svg", `${DIRECTORY}/favicon.svg`);

minify({
  compressor: uglifyES,
  input: "./src/main.js",
  output: `./${DIRECTORY}/main.js`,
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
