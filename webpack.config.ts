import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackBar from 'webpackbar';
import { resolve } from 'path';

import type { Configuration } from 'webpack';
import 'webpack-dev-server';

const APP_ENV = process.env['APP_ENV'] as 'production' | 'development' | 'none';
const IS_ELECTRON = process.env['IS_ELECTRON'] as unknown as boolean;

export default function createConfig(): Configuration {
  return {
    mode: APP_ENV,
    target: 'web',
    devtool: APP_ENV === 'production' && IS_ELECTRON ? undefined : 'source-map',
    entry: resolve(__dirname, 'app/renderer/src/main.tsx'),
    output: {
      clean: true,
      path: resolve(__dirname, 'dist/renderer'),
      filename:
        APP_ENV === 'production' ? '[name].[contenthash:8].js' : 'bundle.js',
      chunkFilename:
        APP_ENV === 'production'
          ? '[name].[contenthash:8].chunk.js'
          : '[name].chunk.js',
    },
    devServer: {
      port: 6325,
      host: '127.0.0.1',
      allowedHosts: 'all',
      hot: true,
      static: true,
      devMiddleware: {
        stats: 'none',
      },
      watchFiles: {
        paths: ['./app/main/*', './app/preload/*', './app/renderer/*'],
      },
    },
    stats: 'none',
    resolve: {
      extensions: ['.tsx', '.jsx', '.ts', '.js', '.json', '.wasm'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        appTitle: '',
        filename: 'index.html',
        template: resolve(__dirname, 'app/renderer/index.html'),
        inject: 'head',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[chunkhash].css',
        ignoreOrder: true,
      }),
      new WebpackBar(),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: ['thread-loader', '@swc-node/loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  exportLocalsConvention: 'camelCase',
                  auto: true,
                  localIdentName:
                    APP_ENV === 'production'
                      ? '[hash:base64]'
                      : '[name]__[local]',
                },
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
  };
}
