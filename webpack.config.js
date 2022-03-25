// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack')


module.exports = env => {
  console.log('Development: ', env.dev); // true

	return {
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
			}),
			new CopyWebpackPlugin([
				{ from: 'public/assets/js', to: 'assets/js' }, // Copies webworkers
				{ from: 'public/_redirects', to: '_redirects' }
			]),
			new webpack.ProvidePlugin({
				Buffer: ['buffer', 'Buffer'],
			}),
            new webpack.DefinePlugin({
                'process.env.NODE_DEBUG': JSON.stringify('http')
            })
	//		new BundleAnalyzerPlugin
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
							],
							presets: ['@babel/preset-react', '@babel/preset-env'],
						}
					}
				},
				{
					test: /\.mjs$/,
					include: /node_modules/,
					type: 'javascript/auto'
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
			extensions: ['.mjs','.js', '.jsx', '.ts', '.tsx'],
			alias: {
				'react-hooks-worker': `${__dirname}/src`,
				'ds': `${__dirname}/src/ds`,
				'assets': `${__dirname}/src/assets`,
				'components': `${__dirname}/src/components`,
				'libs': `${__dirname}/src/libs`,
				'utils': `${__dirname}/src/utils`,
				'config': `${__dirname}/src/config`,
				'core': `${__dirname}/src/core`,
				'gql': `${__dirname}/src/gql`,
				'ethereum': `${__dirname}/src/ethereum`,
				'hooks': `${__dirname}/src/hooks`,
				'services': `${__dirname}/src/services`,
				'solana': `${__dirname}/src/solana`,
			},
			/*
			fallback: {
				util: require.resolve('util/'),
				assert: require.resolve('assert/'),
				buffer: require.resolve('buffer/'),
				process: require.resolve('process/browser'),
				stream: require.resolve("stream-browserify"),
				zlib: require.resolve("browserify-zlib")
			}
			*/
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
	}
};
