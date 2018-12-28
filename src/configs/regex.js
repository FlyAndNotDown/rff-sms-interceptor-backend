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
    phone: {
        number: /^0?(13|14|15|17|18|19)[0-9]{9}$/
    }
} : {};
