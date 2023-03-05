/**
 * Try parsing a provided value to boolean.
 * If the value is not be able to be converted to boolean,
 * the default value will be returned.
 *
 * @param val
 * @param defaultVal
 **/
const parseBool = (value: any, defaultResult: boolean | undefined = undefined) => {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === 'boolean') {
        return value === true;
    }

    if (!Number.isNaN(Number(value))) {
        return parseFloat(value) !== 0;
    }

    if (typeof value === 'string') {
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
            return true;
        }
        return false;
    }

    return defaultResult;
};
export default parseBool;
