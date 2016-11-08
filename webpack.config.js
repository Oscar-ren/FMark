var webpack = require('webpack');

module.exports = {
    entry: './js/index.js',
    output: {
        path: __dirname,
        filename: './dist/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    externals: {
        jquery: 'window.$'
    },
    plugins: [
        new webpack.BannerPlugin('welcome to use FMark!')
    ],
    devServer: {
        inline: true
    }
}