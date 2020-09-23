const { describe } = require("mocha");
const assert = require("assert");
const { convertToString } = require("../lib/print_util");

describe("toString Test", () => {
    const testcases = [{
        input: undefined,
        expected: 'undefined'
    }, {
        input: null,
        expected: 'null'
    }, {
        input: 1,
        expected: '1'
    }, {
        input: 1.5,
        expected: '1.5'
    }, {
        input: [1,2,3],
        expected: "[1,2,3]"
    }, {
        input: ["1","2"],
        expected: `["1","2"]`
    }, {
        input: [],
        expected: `[]`
    }, {
        input: ["2"],
        expected: `["2"]`
    }, {
        input: [{a: "a"}],
        expected: `[{"a":"a"}]`
    }, {
        input: [[2]],
        expected: `[[2]]`
    }, {
        input: {"a": {"b": "be"}},
        expected: `{"a":{"b":"be"}}`,
    }, {
        input: `{"a":{"b":"be"}}`,
        expected: `{"a":{"b":"be"}}`,
    }]

    it("should be able to convert any values to string", () => {
        testcases.forEach(testcase => {
            assert.deepStrictEqual(convertToString(testcase.input), testcase.expected);
        });
    })
});
