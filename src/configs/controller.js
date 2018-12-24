/**
 * /configs/controller.js
 * @author John Kindem
 */

import mainConfig from './main';

/**
 * 导出控制器配置
 */
export default mainConfig.devMode ? {
    commonUrlPrefix: '/request/rff/sms'
} : {};
