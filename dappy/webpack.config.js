module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'rchain-token': 'RChainToken',
  },
};
