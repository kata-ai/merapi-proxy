// @ts-check

"use strict";
const Promise = require("bluebird");
const snakeCase = require("to-snake-case");
const request = require("request-promise");

module.exports = function(info, options, logger) {
  return Promise.coroutine(function*(methodName, args) {
    let ret = null;
    let uri =
      (info.secure ? "https://" : "http://") +
      info.uri +
      "/api/" +
      options.version +
      "/" +
      snakeCase(methodName);

    const requestParams = {
      uri: uri,
      method: "POST",
      headers: {
        Authorization: options.secret ? "Bearer " + options.secret : "",
      },
      body: { params: args, source: options.source },
      json: true,
      timeout: options.timeout,
      socketTimeout: options.timeout,
    };

    try {
      ret = yield request(requestParams);
      if (ret && ret.status === "ok") return ret.result;
    } catch (e) {
      // handles error on request-promise related
      const errMessage = `Caught uncategorised error at proxy call: ${e}`;
      logger.warn(errMessage);
      throw new Error(errMessage);
    }

    // handles error comes from the other services
    let errMsg = "";
    if (ret && ret.error) {
      errMsg = `Error at proxy call: ${ret.error}, request params: ${JSON.stringify(requestParams)}`;
    } else {
      errMsg = `Error with unknown reason at proxy call, request params: ${JSON.stringify(requestParams)}`
    }
    logger.warn(errMsg);
    throw new Error(errMsg);
  });
};
