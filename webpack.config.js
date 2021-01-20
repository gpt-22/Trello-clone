const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'static/js/app.js'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
