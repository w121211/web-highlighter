const path = require('path');
const {srcPath, basePath} = require('./paths');

module.exports = {
    entry: [
        path.resolve(basePath, 'src/index.ts')
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
        }],
    },
    output: {
        path: path.resolve(basePath, 'dist'),
        library: 'Highlighter',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@src': srcPath
        }
    }
};