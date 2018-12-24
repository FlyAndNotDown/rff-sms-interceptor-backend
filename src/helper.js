/**
 * /script.js
 * @author John Kindem
 */

import modelConfig from './configs/model';
import Sequelize from 'sequelize';
import { Log } from "./tool/log";
import { ModelLoader } from "./model/loader";
import readline from 'readline';
import regexConfig from "./configs/regex";

const connectionConfig = modelConfig.connection;

/**
 * 同步函数
 * @param {boolean} force 同步是否为强制
 */
let syncFunc = async (force) => {
    Log.log('连接到数据库');
    const db = new Sequelize(
        connectionConfig.database,
        connectionConfig.username,
        connectionConfig.password,
        connectionConfig.options
    );

    // 加载模型配置
    new ModelLoader(db).getModels();
    try {
        await db.sync({ force: force });
    } catch(e) {
        Log.error(`同步失败`, e);
    }
    Log.log(`同步成功`);
    process.exit(0);
};

/**
 * 对应脚本输入的处理函数
 */
const funcMap = {
    /**
     * 数据库操作
     */
    db: {
        /**
         * 测试数据库连接
         */
        test: () => {
            Log.log('开始测试数据库连接');
            const db = new Sequelize(
                connectionConfig.database,
                connectionConfig.username,
                connectionConfig.password,
                connectionConfig.options
            );
            db
                .authenticate()
                .then(() => {
                    Log.log('连接成功');
                    process.exit(0);
                })
                .catch((error) => {
                    Log.error('连接失败', error);
                    process.exit(0);
                });
        },
        /**
         * 同步数据库
         */
        sync: () => {
            syncFunc(false);
        },
        /**
         * 强制同步数据库
         */
        force: {
            sync: () => {
                syncFunc(true);
            }
        }
    }
};

/**
 * 脚本
 */
(function () {

    const argv = process.argv;
    let temp = funcMap;
    argv.forEach((words, key) => {
        if (key > 1) {
            temp = temp[words] || null;
            if (!temp) {
                Log.error('参数读取错误');
            }
        }
    });
    if (typeof temp === 'function') {
        temp();
    }

}());
