/**
 * Try parsing a provided value to number (int or float).
 * If the value is not be able to be converted to number,
 * the default value will be returned.
 *
 * @param val
 * @param defaultVal
 **/
const parseNumber = (val: any, defaultVal: number | undefined = undefined) => {
    const newVal = Number(val);
    if (Number.isNaN(newVal)) {
        return defaultVal;
    }
    return newVal;
};

export default parseNumber;
