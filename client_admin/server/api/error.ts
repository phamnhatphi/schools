export default defineEventHandler((event) => {
    // eslint-disable-next-line no-param-reassign
    event.node.res.statusCode = 500;
    return {};
});
