const nodeExternals = require("webpack-node-externals");

module.exports = (options) => ({
  ...options,
  externals: [nodeExternals({ allowlist: ["@extraufla/shared"] })],
  resolve: {
    ...options.resolve,
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
});
