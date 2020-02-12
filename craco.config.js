const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin
        }
    ],
    jest: {
        configure: jestConfig => {
            jestConfig.transformIgnorePatterns = [];
            return jestConfig;
        }
    },
    webpack: {
        alias: {
            fs: path.resolve(__dirname, 'src/mock-fs.js')
        },
        configure: webpackConfig => {
            webpackConfig.module.rules.push({
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            });

            return webpackConfig;
        }
    }
};