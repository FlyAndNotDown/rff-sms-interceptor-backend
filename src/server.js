/**
 * /server.js
 * @author John Kindem
 */

import { ModelLoader } from "./model/loader";
import { ControllerLoader } from "./controller/loader";
import { MiddlewareLoader } from "./middleware/loader";
import Sequelize from 'sequelize';
import Koa from 'koa';
import routerGenerator from 'koa-router';
import { Log } from "./tool/log";
import modelConfig from './configs/model';
import serverConfig from './configs/server';

const connectionConfig = modelConfig.connection;

/**
 * 服务器类
 * @constructor
 */
export class Server {

    /**
     * 构造
     */
    constructor() {
        this.__server = null;
        this.__models = null;
        this.__db = null;
        this.__router = null;
    }

    /**
     * 初始化函数
     * @private
     */
    __init() {
        Log.log('开始初始化服务器');
        // 创建 koa 对象
        this.__server = new Koa();
        // 设置 keys
        this.__server.keys = serverConfig.keys;
        // 创建路由
        this.__router = routerGenerator();
        // 实例化 sequelize 对象
        this.__db = new Sequelize(
            connectionConfig.database,
            connectionConfig.username,
            connectionConfig.password,
            connectionConfig.options
        );
    }

    /**
     * 加载模型函数
     * @private
     */
    __loadModel() {
        Log.log('开始加载模型');
        this.__models = new ModelLoader(this.__db).getModels();
    }

    /**
     * 加载控制器函数
     * @private
     */
    __loadController() {
        Log.log('开始加载控制器');
        new ControllerLoader(this.__router, this.__models, this.__db).load();
        // 使用路由
        this.__server.use(this.__router.routes());
    }

    /**
     * 加载中间件函数
     * @private
     */
    __loadMiddleware() {
        Log.log('开始加载中间件');
        new MiddlewareLoader(this.__server).load();
    }

    /**
     * 开始监听
     * @private
     */
    __listen() {
        Log.log('开始监听端口');
        this.__server.listen(serverConfig.listenPort);
    }

    /**
     * 开启服务器
     */
    start() {
        this.__init();
        this.__loadModel();
        this.__loadMiddleware();
        this.__loadController();
        this.__listen();
        Log.log('服务器正在运行');
        return this;
    }

}
