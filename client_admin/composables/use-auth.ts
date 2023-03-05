import { useCookies } from '@vueuse/integrations/useCookies';

const TOKEN_STORAGE_KEY_NAME = 'login-token';

const useAuth = () => {
    const config = useRuntimeConfig();

    const cookies = useCookies([TOKEN_STORAGE_KEY_NAME]);
    const authStore = useAuthStore();

    const setLoginToken = (token: string) => {
        cookies.set(TOKEN_STORAGE_KEY_NAME, token, {
            path: config.app.baseURL,
            sameSite: 'lax',
            secure: true,
        });
        authStore.setLoginToken(token);
        authStore.setAuthenticated(true);
    };

    const getLoginToken = () => cookies.get<string>(TOKEN_STORAGE_KEY_NAME);

    const clearLoginToken = () => {
        cookies.remove(TOKEN_STORAGE_KEY_NAME, {
            path: config.app.baseURL,
        });
        authStore.setLoginToken(null);
        authStore.setAuthenticated(false);
    };

    const clearLoginInfo = () => {
        authStore.setLoginInfo(null);
    };

    const logout = () => {
        clearLoginToken();
        clearLoginInfo();
        navigateTo({ name: 'login' });
    };

    return {
        clearLoginToken,
        clearLoginInfo,
        getLoginToken,
        logout,
        setLoginToken,
        loginInfo: computed(() => authStore.loginInfo),
        loginToken: computed(() => authStore.loginToken),
        isAuthenticated: computed(() => authStore.isAuthenticated),
    };
};

export default useAuth;
