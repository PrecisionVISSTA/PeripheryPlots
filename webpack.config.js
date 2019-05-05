const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development', 
  context: __dirname + "/app",
  entry: "./app.js",
  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  }, 
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
    })
  ]
}
