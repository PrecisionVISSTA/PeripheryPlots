const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path'); 


const devConfig = {
  mode: 'development', 
  context: path.resolve(__dirname, 'demo'), 
  entry: './src/demo.js',
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

module.exports = (_, params) => {

  let isProduction = false === 'prod'; // via the webpack command
  let isDev = params && params.mode === 'development'; // via the webpack-dev-server command 

  if (isDev) return devConfig; 
  throw new Error('this shouldnt happen'); 

  // console.log("Production Build");

  // mode = 'production'; 
  // context = path.resolve(__dirname, 'app');
  // entry = './index.js';
  // output = {
  //   filename: "bundle.js",
  //   path: path.resolve(__dirname, './prod-dist'), 
  //   library: '',
  //   libraryTarget: 'commonjs2'
  // }; 

  // output = {
  //   filename: "bundle.js",
  //   path: path.resolve(__dirname, './dist'),
  // };

}
 