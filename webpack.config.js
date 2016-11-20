var webpack = require('webpack');

module.exports = {
    entry: './www/static/js/index.js',
    output: {
        publicPath : 'dist',
        path: __dirname + '/www/static/dist/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.less/, loader: 'style!css!less'},
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
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}