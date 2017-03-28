"use strict";
const camelCase = require("to-camel-case");
const snakeCase = require("to-snake-case");
const request = require("sync-request");

module.exports = function(info, options, logger) {

    return function(methodName, args) {
        let res = null;
        let uri = (info.secure ? "https://" : "http://") + info.uri + "/api/" + options.version + "/" + snakeCase(methodName);

        try {
            res = request("POST", uri, {
                json: { params: args, source: options.source },
                headers: {
                    Authorization: options.secret ? "Bearer " + options.secret : ""
                },
                timeout: options.timeout,
                socketTimeout: options.timeout
            });
        }
        catch (e) {
            logger.warn(`Error at proxy call [${count}]`, e);
            throw e;
        }

        let ret = JSON.parse(res.getBody('utf8'));

        if (ret && ret.status == "ok")
            return ret.result;
        else
            throw new Error(ret ? ret.error : "Unknown error");
    };
}