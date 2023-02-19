const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
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
  ],
  performance: {
    maxEntrypointSize: 280000,
    maxAssetSize: 280000
  },
};
