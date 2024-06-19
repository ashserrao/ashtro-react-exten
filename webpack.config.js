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
    systemcheck: path.join(
      __dirname,
      "src",
      "Pages",
      "Systemcheck",
      "index.jsx"
    ),
    softconfig: path.join(__dirname, "src", "Pages", "Softconfig", "index.jsx"),
    browserconfig: path.join(
      __dirname,
      "src",
      "Pages",
      "Browserconfig",
      "index.jsx"
    ),
    networkconfig: path.join(
      __dirname,
      "src",
      "Pages",
      "Networkconfig",
      "index.jsx"
    ),
    consent: path.join(__dirname, "src", "Pages", "Consent", "index.jsx"),
    id_scan: path.join(__dirname, "src", "Pages", "ID_scan", "index.jsx"),
    face_scan: path.join(__dirname, "src", "Pages", "Face_scan", "index.jsx"),
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "Popup", "index.html"),
      filename: "popup.html",
      chunks: ["popup", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "Pages",
        "Systemcheck",
        "index.html"
      ),
      filename: "systemcheck.html",
      chunks: ["systemcheck", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "Pages",
        "Softconfig",
        "index.html"
      ),
      filename: "softconfig.html",
      chunks: ["softconfig", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "Pages",
        "Browserconfig",
        "index.html"
      ),
      filename: "browserconfig.html",
      chunks: ["browserconfig", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "Pages",
        "Networkconfig",
        "index.html"
      ),
      filename: "networkconfig.html",
      chunks: ["networkconfig", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "Consent", "index.html"),
      filename: "consent.html",
      chunks: ["consent", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "ID_scan", "index.html"),
      filename: "id_scan.html",
      chunks: ["id_scan", "output"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "Pages", "Face_scan", "index.html"),
      filename: "face_scan.html",
      chunks: ["face_scan", "output"],
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
