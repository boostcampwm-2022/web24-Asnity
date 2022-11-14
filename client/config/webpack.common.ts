import type { Configuration } from 'webpack';

import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

const isDevelopment = process.env.NODE_ENV === 'development';

function isTruthy<T>(
  value: T,
): value is Exclude<T, false | null | undefined | '' | 0> {
  return Boolean(value);
}

const config: Configuration = {
  context: __dirname,
  entry: '../src/index.tsx',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../public/index.html',
    }),
    new webpack.DefinePlugin({
      SIGN_IN_URL: JSON.stringify(
        'https://github.com/login/oauth/authorize?client_id=940294fcbf88a773fdc1',
      ),
      BASE_URL: JSON.stringify('http://localhost:8081'),
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(isTruthy),
};

export default config;
