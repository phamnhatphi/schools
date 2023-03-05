import { RetrieveApiResponse } from '@admin/models/base';
import { User } from '@admin/models/user';

const useLoginInfo = ({ autoFetch = true } = {}) => {
    const authStore = useAuthStore();
    const { getLoginToken } = useAuth();

    const {
        data,
        isFetching,
        isFinished,
        get: fetchLoginInfoBase,

    } = useFetchApi({
        disableHandler: { unauthorizedError: true },
    })<RetrieveApiResponse<User>>(
        'users/me',
        { immediate: false },
    );

    const fetchLoginInfo = () => {
        fetchLoginInfoBase().execute();
    };

    const canRenderScreen = computed(() => {
        if (!authStore.isAuthenticated) {
            return true;
        }
        return !isFetching.value;
    });

    watch(
        isFinished,
        () => {
            if (data.value) {
                authStore.setLoginInfo(data.value.data);
            }
        },
        { immediate: true },
    );

    onBeforeMount(() => {
        const token = getLoginToken();
        if (token) {
            authStore.setAuthenticated(true);
            authStore.setLoginToken(token);
            if (autoFetch && !authStore.loginInfo) {
                fetchLoginInfo();
            }
        }
    });

    return {
        fetchLoginInfo,
        canRenderScreen,
        isFetching,
        isFinished,
        loginInfo: computed(() => authStore.loginInfo),
    };
};

export default useLoginInfo;
