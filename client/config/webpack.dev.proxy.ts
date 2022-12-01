import 'webpack-dev-server';

import type { Configuration } from 'webpack';

import { merge } from 'webpack-merge';

import common from './webpack.common';

const config: Configuration = {
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/': 'http://49.50.167.202/',
    },
  },
};

export default merge(common, config);
