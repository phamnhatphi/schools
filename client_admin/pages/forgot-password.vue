<template>
    <Page title="パスワード再発行" hide-title prevent-if-auth>
        <template #default="{ title: pageTitle }">
            <VRow class="justify-center">
                <VCol cols="12" sm="6" xl="4">
                    <VCard>
                        <VForm @submit.prevent="sendEmail()">
                            <VCardTitle>{{ pageTitle }}</VCardTitle>
                            <VDivider />
                            <VCardText>
                                <VTextField
                                    v-model="sendData.username"
                                    label="ログインID*"
                                    :error="!!validationErrorMessages.username"
                                    :error-messages="validationErrorMessages.username"
                                    class="pb-3"
                                    hide-details="auto"
                                    density="compact"
                                    prepend-inner-icon="mdi-account-box"
                                    variant="outlined"
                                />
                                <VTextField
                                    v-model="sendData.email"
                                    label="メールアドレス*"
                                    :error="!!validationErrorMessages.email"
                                    :error-messages="validationErrorMessages.email"
                                    hide-details="auto"
                                    density="compact"
                                    prepend-inner-icon="mdi-email"
                                    variant="outlined"
                                    type="email"
                                />
                            </VCardText>
                            <VDivider />
                            <VCardActions class="pl-4" style="display: inline-block">
                                <VBtn
                                    color="primary"
                                    variant="outlined"
                                    type="submit"
                                    class="me-2"
                                    :loading="isPostEmailFetching"
                                >
                                    パスワード再設定リンクを送信
                                </VBtn>
                                <VBtn :to="{ name: 'login' }" variant="text" class="ms-0">
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

const { addAlert, clearAlert, AlertType } = useAlert();
const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    username: '',
    email: '',
});

const sendData = reactive({
    username: '',
    email: '',
});

const {
    data: postEmailData,
    statusCode: postEmailStatusCode,
    post: postEmail,
    isFetching: isPostEmailFetching,
    onFetchResponse: onPostEmailResponse,
    onFetchError: onPostEmailError,
} = useFetchApi({
    disableHandler: { unauthorizedError: true },
})('forgot-password', { immediate: false });

onPostEmailResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.sendEmailToResetPassword,
    });
});

onPostEmailError(() => {
    if (postEmailStatusCode.value === 422) {
        assign(postEmailData.value as ValidationErrors);
    }
});

const sendEmail = () => {
    clearAlert();
    resetValidationError();
    postEmail(sendData).execute();
};
</script>
