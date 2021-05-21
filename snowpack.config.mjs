export default {
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
