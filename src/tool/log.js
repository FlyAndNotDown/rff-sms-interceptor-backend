/**
 * /tool/log.js
 * @author John Kindem
 */

import mainConfig from '../configs/main';

/**
 * 日志类
 * @constructor
 */
export class Log {

    /**
     * 记录生产日志
     * @param {string} context 内容
     * @param {string|Object} detail 详情
     */
    static log(context, detail) {
        if (mainConfig.log) {
            console.log(`[log] ${context}`);
            if (detail) {
                if (mainConfig.devMode && typeof detail === 'object') {
                    return console.log(detail.stack);
                }
                let lines = detail.split('\n');
                lines.forEach(line => {
                    console.log(`      ${line}`);
                });
            }
        }
    }

    /**
     * 记录生产错误
     * @param {string} context 内容
     * @param {string|Object} detail 详情
     */
    static error(context, detail) {
        if (mainConfig.log) {
            console.log(`[err] ${context}`);
            if (detail) {
                if (mainConfig.devMode && typeof detail === 'object') {
                    return console.log(detail.stack);
                }
                let lines = detail.split('\n');
                lines.forEach(line => {
                    console.log(`      ${line}`);
                });
            }
        }
    }

    /**
     * 记录开发日志
     * @param {string} context 内容
     * @param {string} detail 详情
     */
    static devLog(context, detail) {
        if (mainConfig.devMode && mainConfig.log) {
            console.log(`[log] ${context}`);
            if (detail) {
                if (typeof detail === 'object') {
                    return console.log(detail.stack);
                }
                let lines = detail.split('\n');
                lines.forEach(line => {
                    console.log(`      ${line}`);
                });
            }
        }
    }

    /**
     * 记录开发错误
     * @param {string} context 内容
     * @param {string} detail 详情
     */
    static devError(context, detail) {
        if (mainConfig.devMode && mainConfig.log) {
            console.log(`[err] ${context}`);
            if (detail) {
                if (typeof detail === 'object') {
                    return console.log(detail.stack);
                }
                let lines = detail.split('\n');
                lines.forEach(line => {
                    console.log(`      ${line}`);
                });
            }
        }
    }

}
