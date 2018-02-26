const Promise = require("bluebird");
const proxy = require("./lib/proxy");
const apiAsync = require("./lib/api_async");
const request = require("request-promise");
const url = require("url");

module.exports = Promise.coroutine(function*(uri, options = {}, logger) {
    uri = url.parse(uri); 
    let info = {};
    try {
        info = yield request({
            uri: uri.protocol + "//" + uri.host + "/info",
            headers: {
                Authorization: "Bearer " + options.secret
            },
            json: true
        });
        info.uri = uri.host;
        info.secure = uri.protocol === "https:";
    } catch (error) {
        if (options.lazy) {
            info.name = uri.protocol + "//" + uri.host;
            info.uri = "lazy-endpoint";
            return proxy(apiAsync, info, options, logger);
        } 
        
        throw new Error(error);
    }
    
    return proxy(apiAsync, info, options, logger);
});