var webpack = require('webpack');

module.exports = {
    entry: './www/static/js/index.js',
    output: {
        path: __dirname,
        filename: './www/static/dist/bundle.js'
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
    ]
}