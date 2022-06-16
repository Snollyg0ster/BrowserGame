const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    bundle: './src/index.tsx',
  },
  output: {
    filename: './[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?x?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|gif|jpg)$/,
        exclude: /fonts/,
        loader: 'file-loader',
      },
      {
        test: /\.(ttf|eot|woff|svg|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  watch: true,
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
    },
    compress: true,
    port: 9000,
  },
};
