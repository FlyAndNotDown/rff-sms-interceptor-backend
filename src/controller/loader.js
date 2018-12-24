/**
 * /controller/loader.js
 * @author John Kindem
 */

import controllerDefineList from './define';

/**
 * 控制器加载器
 * @constructor
 */
export class ControllerLoader {

    /**
     * 构造
     * @param {{}} router 路由对象
     * @param {{}} models 模型对象
     * @param {{}} db 数据库连接对象
     */
    constructor(router, models, db) {
        this.__router = router;
        this.__models = models;
        this.__db = db;
    }

    /**
     * 加载控制器
     */
    load() {
        controllerDefineList.forEach((controller) => {
            if (controller.get) {
                this.__router.get(controller.url, controller.get(this.__db, this.__models));
            }
            if (controller.post) {
                this.__router.post(controller.url, controller.post(this.__db, this.__models));
            }
            if (controller.put) {
                this.__router.put(controller.url, controller.put(this.__db, this.__models));
            }
            if (controller.delete) {
                this.__router.delete(controller.url, controller.delete(this.__db, this.__models));
            }
        });
    }

}
