/*eslint-disable*/
var path = require("path")
var webpack = require("webpack")

const paths = require('react-scripts/config/paths')
paths.appBuild = path.join(path.dirname(paths.appBuild),'../Zhuandown/Resources/Statics')

module.exports = function override(config, env) {
    const overrideConfig = {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    // 旧版 webpack 不会正确处理静态初始化块中的导入引用，先转换 Mermaid 的这类语法。
                    test: /\.m?js$/,
                    include: /node_modules[\\/](mermaid[\\/]dist|@mermaid-js[\\/]parser[\\/]dist)[\\/]/,
                    loader: require.resolve('babel-loader'),
                    options: {
                        babelrc: false,
                        configFile: false,
                        plugins: [require.resolve('@babel/plugin-proposal-class-static-block')],
                    },
                },
                {
                    test: require.resolve(path.join(__dirname, './src/assets/libs/snap.svg-min.js')),
                    use: 'imports-loader?this=>window,fix=>module.exports=0'
                }
            ]
        },
        resolve: {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                snapsvg: path.join(__dirname, './src/assets/libs/snap.svg-min.js')
            },
        },
        plugins: [
            ...config.plugins,
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser.js',
            }),
        ]
    }

    return overrideConfig;
}
