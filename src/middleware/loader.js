/**
 * /middleware/loader.js
 * @author John Kindem
 */

import middlewareDefineList from './define';

/**
 * 中间件加载器
 * @constructor
 */
export class MiddlewareLoader {

    /**
     * 构造
     * @param {{}} server 服务器对象
     */
    constructor(server) {
        this.__server = server;
    }

    /**
     * 加载
     */
    load() {
        middlewareDefineList.forEach((middleware) => {
            this.__server.use(middleware(this.__server));
        });
    }

}
