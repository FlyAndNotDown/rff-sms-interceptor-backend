/**
 * /config.js
 * @author John Kindem
 */

import mainConfig from './configs/main';
import serverConfig from './configs/server';
import modelConfig from './configs/model';
import controllerConfig from './configs/controller';
import middlewareConfig from './configs/middleware';

/**
 * 导出总配置
 */
export default {
    main: mainConfig,
    server: serverConfig,
    model: modelConfig,
    controller: controllerConfig,
    middleware: middlewareConfig
};