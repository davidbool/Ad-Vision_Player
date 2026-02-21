module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@redux': './src/redux',
          '@sagas': './src/sagas',
          '@services': './src/services',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@theme': './src/theme',
        },
      },
    ],
  ],
};
