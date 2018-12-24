import controllerConfig from '../../configs/controller';
import { Log } from '../../tool/log';
import regexConfig from '../../configs/regex';

// 获取正则
const normalRegex = regexConfig.normal;
const phoneRegex = regexConfig.phone;

const SequelizeOp = Sequelize.Op;

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
                case 'numbers':
                    // 获取参数
                    let warningNum = query.warningNum || null;

                    // 参数校验
                    if (!warningNum || !warningNum.match(normalRegex.naturalNumber)) {
                        Log.console.error('status 400', `wraningNum: ${wraningNum}`);
                        return ctx.response.status = 400;
                    }

                    // 参数类型转换
                    warningNum = parseInt(warningNum);

                    // 查询数据库
                    let phones;
                    try {
                        phones = await models.phone.findAll(
                            where: {
                                blockNum: {
                                    [SequelizeOp.gte]: warningNum
                                }
                            }
                        );
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // 结果列表
                    let result = [];

                    if (phones) {
                        phones.forEach((item) => {
                            result.push(item.number);
                        });
                    }

                    // 返回结果
                    return ctx.response.body = {
                        numbers: result
                    };
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
