/**
 * /model/defines/model/setting.js
 * @author John Kindem
 */

import Sequelize from 'sequelize';

/**
 * export the "setting" model define
 */
export default {
    name: 'setting',
    description: {
        id: {
            type: Sequelize.BIGINT,
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: Sequelize.STRING(200)
        },
        value: {
            type: Sequelize.STRING(200)
        }
    }
}
