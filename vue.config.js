const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    chainWebpack: config => {
        const svgRule = config.module.rule('svg')
        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    }
    // configureWebpack: {
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.svg$/,
    //                 loader: 'svg-sprite-loader',
    //                 include: [resolve('src/icons')],
    //                 options: {
    //                     symbolId: 'icon-[name]'
    //                 }
    //             }
    //         ]
    //     }
    // }
}