/**
 * /configs/regex.js
 * @author John Kindem
 */

import mainConfig from './main';

/**
 * 导出正则配置
 */
export default mainConfig.devMode ? {
    /**
     * 通用正则
     */
    normal: {
        naturalNumber: /^[1-9]\d*|0$/
    },
    admin: {
        username: /^[0-9a-z]{6,16}$/,
        password: /^[0-9a-z@#]{6,16}$/,
        passwordHash: /^[0-9a-f]{64,64}$/,
        name: /^[0-9a-z]{6,16}$/,
        phone: /^[0-9]{11}$/
    },
    post: {
        title: /^.{1,100}$/,
        description: /^.{1,1000}$/
    }
} : {};
