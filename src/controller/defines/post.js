/**
 * /controller/define/post.js
 * @author John Kindem
 */

import controllerConfig from '../../configs/controller';
import regexConfig from '../../configs/regex';
import { Log } from "../../tool/log";
import Sequelize from 'sequelize';

const postRegex = regexConfig.post;
const normalRegex = regexConfig.normal;

const SequelizeOp = Sequelize.Op;

/**
 * ${commonUrlPrefix}/post 控制器
 * @description get 获取文章内容
 * * @param {'summary'|'detail'|'count'|'archive'|'label'} type 获取文章内容的类型 (summary 文章概述列表 | detail 详情 | count 总数 | archive 归档)
 * * @param {number} id 文章 id (where type === 'detail')
 * * @param {number} start post summary list range - start (where type === 'summary')
 * * @param {number} length post summary list range - length (where type === 'summary')
 * * @param {number} labelId label id (where type === 'label')
 * @description post 新建文章
 * * @param {string} title 标题
 * * @param {string} body 文章主体
 * * @param {string} description 描述
 * * @param {[id: number]} labels 标签id数组
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/post`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 获取参数
            const query = ctx.request.query || {};
            const type = query.type || null;

            // 校验参数
            if (!type) {
                Log.error('status 400', `type: ${type}`);
                return ctx.response.status = 400;
            }

            // 根据不同类型进行不同处理
            switch (type) {
                // 如果是获取文章概述
                case 'summary':
                    // get the params
                    let start = query.start || null;
                    let length = query.length || null;

                    // check the params
                    if (!start || !start.match(normalRegex.naturalNumber)) {
                        Log.error('status 400', `start: ${start}`);
                        return ctx.response.status = 400;
                    }
                    if (!length || !length.match(normalRegex.naturalNumber)) {
                        Log.error('status 400', `length: ${length}`);
                        return ctx.response.status = 400;
                    }

                    // parse the variants from string to integer
                    start = parseInt(start);
                    length = parseInt(length);

                    // query db for posts
                    // if start === 0, query the latest ${length} posts
                    let posts;
                    try {
                        posts = await models.post.findAll(
                            start === 0 ? {
                                order: [
                                    ['id', 'DESC']
                                ],
                                limit: length
                            } : {
                                where: {
                                    id: {
                                        [SequelizeOp.lt]: start
                                    }
                                },
                                order: [
                                    ['id', 'DESC']
                                ],
                                limit: length
                            }
                        );
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // define the result list
                    let result = [];

                    // iteration for dealing datas
                    // by the way, query the labels data in the iteration
                    try {
                        // for every post, do something
                        for (let i = 0; i < posts.length; i++) {
                            // do query labels
                            let dbLabels = await posts[i].getLabels();
                            let labels = [];
                            for (let j = 0; j < dbLabels.length; j++) {
                                labels.push({
                                    key: dbLabels[j].id,
                                    name: dbLabels[j].name
                                });
                            }

                            // deal with time
                            const createdAt = posts[i].createdAt;
                            const date = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDay()}`;

                            result.push({
                                key: posts[i].id,
                                title: posts[i].title,
                                description: posts[i].description,
                                body: posts[i].body,
                                date: date,
                                labels: labels
                            });
                        }
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    return ctx.response.body = {
                        posts: result
                    };
                // 如果是获取单篇文章详情
                case 'detail':
                    // 获取参数
                    const id = query.id || null;

                    // 参数校验
                    if (!id || !id.match(normalRegex.naturalNumber)) {
                        Log.error('status 400', `id: ${id}`);
                        return ctx.response.status = 400;
                    }

                    let post;
                    // 查询 post 详情
                    try {
                        post = await models.post.findOne({
                            where: {
                                id: id
                            }
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // 如果没有查询到对应的文章
                    if (!post) {
                        return ctx.response.body = {
                            post: null
                        };
                    }

                    // 查询标签
                    let postLabels;
                    try {
                        postLabels = await post.getLabels();
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // 数据处理
                    let labels = [];
                    postLabels.forEach(label => {
                        labels.push({
                            key: label.id,
                            name: label.name
                        });
                    });

                    // 处理时间
                    const createdAt = post.createdAt;
                    const date = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDay()}`;

                    // 响应客户端
                    return ctx.response.body = {
                        post: {
                            key: post.id,
                            title: post.title,
                            description: post.description,
                            body: post.body,
                            date: date,
                            labels: labels
                        }
                    };
                // 如果是获取文章总数
                case 'count':
                    // do query
                    let count;
                    try {
                        count = await models.post.count();
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // response the client
                    return ctx.response.body = {
                        count: count || 0
                    };
                // 获取文章归档内容
                case 'archive':
                    // do query
                    let archivePosts;
                    try {
                        archivePosts = await models.post.findAll({
                            attributes: ['id', 'title', 'createdAt'],
                            order: [
                                ['id', 'DESC']
                            ]
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // check the result is not null
                    if (!archivePosts) {
                        return ctx.response.body = {
                            posts: []
                        };
                    }

                    // deal the posts
                    let archiveResult = [];
                    archivePosts.forEach(post => {
                        // get the created time
                        const createdAt = post.createdAt;
                        // get the year and
                        const year = createdAt.getFullYear();
                        const month = createdAt.getMonth();
                        const day = createdAt.getDay();

                        // judge if the month list already exist
                        let find = false;
                        for (let i = 0; i < archiveResult.length; i++) {
                            if (archiveResult[i].year === year &&
                                archiveResult[i].month === month) {
                                    // add it to the list
                                    archiveResult[i].posts.push({
                                        id: post.id,
                                        title: post.title,
                                        day: day
                                    });
                                    find = true;
                                    break;
                                }
                        }

                        // if not found, create a new list and add it to this list
                        if (!find) {
                            archiveResult.push({
                                year: year,
                                month: month,
                                posts: []
                            });
                        }
                    });

                    // return the result to client
                    return ctx.response.body = {
                        posts: archiveResult
                    };
                case 'label':
                    // get the params
                    const labelId = query.labelId || null;

                    // check the params
                    if (!labelId || !labelId.match(normalRegex.naturalNumber)) {
                        Log.error('status 400', `labelId: ${labelId}`);
                        return ctx.response.status = 400;
                    }

                    // do the query
                    let label;
                    try {
                        label = await models.label.findOne({
                            where: {
                                id: labelId
                            }
                        });
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    // if can't find label
                    // return null
                    if (!label) {
                        return ctx.response.body = {
                            posts: []
                        };
                    }

                    // get posts
                    let labelPosts;
                    try {
                        labelPosts = await label.getPosts();
                    } catch (e) {
                        Log.error('status 500', e);
                        return ctx.response.status = 500;
                    }

                    labelPosts = labelPosts || [];

                    // define the result
                    let labelPostsResult = [];

                    // for every post, do something
                    for (let i = 0; i < labelPosts.length; i++) {
                        // deal with time
                        const createdAt = labelPosts[i].createdAt;
                        const date = `${createdAt.getFullYear()}-${createdAt.getMonth()}-${createdAt.getDay()}`;

                        labelPostsResult.push({
                            key: labelPosts[i].id,
                            title: labelPosts[i].title,
                            date: date
                        });
                    }

                    // return the result
                    return ctx.response.body = {
                        posts: labelPostsResult
                    };
                default:
                    Log.error('status 400', `type: ${type}`);
                    return ctx.response.status = 400;
            }
        };
    },
    post: (db, models) => {
        return async (ctx, next) => {
            await next();

            // 校验管理员登录情况
            if (!ctx.session.adminLogin) {
                // 如果没有登录
                Log.error('status 401', `session.adminLogin: ${ctx.session.adminLogin}`);
                ctx.response.status = 401;
                return null;
            }

            // 如果已经登录了，则允许新建文章
            // 获取参数
            const requestBody = ctx.request.body || {};
            const title = requestBody.title || null;
            const body = requestBody.body || null;
            const description = requestBody.description || null;
            const labels = requestBody.labels || null;

            // 参数校验
            if (!title || !title.match(postRegex.title)) {
                Log.error('status 400', `title: ${title}`);
                ctx.response.status = 400;
                return null;
            }
            if (!description || !description.match(postRegex.description)) {
                Log.error('status 400', `description: ${description}`);
                ctx.response.status = 400;
                return null;
            }

            // TODO xss 过滤器

            // 查询所有标签
            let dbLabelObjects;
            let dbLabelMapFromIdToObjectList = [];
            try {
                dbLabelObjects = await models.label.findAll();
                dbLabelObjects.forEach(object => dbLabelMapFromIdToObjectList.push({
                    key: object.id,
                    value: object
                }));
            } catch (e) {
                Log.error('status 500', e);
                ctx.response.status = 500;
                return null;
            }

            // 看传过来的标签是否都在这个列表中
            let needLabelObjects = [];
            try {
                labels.forEach(labelId => {
                    let find = false;
                    for (let i = 0; i < dbLabelMapFromIdToObjectList.length; i++) {
                        if (dbLabelMapFromIdToObjectList[i].key === labelId) {
                            find = true;
                            needLabelObjects.push(dbLabelMapFromIdToObjectList[i].value);
                            break;
                        }
                    }
                    // 如果不在，则报错
                    if (!find) throw new Error(`label ${labelId} not found in database`);
                });
            } catch (e) {
                Log.error('status 400', e);
                ctx.response.status = 400;
                return null;
            }

            // 存入数据库
            // 先存基础对象
            let newPost;
            try {
                newPost = await models.post.create({
                    title: title,
                    description: description,
                    body: body
                });
            } catch (e) {
                Log.error('status 500', e);
                ctx.response.status = 500;
                return null;
            }

            // 设置标签关系
            try {
                await newPost.setLabels(needLabelObjects);
            } catch (e) {
                Log.error('status 500', e);
                ctx.response.status = 500;

                // 回滚
                if (newPost) {
                    await models.post.destroy({
                        where: {
                            id: newPost.id
                        }
                    });
                }

                return null;
            }

            // 设置完成之后则返回成功
            ctx.response.body = {
                success: true
            };
            return null;
        };
    }
}
