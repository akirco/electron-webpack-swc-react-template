import { resolve } from 'path';
import { EnvironmentPlugin } from 'webpack';

const { APP_ENV } = process.env;

export default {
  mode: APP_ENV,
  target: 'node',
  entry: {
    main: resolve(__dirname, 'app/main/main.ts'),
    preload: resolve(__dirname, 'app/preload/preload.ts'),
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist/electron'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new EnvironmentPlugin({ APP_ENV })],
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        loader: '@swc-node/loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    electron: 'require("electron")',
  },
};
