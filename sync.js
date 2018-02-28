let request = require("sync-request");
let proxy = require("./lib/proxy");
let apiSync = require("./lib/api_sync");
let url = require("url");

module.exports = function(uri, options = {}, logger) {
    uri = url.parse(uri); 
    let res = request("GET", uri.protocol + "//" + uri.host + "/info", {
        headers: {
            Authorization: "Bearer " + options.secret
        }
    });
    let info = JSON.parse(res.getBody("utf8"));
    info.uri = uri.host;
    info.secure = uri.protocol === "https:";
    return proxy(apiSync, info, options, logger);
};