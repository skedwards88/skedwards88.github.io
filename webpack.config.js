const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  mode: "development",
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
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000",
    hotOnly: false,
  },
  plugins: [new HtmlWebpackPlugin({
    // title: 'CnS Games 4',
    // favicon: "./src/images/favicon.png",
    // meta: {viewport: 'width=device-width, initial-scale=1'},
  //   templateContent: `
  //   <html>
  //     <body>
  //       <div id="root"></div>
  //     </body>
  //   </html>
  // `,
  inject: true,
  template: "./src/index.html"
  })],
};
