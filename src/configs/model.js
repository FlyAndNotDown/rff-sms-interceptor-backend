/**
 * /configs/model.js
 * @author John Kindem
 */

import mainConfig from './main';

/**
 * 导出模型配置
 */
export default mainConfig.devMode ? {
    connection: {
        database: 'blog',
        username: 'development',
        password: 'development',
        options: {
            host: '134.175.59.165',
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false,
            operatorsAliases: false
        }
    }
} : {};