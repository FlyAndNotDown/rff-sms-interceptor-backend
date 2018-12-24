/**
 * /configs/middleware.js
 * @author John Kindem
 */

import mainConfig from './main';

/**
 * 导出中间件配置
 */
export default mainConfig.devMode ? {
    cors: {
        origin: 'http://localhost:20000',
        credentials: true
    },
    session: {
        key: 'sessionid',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false
    }
} : {};