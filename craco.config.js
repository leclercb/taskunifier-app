const CracoAntDesignPlugin = require("craco-antd");

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
        configure: webpackConfig => {
            webpackConfig.module.rules.push({
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            });

            return webpackConfig;
        }
    }
};