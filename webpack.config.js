const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "src"),
          path.dirname(
            require.resolve("@skedwards88/shared-components/package.json"),
          ),
        ],
        loader: "babel-loader",
        options: {presets: ["@babel/env"]},
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {extensions: ["*", ".js", ".jsx"]},
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "bundle.[fullhash].js",
    clean: true, // removes unused files from output dir
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      // Need to use template because need 'root' div for react injection. templateContent doesn't play nice with title, so just use a template file instead.
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [{from: "./src/images/favicon.png", to: "./favicon.png"}],
      options: {
        concurrency: 100,
      },
    }),
  ],
  performance: {
    maxEntrypointSize: 280000,
    maxAssetSize: 280000,
  },
};
