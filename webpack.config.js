const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path'); 

module.exports = (env) => {

  let mode; 
  let context; 
  let entry; 
  let output; 
  let plugins = []; 
  let extraProps = {}; 
  let rules = [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }, 
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }
  ]; 

  let isProduction = env === 'prod'; // via the webpack command
  let isDev = env.NODE_ENV === 'dev'; // via the webpack-dev-server command 

  if (isProduction) {

    console.log("Production Build");

    mode = 'production'; 
    context = path.resolve(__dirname, 'app');
    entry = './index.js';
    output = {
      filename: "bundle.js",
      path: path.resolve(__dirname, './dist'), 
      library: '',
      libraryTarget: 'commonjs2'
    }; 

    // Minimizer
    // extraProps['optimization'] = { minimizer: [new TerserPlugin()] }; 

  } 
  else if (isDev) {

    mode = 'development';  
    context = path.resolve(__dirname, 'demo');
    entry = './src/demo.js'; 
    output = {
      filename: "bundle.js",
      path: path.resolve(__dirname, './dist'),
    };

    // HTML bundler 
    plugins.push(new HtmlWebPackPlugin({ template: './public/demo.html', filename: 'index.html' }));

    // We need to load the HTML for the demo page  
    rules.push({
      test: /\.html$/,
      use: [
        {
          loader: "html-loader"
        }
      ]
    }); 

    // add the a rule for loading css so we can load demo data into the app 
    rules.push({
      test: /\.(csv|tsv)$/,
      use: [
        'csv-loader'
      ]
    }); 

  }
  else {
    throw new Error("Unrecognized webpack config type"); 
  }

  let config = {
    mode, 
    context, 
    entry,
    output,
    module: {
      rules
    }, 
    resolve: {
      extensions: [".js", ".jsx"],
      alias: {
        react: path.resolve('./node_modules/react')
      }
    },
    plugins
  }; 

  Object.assign(config, extraProps); 

  console.log(config); 

  return config; 

}
 