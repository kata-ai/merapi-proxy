"use strict";

const assert = require("assert");
const merapi = require("merapi");
const {async:coroutine} = require("merapi");
const asyncProxy = require("../async");

describe("Proxy Async Test", function() {

    let container, proxy;
    let lazyContainer, lazyProxy;

    before(coroutine(function* () {
        container = merapi({
            basepath: __dirname,
            config: {
                name: "test",
                plugins: ["service"],
                version: "1.0.0",
                main: "mainCom",
                components: {},
                service: {
                    "port": "5005",
                    "api.v1": {
                        list: "mainCom.list",
                        get: "mainCom.get",
                        getError: "mainCom.getError"
                    }
                }
            }
        });

        container.register("mainCom", {
            list() {
                return [1,2];
            },
            getError() {
                throw new Error("error occurred!");
            },
            get(x) {
                return x;
            },
            start() {

            }
        }, true);

        yield container.start();

        lazyContainer = merapi({
            basepath: __dirname,
            config: {
                name: "testLazy",
                plugins: ["service"],
                version: "1.0.0",
                main: "lazyMainCom",
                components: {},
                service: {
                    "port": "5010",
                    "api.v1": {
                        list: "lazyMainCom.list",
                        get: "lazyMainCom.get"
                    }
                }
            }
        });

        lazyContainer.register("lazyMainCom", {
            list() {
                return [1,2];
            },
            get(x) {
                return x;
            },
            start() {

            }
        }, true)
    }));

    it("should create proxy", coroutine(function*() {
        proxy = yield asyncProxy("http://localhost:5005");
        assert.notStrictEqual(proxy, null);
    }));

    it("should have all functions", coroutine(function*() {
        assert.deepStrictEqual(Object.keys(proxy), ["list", "get", "getError"]);
    }));

    it("should be able to get result", coroutine(function*() {
        let res = yield proxy.list();
        assert.deepStrictEqual(res, [1,2]);
    }));

    it("should be able to get result with arguments", coroutine(function*() {
        let res = yield proxy.get(10);
        assert.deepStrictEqual(res, 10);
    }));

    it("should create lazy proxy when endpoint not ready", coroutine(function*() {
        lazyProxy = yield asyncProxy("http://localhost:5010", { lazy: true, retryDelay: 1000 }, console);
        assert.strictEqual(lazyProxy.isReady(), false);
    }));

    it("should able to call proxy when endpoint ready", coroutine(function*() {
        let sleep = (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        yield lazyContainer.start();
        yield sleep(1600);
        assert.strictEqual(lazyProxy.isReady(), true);
        let res = yield lazyProxy.get(10);
        assert.deepStrictEqual(res, 10);
    }));

    it("should be able to catch error if exception happens", coroutine(function*() {
        // TODO: add tests
        // try {
        //     const ret = yield proxy.getError();
        //     // it should expect to produce exception
        // } catch (e) {
        //     console.log(`>>>>> Excpetion is ${e}`)
        //     assert.notStrictEqual(e, null);
        // }
    }))
});