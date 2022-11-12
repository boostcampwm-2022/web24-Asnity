const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 1%, not dead',
        useBuiltIns: 'usage',
        corejs: { version: '3' },
      },
    ],
    ['@babel/preset-react'],
    '@babel/preset-typescript',
  ],
  // webpack js로 세팅하면 빈 배열 넣어도 되는데, ts로 세팅하면 빈 배열을 허용하지 않음.
  // Error: .plugins[0] must include an object
  plugins: [[isDevelopment ? require.resolve('react-refresh/babel') : {}]],
};