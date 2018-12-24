/**
 * /controller/define/admin/login.js
 * @author John Kindem
 */

import controllerConfig from '../../configs/controller';
import { Log } from "../../tool/log";

/**
 * ${commonUrlPrefix}/test 控制器
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/test`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            let n = ctx.session.views || 0;
            ctx.session.views = ++n;
            ctx.body = n + ' views';
            return null;
        }
    }
}
