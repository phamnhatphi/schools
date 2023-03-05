import { User } from '@admin/models/user';

const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);
    const loginInfo = ref<User|null>();
    const loginToken = ref<string|null>();

    const setAuthenticated = (state: boolean) => {
        isAuthenticated.value = state;
    };

    const setLoginInfo = (data: User|null) => {
        loginInfo.value = data;
    };

    const setLoginToken = (token: string|null) => {
        loginToken.value = token;
    };

    return {
        isAuthenticated,
        loginInfo,
        loginToken,
        setAuthenticated,
        setLoginInfo,
        setLoginToken,
    };
});

export default useAuthStore;
