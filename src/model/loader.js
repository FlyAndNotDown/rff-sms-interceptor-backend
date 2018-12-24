/**
 * /model/loader.js
 * @author John Kindem
 */

import modelDefineObject from './define';

/**
 * 模型加载器
 */
export class ModelLoader {

    /**
     * 构造
     * @param {Object} db Seq实例化对象
     */
    constructor(db) {
        this.__models = {};
        const modelDefines = modelDefineObject.model;
        const relationDefines = modelDefineObject.relation;
        // 对每一个模型，都定义一个对应的模型对象
        modelDefines.forEach((modelDefine) => {
            this.__models[modelDefine.name] = db.define(modelDefine.name, modelDefine.description);
        });
        // 对每一个关系，都定义一组关系
        relationDefines.forEach((relationDefine) => {
            switch (relationDefine.type) {
                case 'm2m':
                    const name1 = relationDefine.owner[0];
                    const name2 = relationDefine.owner[1];
                    this.__models[name1].belongsToMany(this.__models[name2], { through: `${name1}${name2}` });
                    this.__models[name2].belongsToMany(this.__models[name1], { through: `${name1}${name2}` });
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 获取模型列表
     * @returns {{}|*} 模型加载起
     */
    getModels() {
        return this.__models;
    }

}
