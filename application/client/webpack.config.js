const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "s/[name].js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      { test: /\.(js|ts)x?$/, exclude: /node_modules/, use: "babel-loader" },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] },
      { resourceQuery: /binary/, type: "asset/bytes" },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "kuromoji$": path.resolve(__dirname, "node_modules/kuromoji/build/kuromoji.js"),
      "@ffmpeg/ffmpeg$": path.resolve(__dirname, "node_modules/@ffmpeg/ffmpeg/dist/esm/index.js"),
      "@ffmpeg/core$": path.resolve(__dirname, "node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js"),
      "@imagemagick/magick-wasm/magick.wasm$": path.resolve(__dirname, "node_modules/@imagemagick/magick-wasm/dist/magick.wasm"),
    },
    fallback: {
      fs: false,
      path: false,
      url: false,
      process: require.resolve("process/browser"),
      buffer: require.resolve("buffer/"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "c/[name].css" }),
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
    }),
  ],
  optimization: { minimize: isProduction },
};
