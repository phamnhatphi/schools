const SuccessResponse = () => ({
    data: {
        token: 'BearerToken',
    },
});
const validationErrorResponses = () => ({
    username: ['Tên đăng nhập không được để trống', 'Tên đăng nhập phải dài hơn 5 ký tự'],
    password: ['Tên đăng nhập không được để trống', 'Tên đăng nhập phải dài hơn 5 ký tự'],
});
// const unauthorizedErrorResponse = () => ({
//     message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ',
// });
export default defineEventHandler((event) => {
    // eslint-disable-next-line no-param-reassign
    // event.res.statusCode = 401;
    // return unauthorizedErrorResponse();

    // eslint-disable-next-line no-param-reassign
    // event.res.statusCode = 422;
    console.log(event);
    return SuccessResponse();
    return validationErrorResponses();
});
