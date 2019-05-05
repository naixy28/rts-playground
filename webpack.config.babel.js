import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

// const path = require('path')

export default {
// module.exports = {
  devtool: 'eval',
  mode: 'development',
  entry: './src/index',
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
		chunkFilename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules:[
      // {
			//   test: /\.js$/,
			//   exclude: /node_modules/,
			//   use: {
			// 	loader: 'babel-loader'
			//   }
      // },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              import: true,
              importLoaders: 1,
              localIdentName: '[path]__[name]__[local]--[hash:base64:5]',
              // camelCase: true,
            }
          },
          'stylus-loader',
        ]
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader'
        }
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
			title: '模板',
			hash: false,
			filename: 'index.html',
			template: './index.html',
		})
  ],
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },
  resolve: {
		extensions: [
			'.jsx',
			'.js',
			'.ts',
			'.tsx'
		]
	}

}