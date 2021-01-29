// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: "/",
  },
  buildOptions: {
    out: "dist",
  },
  optimize: {
    bundle: true,
    minify: true,
    target: "es2020",
    treeshake: true,
    splitting: true,
  },
};
