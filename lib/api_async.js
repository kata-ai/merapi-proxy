// @ts-check

"use strict";
const Promise = require("bluebird");
const snakeCase = require("to-snake-case");
const request = require("request-promise");
const { convertToString } = require("./print_util");

module.exports = function(info, options, logger) {
  return Promise.coroutine(function*(methodName, args) {
    let ret;
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
      const errMessage = `Caught uncategorised error at proxy call, request params ${convertToString(requestParams)}, error: ${e}`;
      logger.warn(errMessage);
      throw new Error(errMessage);
    }

    // handles error comes from the other services
    let errMsg = "";
    if (ret && ret.error) {
      errMsg = `Error at proxy call ${convertToString(ret.error)}, with result: ${convertToString(ret)}, request params: ${convertToString(requestParams)}`;
    } else {
      errMsg = `Error with unknown reason at proxy call, with result: ${convertToString(ret)}, request params: ${convertToString(requestParams)}`
    }
    logger.warn(errMsg);
    throw new Error(errMsg);
  });
};
