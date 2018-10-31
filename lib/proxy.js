const camelCase = require("to-camel-case");
const snakeCase = require("to-snake-case");

function defaults(info, options, logger) {
    logger = logger || console;
    options = options || {};
    options.version = options.version || "v1";
    options.retry = options.retry || 3;
    options.timeout = options.timeout || 5000;
    options.waitTime = options.waitTime || 2000;
    options.source = options.source || "merapi-proxy";
    options.lazy = options.lazy || false;
    info.api = info.api || {};

    return {info, options, logger};
};

module.exports = function(impl, info, options, logger, proxy) {
    ({info, options, logger} = defaults(info, options, logger));
    let callApi = impl(info, options, logger);
    proxy = proxy || {};
    if (info instanceof Object && 'api' in info && options.version in info.api) {
        for (let i = 0; i < info.api[options.version].length; i++) {
            let methodName = camelCase(info.api[options.version][i]);
            proxy[methodName] = (...args) => callApi(methodName, args);
        }
    }
    
    return proxy;
};