const SuccessResponse = () => ({
    data: [
        {
            id: 1,
            name: 'root',
            display_name: 'ユーザ太郎',
            email: 'taro@example.com',
            created_at: '2023-01-02T00:00:00+09',
            updated_at: '2023-01-02T00:00:00+09',
        },
        {
            id: 1,
            name: 'root',
            display_name: 'ユーザ太郎',
            email: 'taro@example.com',
            created_at: '2023-01-02T00:00:00+09',
            updated_at: '2023-01-02T00:00:00+09',
        },
        {
            id: 1,
            name: 'root',
            display_name: 'ユーザ太郎',
            email: 'taro@example.com',
            created_at: '2023-01-02T00:00:00+09',
            updated_at: '2023-01-02T00:00:00+09',
        },
    ],
    pagination: {
        page: 1,
        limit: 10,
        total: 200,
    },
});
const validationErrorResponses = () => ({
    email: ['Tên đăng nhập không được để trống', 'Tên đăng nhập phải dài hơn 5 ký tự'],
    username: ['Tên đăng nhập không được để trống', 'Tên đăng nhập phải dài hơn 5 ký tự'],
    display_name: ['Tên đăng nhập không được để trống', 'Tên đăng nhập phải dài hơn 5 ký tự'],
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
