module.exports = () => ({
  devtool: 'cheap-module-eval-source-map',

  devServer: {
    hot: true,
    clientLogLevel: 'error',
    before(app, server) {
      server._watch('./index.html')
    }
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'singletonStyleTag' }
          }
        ]
      },
    ]
  }
})
