/**
 * /model/defines/model/post.js
 * @author John Kindem
 */

import Sequelize from 'sequelize';

/**
 * 导出文章模型定义
 */
export default {
    name: 'post',
    description: {
        id: {
            type: Sequelize.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING(100)
        },
        description: {
            type: Sequelize.STRING(1000)
        },
        body: {
            type: Sequelize.TEXT
        }
    }
};