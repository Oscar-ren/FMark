var gulp = require('gulp');
var budo = require('budo')
var babelify = require('babelify');

gulp.task('server', function() {

    return budo('./index.js', {
        live: true,             // setup live reload
        port: 8000,             // use this port
        browserify: {
            transform: babelify   // ES6
        }
    }).on('connect', function (ev) {
        console.log('Server running on %s', ev.uri)
        console.log('LiveReload running on port %s', ev.livePort)
    }).on('update', function (buffer) {
        console.log('bundle - %d bytes', buffer.length)
    })
})

gulp.task('default', ['server']);

