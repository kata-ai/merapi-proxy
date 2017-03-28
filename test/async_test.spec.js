const assert = require("assert");
const merapi = require("merapi");
const {async:coroutine} = require("merapi");
const asyncProxy = require("../async");

describe("Proxy Async Test", function() {
    
    let container, proxy;

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
                        get: "mainCom.get"
                    }
                }
            }
        });

        container.register("mainCom", {
            list() {
                return [1,2];
            },
            get(x) {
                return x;
            },
            start() {

            }
        }, true);

        yield container.start();
    }));

    it("should create proxy", coroutine(function*() {
        proxy = yield asyncProxy("http://localhost:5005");
        assert.notEqual(proxy, null);
    }));

    it("should have all functions", coroutine(function*() {
        assert.deepEqual(Object.keys(proxy), ["list", "get"]);
    }));

    it("should be able to get result", coroutine(function*() {
        let res = yield proxy.list();
        assert.deepEqual(res, [1,2]);
    }));

    it("should be able to get result with arguments", coroutine(function*() {
        let res = yield proxy.get(10);
        assert.deepEqual(res, 10);
    }));

});