// 引入 babel 运行时环境
require('babel-core/register');
require('./src/main');
require('babel-core').transform('code', {
    plugins: ["transform-runtime"]
});