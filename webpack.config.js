// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const path = require('path');


module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: `./src/index.js`,
  output: {
		path: path.resolve(__dirname, 'build'),
		filename: "assets/js/[name].[contenthash:8].js",
		publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
			inject: true
    }),
		new InterpolateHtmlPlugin({
    PUBLIC_URL: './public' // can modify `static` to another name or get it from `process`
		})
  ],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						cacheCompression: false,
						plugins: [
							'@babel/plugin-transform-react-jsx',
							"@babel/plugin-transform-runtime",
							"@babel/plugin-syntax-dynamic-import",
							"@babel/plugin-proposal-class-properties"
						]
					}
				}
			},
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
		]
	},
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-hooks-worker': `${__dirname}/src`,
			'ds': `${__dirname}/src/ds`,
			'assets': `${__dirname}/src/assets`,
			'components': `${__dirname}/src/components`,
			'libs': `${__dirname}/src/libs`,
			'utils': `${__dirname}/src/utils`,
    },
  },
  devServer: {
    port: process.env.PORT || '3000',
		/*
    static: {
      directory: `./static`,
    },
		*/
    historyApiFallback: true,
  },
};
