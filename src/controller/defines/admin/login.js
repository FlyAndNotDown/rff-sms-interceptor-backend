/**
 * /controller/define/admin/login.js
 * @author John Kindem
 */

import controllerConfig from '../../../configs/controller';
import regexConfig from '../../../configs/regex';
import { Log } from "../../../tool/log";

const adminRegex = regexConfig.admin;

/**
 * ${commonUrlPrefix}/admin/login 控制器
 * @description get 获取盐获取登录状态
 * * @param {'salt'|'info'} type 获取内容类型
 * * @param {string} username 用户名
 * @description post 登录校验
 * * @param {string} username 用户名
 * * @param {string} password 密码sha256Hash值
 * @description delete 注销
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/admin/login`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取参数
            const query = ctx.request.query || {};
            const type = query.type || null;
            const username = query.username || null;

            // 参数校验
            if (!type) {
                Log.error('status 400', `type: ${type}`);
                ctx.response.status = 400;
                return null;
            }

            // 根据 get 的类型进行处理
            switch (type) {
                case 'salt':
                    // 如果是获取盐
                    // 参数校验
                    if (!username || !username.match(adminRegex.username)) {
                        Log.error('status 400', `username: ${username}`);
                        ctx.response.status = 400;
                        return null;
                    }

                    let admin;
                    try {
                        // 查询管理员用户
                        admin = await models.admin.findOne({
                            where: {
                                username: username
                            }
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        ctx.response.status = 500;
                        return null;
                    }

                    // 如果管理员的用户名不存在，则返回结果
                    if (!admin) {
                        ctx.response.body = {
                            salt: null
                        };
                        return null;
                    }

                    // 如果查到了管理员信息，返回盐
                    ctx.response.body = {
                        salt: admin.salt
                    };
                    return null;
                case 'info':
                    // 查询 session
                    ctx.response.body = {
                        login: !!ctx.session.adminLogin,
                        info: ctx.session.adminInfo || null
                    };
                    return null;
                default:
                    Log.error('status 400', `type: ${type}`);
                    ctx.response.status = 400;
                    return null;
            }
        };
    },
    post: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取参数
            const body = ctx.request.body || {};
            const username = body.username || null;
            const password = body.password || null;

            // 参数校验
            if (!username || !username.match(adminRegex.username)) {
                Log.error('参数错误', `username: ${username}`);
                ctx.response.status = 400;
                return null;
            }
            if (!password || !password.match(adminRegex.passwordHash)) {
                Log.error('参数错误', `password: ${password}`);
                ctx.response.status = 400;
                return null;
            }

            // 查询数据库获取管理员对象
            let admin;
            try {
                admin = await models.admin.findOne({
                    where: {
                        username: username
                    }
                });
            } catch (e) {
                Log.error('status 500', e);
                ctx.response.status = 500;
                return null;
            }

            // 如果没有查到
            if (!admin) {
                ctx.response.body = {
                    success: false
                };
                return null;
            }

            // 如果查到了，进行密码校验
            if (admin.password !== password) {
                // 如果校验失败
                ctx.response.body = {
                    success: false
                };
                return null;
            }

            // 如果校验成功
            // 在 session 中保存登录状态
            ctx.session.adminLogin = true;
            ctx.session.adminInfo = {
                id: admin.id,
                name: admin.name,
                username: admin.username,
                phone: admin.phone
            };

            // 返回结果
            ctx.response.body = {
                success: true
            };
            return null;
        };
    },
    delete: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 删除 session 中的登录信息
            ctx.session.adminLogin = false;
            ctx.session.adminInfo = null;
        };
    }
};
