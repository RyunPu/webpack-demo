const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
// const AutoDllPlugin = require('autodll-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')

module.exports = (env, argv) => {
  const publicPath = ''
  const isProd = argv.mode === 'production'
  const resolve = (dir) => path.resolve(__dirname, dir)
  const config = isProd ? require('./webpack.prod.config') : require('./webpack.dev.config')

  return merge(config(), {
    entry: {
      main: './src/js/index.js',
    },

    output: {
      path: resolve('dist'),
      filename: 'static/js/[name]_[hash:5].js',
      publicPath
    },

    resolve: {
      modules: [
        resolve('node_modules')
      ],
      extensions: ['.js'],
      alias: {
        '@': resolve('./src')
      }
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        }
      }),
      new HardSourceWebpackPlugin(),
      /*new AutoDllPlugin({
        inject: true,
        filename: 'dll~[name]_[hash:5].js',
        path: './static/js',
        entry: {
          main: [
            'jquery',
            'popper.js',
            'bootstrap',
          ]
        }
      }),*/
      new WebpackCdnPlugin({
        modules: [
          {
            name: 'bootstrap',
            cssOnly: true,
            style: 'dist/css/bootstrap.min.css'
          },
          {
            name: 'jquery',
            var: 'jQuery',
            path: 'dist/jquery.slim.min.js'
          },
          {
            name: 'popper.js',
            path: 'dist/umd/popper.min.js'
          },
          {
            name: 'bootstrap',
            path: 'dist/js/bootstrap.min.js'
          }
        ],
        prod: isProd,
        prodUrl: '//cdn.jsdelivr.net/npm/:name@:version/:path',
        publicPath: '/node_modules'
      }),
    ],

    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')()
                ]
              }
            },
            'sass-loader'
          ]
        },

        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-transform-runtime'
                ]
              }
            }
          ]
        },

        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                attrs: ['img:src']
              }
            }
          ]
        },

        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                outputPath: 'static/images',
                publicPath: `${publicPath}/static/images`,
                esModule: false
              }
            },
            {
              loader: 'img-loader',
              options: {
                plugins: isProd && [
                  require('imagemin-mozjpeg')({
                    quality: 50
                  }),
                  require('imagemin-pngquant')({
                    quality: [0.4, 0.6]
                  }),
                ]
              }
            },
          ]
        },
      ]
    }
  })
}
