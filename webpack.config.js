// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { DIR, EXT = 'js' } = process.env;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: `./src/index.${EXT}`,
  output: {
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `./public/index.html`,
    }),
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
						plugins: ['@babel/plugin-transform-react-jsx']
					}
				}
			},
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
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
    },
  },
  devServer: {
    port: process.env.PORT || '3000',
    static: {
      directory: `./public`,
    },
    historyApiFallback: true,
  },
};
