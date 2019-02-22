const camelCase = require("to-camel-case");
const snakeCase = require("to-snake-case");

function defaults(info, options, logger) {
    logger = logger || console;
    options = options || {};
    options.version = options.version || "v1";
    options.retry = Number(options.retry) || 3;
    options.timeout = Number(options.timeout) || 5000;
    options.waitTime = Number(options.waitTime) || 2000;
    options.source = options.source || "merapi-proxy";
    options.lazy = options.lazy || false;
    info.api = info.api || {};

    return {info, options, logger};
};

module.exports = function(impl, info, options, logger, proxy) {
    ({info, options, logger} = defaults(info, options, logger));
    let callApi = impl(info, options, logger);
    proxy = proxy || {};
    for (let i=0; i<info.api[options.version].length; i++) {
        let methodName = camelCase(info.api[options.version][i]);
        proxy[methodName] = (...args) => callApi(methodName, args);
    }
    
    return proxy;
};
