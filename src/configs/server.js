/**
 * /configs/server.js
 * @author John Kindem
 */

import mainConfig from './main';
import KeyGrip from 'keygrip';

/**
 * 导出服务器配置
 */
export default mainConfig.devMode ? {
    listenPort: 17782,
    keys: new KeyGrip(['root free firewall message module backend'], 'sha256')
} : {};
