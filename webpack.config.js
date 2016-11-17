var webpack = require('webpack');
// require("expose?FMark!./www/static/js/index.js");

module.exports = {
    entry: './www/static/js/index.js',
    output: {
        publicPath : 'dist',
        path: __dirname + '/www/static/dist/',
        filename: 'bundle.js'
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