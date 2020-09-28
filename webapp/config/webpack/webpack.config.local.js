/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const shared = require('./shared')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const paths = require('./paths')

let dist = process.env.DIST
if (!dist || dist === '') {
  dist = 'local'
}

// use same local development values as game client/server
process.env.GITCOMMIT = 'dev'

// if (dist === 'local') {
//   process.env.GITCOMMIT = require('child_process').execSync(
//     'git log -1 --date=iso --pretty=format:%H'
//   )
// }

const appConfig = require(`../webapp.${dist}.json`)

const main = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://0.0.0.0:5555',
  'webpack/hot/only-dev-server',
  'whatwg-fetch',
  './src/index.tsx'
]
// const vendor = shared.vendorEntry({
//   mainModules: main,
//   modulesToExclude: ['']
// })

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main: main,
    // vendor: vendor
  },
  node: {
    fs: 'empty',
    net: 'empty',
    child_process: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  optimization: {
    namedModules: true,
    namedChunks: true,
    // removeAvailableModules: false,
    // removeEmptyChunks: false,
    // splitChunks: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      // eslint: {
      //   files: './src/**/*.{ts,tsx}'
      // }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.GITCOMMIT': JSON.stringify(process.env.GITCOMMIT),
      'process.env.APP_CONFIG': `'${JSON.stringify(appConfig)}'`
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html',
      templateParameters: {
        gitcommit: ''
      }
    })
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: [paths.appSrc],
        loader: require.resolve('babel-loader'),
        options: {
          customize: require.resolve('babel-preset-react-app/webpack-overrides'),
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: [
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
            [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
            [
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  },
                },
              },
            ],
            require.resolve('@babel/plugin-transform-runtime'),

            [require.resolve('@emotion/babel-plugin'), {
              importMap: {
                "ethgas-app": {
                  "style": {
                    "canonicalImport": ["@emotion/styled", "default"],
                  },
                  "style": {
                    "canonicalImport": ["@emotion/core", "css"]
                  }
                }
              }
            }]
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          // cacheDirectory: true,
          // See #6846 for context on why cacheCompression is disabled
          cacheCompression: false,
          compact: false,
        },
      },


      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192000
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.png', '.jpg'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '~': path.join(process.cwd(), 'src'),
      '#': path.join(process.cwd(), 'src', 'components')
    },
    plugins: [new TsconfigPathsPlugin()]
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 5555,
    open: false,
    hot: true,
    historyApiFallback: true,
    stats: 'errors-only',
    disableHostCheck: true,
    contentBase: path.resolve(process.cwd(), 'src/public'),
    publicPath: '/'
  }
}
