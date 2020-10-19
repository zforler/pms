const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

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

        config.module.rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/).exclude.add(path.resolve(__dirname, './src/icons')).end()
            .use('url-loader')
            .loader('file-loader')
            .options({
                // name: './img/[name].[hash:8].[ext]'
                name: './img/[name].[ext]'
            })
        if(process.env.NODE_ENV=='production'){
            config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin,[
                {
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' +  ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                }])
        }

        // config.externals(
        //    {
        //     vue: 'Vue',
        //     'vue-router': 'VueRouter'
        //     }
        // )
    },
    devServer: {
        // 配置代理
        proxy: {
            //代理接口前缀为/api的请求
            '/': {
                target: 'http://127.0.0.1:7903', //需要代理到的目标地址
                // ws: true,
                changOrigin: true, //是否跨域
                pathRewrite: {
                    '^/': '' //重写路径
                }
            }
        }
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