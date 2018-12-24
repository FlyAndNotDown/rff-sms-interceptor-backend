/**
 * /model/define.js
 * @author John Kindem
 */

import postModel from './defines/model/post';
import labelModel from './defines/model/label';
import adminModel from './defines/model/admin';
import settingModel from './defines/model/setting';
import postLabelRelation from './defines/relation/post-label';

/**
 * 导出定义对象
 */
export default {
    model: [
        postModel,
        labelModel,
        adminModel,
        settingModel
    ],
    relation: [
        postLabelRelation
    ]
};
