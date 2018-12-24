/**
 * /middleware/define/body-parser.js
 * @author John Kindem
 */

import bodyParser from 'koa-bodyparser';

/**
 * body 转 json 中间件生成器
 * @returns {Function} 中间件
 */
export default () => {
    return bodyParser();
};