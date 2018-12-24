/**
 * /model/defines/model/label.js
 * @author John Kindem
 */

import Sequelize from 'sequelize';

/**
 * 导出标签模型定义
 */
export default {
    name: 'label',
    description: {
        id: {
            type: Sequelize.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(20)
        }
    }
};