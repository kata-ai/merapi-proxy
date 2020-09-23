/**
 * Return toString for any given value
 * @param {*} value any value, can be array, object, number, string, undefined, or null
 */
const convertToString = (value) => {
    if (value === null) return 'null';

    if(typeof value !== 'object')
        return String(value);

    if (Array.isArray(value)) {
        if (value.length == 0) return "[]";

        let res = "[";
        for (const val of value) {
            if (typeof val === 'number') {
                res += (String(val) + ",")
            } else if (typeof val === 'object'){
                res += `${convertToString(val)},`;
            } else {
                res += `"${convertToString(val)}",`;
            }
        }
        res = res.slice(0, res.length-1);
        res += "]"
        return res;
    }

    return JSON.stringify(value);
}

module.exports = { convertToString };