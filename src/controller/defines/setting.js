/**
 * /controller/define/setting.js
 * @author John Kindem
 * @description  /${commonUrlPrefix}/setting controller
 * @version v1.0
 */

import controllerConfig from '../../configs/controller'
import { Log } from '../../tool/log';

/**
 * /${commonUrlPrefix}/label controller
 * @description get get value by keys
 * * @param {[key: string]} keys key of setting
 * @description post update the value by keys
 * * @param {[{key: string, value: string}]} maps maps of key and value
 */
export default {
    url: `${controllerConfig.commonUrlPrefix}/setting`,
    get: (db, models) => {
        return async (ctx, next) => {
            await next();

            // get the params
            const query = ctx.request.query || {};
            const keys = query.keys || null;

            // check the params
            if (!keys) {
                Log.error('status 400', `keys: ${keys}`);
                return ctx.response.status = 400;
            }
            for (let i = 0; i < keys.length; i++) {
                if (typeof keys[i] !== 'string') {
                    Log.error('status 400', `keys[${i}]: not a string`);
                    return ctx.response.status = 400;
                }
            }

            // get all the setting in database
            let settings;
            try {
                settings = await models.setting.findAll();
            } catch (e) {
                Log.error('status 500', e);
                return ctx.response.status = 500;
            }

            // define the result list
            let result = [];
            settings = settings || [];
            settings.forEach((setting) => {
                let find = false;
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] === setting.key) {
                        find = true;
                        break;
                    }
                }
                if (find) {
                    result.push({
                        key: setting.key,
                        value: setting.value
                    });
                }
            });

            // return the result
            return ctx.response.body = {
                maps: result
            };
        }
    },
    post: (db, models) => {
        return async (ctx, next) => {
            await next();

            // get the params
            const body = ctx.request.body || {};
            const maps = body.maps || null;

            // check the params
            if (!maps) {
                Log.error('status 400', `maps: ${maps}`);
                return ctx.request.status = 400;
            }
            for (let i = 0; i < maps.length; i++) {
                let key = maps[i].key || null;
                let value = maps[i].value || null;
                if (typeof key !== 'string') {
                    Log.error('status 400', `maps[${i}].key: not a string`);
                    return ctx.response.status = 400;
                }
                if (typeof value !== 'string') {
                    Log.error('status 400', `maps[${i}].value: not a string`);
                    return ctx.response.status = 400;
                }
            }

            // get all the setting in database
            let settings;
            try {
                settings = await models.setting.findAll();
            } catch (e) {
                Log.error('status 500', e);
                return ctx.response.status = 500;
            }

            // for every setting, check if it need to be updated
            for (let i = 0; i < settings.length; i++) {
                for (let j = 0; j < maps.length; j++) {
                    if (maps[j].key === settings[i].key) {
                        // update the value
                        settings[i].value = maps[i].value;
                        // save changes to database
                        try {
                            settings[i].save();
                        } catch (e) {
                            Log.error('status 500', e);
                            return ctx.response.status = 500;
                        }
                        break;
                    }
                }
            }

            // return the result
            return ctx.response.body = {
                success: true
            };
        }
    }
}
