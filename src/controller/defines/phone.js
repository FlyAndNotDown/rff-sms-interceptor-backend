import controllerConfig from '../../configs/controller';
import { Log } from '../../tool/log';
import regexConfig from '../../configs/regex';
import { Sequelize } from 'sequelize';

// 获取正则
const normalRegex = regexConfig.normal;
const phoneRegex = regexConfig.phone;

const SequelizeOp = Sequelize.Op;

/**
 * RESTful API
 * @description get 根据危险举报数量返回手机号码
 * * @param {'numbers'} type get类型
 * * @param {number} warningNum 危险举报数量
 * * @return {{ numbers: [] }} JSON数据
 * @description get 获取某个手机号码的被举报次数
 * * @param {'blockNum'} type get类型
 * * @param {string} number 手机号码
 * * @return {{ blockNum: number }} JSON数据
 * @description put 自增某一个手机号码的举报次数
 * * @param {string} number 手机号码
 * * @return {{ success: boolean }} JSON数据
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/phone`,
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
                        Log.error('status 400', `wraningNum: ${wraningNum}`);
                        return ctx.response.status = 400;
                    }

                    // 参数类型转换
                    warningNum = parseInt(warningNum);

                    // 查询数据库
                    let phones;
                    try {
                        phones = await models.phone.findAll({
                            where: {
                                blockNum: {
                                    [SequelizeOp.gte]: warningNum
                                }
                            }
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // 结果列表
                    let result = [];

                    if (phones) {
                        phones.forEach((item) => {
                            result.push({
                                number: item.number,
                                blockNum: item.blockNum
                            });
                        });
                    }

                    // 返回结果
                    return ctx.response.body = {
                        numbers: result
                    };
                case 'blockNum':
                    // 获取参数
                    let number = query.number || null;

                    // 参数校验
                    if (!number || !number.match(phoneRegex.number)) {
                        Log.error('status 400', `number: ${number}`);
                        return ctx.response.status = 400;
                    }

                    // 查询数据库
                    let phone;
                    try {
                        phone = await models.phone.findOne({
                            where: {
                                number: number
                            }
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // 返回结果
                    if (!phone) {
                        return ctx.response.body = {
                            blockNum: 0
                        };
                    }
                    return ctx.response.body = {
                        blockNum: phone.blockNum
                    };
                default:
                    Log.error('status 400', `type: ${type}`);
                    ctx.response.status = 400;
                    return null;
            }
        }
    },
    put: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取参数
            const requestBody = ctx.request.body || {};
            let number = requestBody.number || null;

            // 参数校验
            if (!number || !number.match(phoneRegex.number)) {
                Log.error('status 400', `number: ${number}`);
                ctx.response.status = 400;
                return null;
            }

            // 参数转换
            number = parseInt(number);

            // 查询数据库
            let phone;
            try {
                phone = await models.phone.findOne({
                    where: {
                        number: number
                    }
                });
            } catch (e) {
                Log.error('status 500', e);
                ctx.response.status = 500;
                return null;
            }

            // 如果没有查询到数据
            if (!phone) {
                // 存储新的电话号码
                try {
                    await models.phone.create({
                        number: number,
                        blockNum: 1
                    });
                } catch (e) {
                    Log.error('status 500', e);
                    ctx.response.status = 500;
                    return null;
                }

                return ctx.response.body = {
                    success: true
                };
            }

            // 自增举报数量
            try {
                await phone.increment('blockNum', {by: 1});
            } catch(e) {
                Log.error('status 500', e);
                ctx.response.status = 500;
                return null;
            }

            // 返回结果
            return ctx.response.body = {
                success: true
            };
        }
    }
}
