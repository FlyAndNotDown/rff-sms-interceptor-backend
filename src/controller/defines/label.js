/**
 * /controller/define/label.js
 * @author John Kindem
 * @description /${commonUrlPrefix}/label 控制器
 * @version v1.0
 */

import controllerConfig from '../../configs/controller';
import { Log } from '../../tool/log';

/**
 * ${commonUrlPrefix}/label 控制器
 * @description get 获取标签
 * * @param {'all'|'some'} type 获取类型
 * * @todo
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/label`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取类型参数
            const query = ctx.request.query || {};
            const type = query.type || null;

            // 参数校验
            if (!type) {
                Log.error('status 400', `type: ${type}`);
                ctx.response.status = 400;
                return null;
            }

            // 根据不同类型进行不同处理
            switch (type) {
                case 'all':
                    // 获取所有标签
                    let labels = null;
                    try {
                        labels = await models.label.findAll();
                    } catch (e) {
                        Log.error('status 500', e);
                        ctx.response.status = 500;
                        return null;
                    }
                    // 返回结果
                    let result = [];
                    labels.forEach(label => result.push({
                        id: label.id,
                        name: label.name
                    }));
                    ctx.response.body = {
                        labels: result
                    };
                    return null;
                case 'some':
                    // TODO
                    return null;
                default:
                    Log.error('status 400', `type ${type}`);
                    ctx.response.status = 400;
                    return null;
            }
        };
    }
}
