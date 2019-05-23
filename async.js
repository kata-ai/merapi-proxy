const Promise = require("bluebird");
const proxy = require("./lib/proxy");
const apiAsync = require("./lib/api_async");
const request = require("request-promise");
const url = require("url");
const async = require("async");

function lazyLoad(uri, opt, logger) {
    let info;
    let infoUri =  uri.protocol + "//" + uri.host + "/info";
    let status = () => {
        return (info !== undefined && typeof info === 'object');
    };

    let ready = false;
    let obj = {
        isReady: () => ready
    };
    logger.warn(`Attempting lazy connection to ${infoUri} ..`);
    async.until(status, function(callback) {
        request({
            uri: infoUri,
            headers: {
                Authorization: "Bearer " + opt.secret
            },
            json: true
        }, (err, res) => {
            if (!err) {
                info = res.body;
                info.uri = uri.host;
                info.secure = uri.protocol === "https:";
            }
        }).catch((err) => err);
        setTimeout(function() {
            callback(null, info);
        }, opt.retryDelay || 3000);
    }, (err, res) => {
        if (!err) {
            logger.info(`Connection success ${infoUri}`)
            proxy(apiAsync, info, opt, logger, obj);
            ready = true;
        }
    });

    return obj;
}

module.exports = Promise.coroutine(function*(uri, options = {}, logger) {
    uri = url.parse(uri);
    if (options.lazy) {
        return lazyLoad(uri, options, logger);
    } else {
        let info = yield request({
            uri: uri.protocol + "//" + uri.host + "/info",
            headers: {
                Authorization: "Bearer " + options.secret
            },
            json: true
        });
        info.uri = uri.host;
        info.secure = uri.protocol === "https:";
        return proxy(apiAsync, info, options, logger);
    }
    
});