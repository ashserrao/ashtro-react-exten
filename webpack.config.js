// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebPackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const alias = {};
const fileExtensions = ["js", "jsx", "ts", "tsx", "css"];

const config = {
  entry: {
    background: path.join(__dirname, "src", "Background", "index.js"),
    content: path.join(__dirname, "src", "Content", "index.js"),
    popup: path.join(__dirname, "src", "Pages", "Popup", "index.jsx"),
    recording: path.join(__dirname, "src", "Pages", "Recording", "index.jsx"),
    output: path.join(__dirname, "src", "index.css"),
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => "." + extension)
      .concat([".js", ".jsx", ".ts", ".tsx", ".css"]),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //     template: 'index.html',
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "Popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "Recording", "index.html"),
      filename: "recording.html",
      chunks: ["recording", "output"],
    }),
    new CopyWebPackPlugin({
      patterns: [
        {
          from: "src/assets",
          to: path.join(__dirname, "dist", "assets"),
          force: true,
        },
      ],
    }),
    new CopyWebPackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "dist"),
          force: true,
        },
      ],
    }),

    new MiniCssExtractPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        exclude: /node_modules/,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
