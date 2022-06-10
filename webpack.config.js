module.exports = {
  mode: 'development',
  target: ['browserslist'],
  entry: {
    main: `./src/ts/main.ts`
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/dist/assets/js`
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
