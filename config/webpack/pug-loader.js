module.exports = {
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: "pug-loader"
          }
        ]
      }
    ]
  }
}
