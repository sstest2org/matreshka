"use strict";

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: [
		'babel-polyfill',
		'./test/index'
	],
	output: {
		path: path.resolve(__dirname, '../dist/test'),
		filename: "bundle.js"
	},
	resolve: {
		fallback: path.resolve('./')
	},
	module: {
		preLoaders: [
			// transpile all files except testing sources with babel as usual
			{
				test: /\.js$/,
				include: path.resolve('test/'),
				exclude: [
					path.resolve('src/'),
					path.resolve('node_modules/')
				],
				loaders: ['babel', /*'eslint'*/]
			},
			// transpile and instrument only testing sources with babel-istanbul
			{
				test: /\.js$/,
				include: path.resolve('src/'),
				loaders: ['babel', /*'eslint'*/]
			}
		]
	},
	eslint: {
		configFile: '.eslintrc.json'
	},
	plugins: [
		 new CopyWebpackPlugin([{
			from: './test/browser-test'
		 }])
	]
};
