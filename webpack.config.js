const path = require('path');

module.exports = {
  mode: 'production',
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  entry: './src/renderer.js',
  output: {
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, 'src'),
  },
  optimization: {
    minimize: true,
    sideEffects: true,
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            cacheDirectory: true,
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      }
    ]
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 1024 * 1024,
    maxEntrypointSize: 2 * 1024 * 1024
  }
}; 