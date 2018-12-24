/**
 * /middleware/defines/session.js
 * @author John Kindem
 */

import session from 'koa-session';
import middlewareConfig from '../../configs/middleware';

const sessionConfig = middlewareConfig.session;

/**
 * session 中间件生成器
 * @param {Object} server 服务器对象
 * @returns {Function} 中间件
 */
export default (server) => {
    return session(sessionConfig, server);
};