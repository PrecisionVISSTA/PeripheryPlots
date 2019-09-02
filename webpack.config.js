const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path'); 

module.exports = {

  mode: 'development', 
  context: path.resolve(__dirname, 'demo'), 
  entry: './src/demo.js',
  output: {
    path: path.join(__dirname, "examples/dist"),
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebPackPlugin({ template: './public/demo.html', filename: 'index.html' })
  ], 
  module: {
    rules: [
      // babel transpilation from es6 to browser compatible javascript  
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }, 
      // Load .css assets
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Load .html assets
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }, 
      // Load .csv data for the demo 
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }

}; 