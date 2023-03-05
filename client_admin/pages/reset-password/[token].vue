<template>
    <Page title="パスワード再発行" hide-title prevent-if-auth>
        <template #default="{ title: pageTitle }">
            <VRow class="justify-center">
                <VCol cols="12" sm="6" xl="4">
                    <VCard>
                        <VForm @submit.prevent="resetPassword()">
                            <VCardTitle>{{ pageTitle }}</VCardTitle>
                            <VDivider />
                            <VCardText>
                                <VTextField
                                    v-model="resetData.password"
                                    :error="!!validationErrorMessages.password"
                                    :error-messages="validationErrorMessages.password"
                                    autocomplete="new-password"
                                    type="password"
                                    class="pb-3"
                                    density="compact"
                                    label="パスワード*"
                                    prepend-inner-icon="mdi-lock"
                                    variant="outlined"
                                    hide-details="auto"
                                />
                                <VTextField
                                    v-model="confirmPassword.value"
                                    :error="!!confirmPassword.error"
                                    :error-messages="confirmPassword.error"
                                    autocomplete="new-password"
                                    type="password"
                                    density="compact"
                                    label="パスワード確認*"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-lock"
                                    variant="outlined"
                                />
                            </VCardText>
                            <VDivider />
                            <VCardActions class="pl-4" style="display: inline-block">
                                <VBtn
                                    color="primary"
                                    variant="outlined"
                                    type="submit"
                                    class="me-2"
                                    :loading="isPutResetPasswordFetching"
                                >
                                    パスワード再設定
                                </VBtn>
                                <VBtn :to="{ name: 'login' }" variant="text" class="ps-0 ms-0">
                                    ログイン
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
import { ValidationErrors } from '@admin/models/base';
import MESSAGES from '@admin/config/messages';

const route = useRoute();
const { addAlert, clearAlert, AlertType } = useAlert();

const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    password: '',
});

const confirmPassword = reactive({
    value: '',
    error: '',
});
const resetData = reactive({
    password: '',
});

const {
    data: putResetPasswordData,
    put: putResetPassword,
    isFetching: isPutResetPasswordFetching,
    onFetchResponse: onPutResetPasswordResponse,
    onFetchError: onPutResetPasswordError,
} = useFetchApi({
    disableHandler: { unauthorizedError: true },
})(`reset-password/${route.params.token}`, { immediate: false });

onPutResetPasswordResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.resetPassword,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'login' });
});
onPutResetPasswordError(() => {
    assign(putResetPasswordData.value as ValidationErrors);
});

const resetPassword = () => {
    resetValidationError();
    confirmPassword.error = '';
    clearAlert();
    if (resetData.password !== confirmPassword.value) {
        confirmPassword.error = MESSAGES.errors.confirmPasswordUnmatched;
    } else {
        putResetPassword(resetData).execute();
    }
};
</script>
