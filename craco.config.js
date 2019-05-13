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
    }
};