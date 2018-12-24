/**
 * /middleware/defines/cors.js
 * @author John Kindem
 */

import cors from 'koa2-cors';
import middlewareConfig from '../../configs/middleware';

const corsConfig = middlewareConfig.cors;

/**
 * CORS 跨域认证中间件生成器
 * @returns {Function} 中间件
 */
export default () => {
    return cors(corsConfig);
};