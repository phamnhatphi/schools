<template>
    <Page title="ログイン" hide-title prevent-if-auth>
        <template #default="{ title: pageTitle }">
            <VRow class="justify-center">
                <VCol cols="12" sm="6" xl="4">
                    <VCard>
                        <VForm @submit.prevent="login()">
                            <VCardTitle>{{ pageTitle }}</VCardTitle>
                            <VDivider />
                            <VCardText>
                                <VTextField
                                    v-model="loginData.username"
                                    label="ログインID*"
                                    :error="!!validationErrorMessages.username"
                                    :error-messages="validationErrorMessages.username"
                                    autocomplete="username"
                                    class="pb-3"
                                    density="compact"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account-box"
                                    variant="outlined"
                                />
                                <VTextField
                                    v-model="loginData.password"
                                    label="パスワード*"
                                    :error="!!validationErrorMessages.password"
                                    :error-messages="validationErrorMessages.password"
                                    autocomplete="current-password"
                                    density="compact"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-lock"
                                    variant="outlined"
                                    type="password"
                                />
                            </VCardText>
                            <VDivider />
                            <VCardActions class="pl-4" style="display: inline-block">
                                <VBtn
                                    color="primary"
                                    variant="outlined"
                                    type="submit"
                                    class="me-2"
                                    :loading="isLoginButtonLoading"
                                >
                                    ログイン
                                </VBtn>
                                <VBtn
                                    :to="{ name: 'forgot-password' }"
                                    variant="text"
                                    class="ms-0"
                                    color="defaut"
                                >
                                    パスワードを忘れた方
                                </VBtn>
                            </VCardActions>
                        </VForm>
                    </VCard>
                </VCol>
            </VRow>
        </template>
    </Page>
</template>

<script setup lang="ts">
import { RetrieveApiResponse, ValidationErrors } from '@admin/models/base';
import MESSAGES from '@admin/config/messages';

const route = useRoute();
const { setLoginToken } = useAuth();
const { fetchLoginInfo, loginInfo, isFetching } = useLoginInfo({ autoFetch: false });
const { addAlert, clearAlert, AlertType } = useAlert();
const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    username: '',
    password: '',
});

const loginData = ref({
    username: '',
    password: '',
});

const {
    data: postLoginData,
    statusCode: postLoginStatusCode,
    isFetching: isPostLoginFetching,
    onFetchResponse: onPostLoginResponse,
    onFetchError: onPostLoginError,
    post: postLogin,
} = useFetchApi({
    disableHandler: { unauthorizedError: true },
})('login', { immediate: false });

const isLoginButtonLoading = computed(() => isFetching.value || isPostLoginFetching.value);

onPostLoginResponse(() => {
    setLoginToken((postLoginData.value as RetrieveApiResponse<{ token: string }>).data.token);
    fetchLoginInfo();
});

onPostLoginError(() => {
    if (postLoginStatusCode.value === 401) {
        addAlert({
            type: AlertType.Error,
            message: MESSAGES.errors.loginFailResponse,
        });
    } else if (postLoginStatusCode.value === 422) {
        assign(postLoginData.value as ValidationErrors);
    }
});

const login = () => {
    clearAlert();
    resetValidationError();
    postLogin(loginData.value).execute();
};

watch(loginInfo, () => {
    if (loginInfo.value) {
        if (route.query.goto) {
            try {
                navigateTo(route.query.goto as string);
            } catch {
                navigateTo({ name: 'index' });
            }
        } else {
            navigateTo({ name: 'index' });
        }
    }
});
</script>
