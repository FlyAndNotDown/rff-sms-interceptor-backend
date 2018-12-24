/**
 * /middleware/defines/auto-log.js
 * @author John Kindem
 */

import { Log } from "../../tool/log";

/**
 * 服务器自动日志中间件生成器
 * @returns {Function} 中间件
 */
export default () => {
    return async (ctx, next) => {
        // 记录请求日志
        Log.log(`${ctx.request.method.toLowerCase()} ${ctx.request.url.split('?')[0]}`);

        await next();
    };
};