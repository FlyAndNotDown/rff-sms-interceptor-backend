import controllerConfig from '../../configs/controller';
import { Log } from '../../tool/log';
import regexConfig from '../../configs/regex';

// 获取正则
const phoneRegex = regexConfig.phone;

export default {
    url: `${controllerConfig.commonUrlPrefix}/lable`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取参数
            const query = ctx.request.query || {};
            const type = query.type || null;

            // 参数校验
            if (!type) {
                Log.error('status 400', `type ${type}`);
                ctx.response.status = 400;
                return null;
            }

            // 根据不同的请求类型进行不同的处理
            switch (type) {
                case 'number':
                    // TODO
                case 'blockNum':
                    // TODO
                default:
                    Log.error('status 400', `type: ${type}`);
                    ctx.response.status = 400;
                    return null;
            }
        }
    }
}
