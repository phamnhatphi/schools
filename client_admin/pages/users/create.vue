<template>
    <Page title="アカウント 登録" require-auth>
        <VCard>
            <VForm @submit.prevent="createUser()">
                <VCardText>
                    <VRow>
                        <VCol lg="6">
                            <VTextField
                                v-model="user.username"
                                :error="!!validationErrorMessages.username"
                                :error-messages="validationErrorMessages.username"
                                class="pb-3"
                                density="compact"
                                hide-details="auto"
                                label="ログインID*"
                                variant="outlined"
                            />
                            <VTextField
                                v-model="user.display_name"
                                :error="!!validationErrorMessages.display_name"
                                :error-messages="validationErrorMessages.display_name"
                                class="pb-3"
                                density="compact"
                                hide-details="auto"
                                label="表示名*"
                                variant="outlined"
                            />
                            <VTextField
                                v-model="user.email"
                                :error="!!validationErrorMessages.email"
                                :error-messages="validationErrorMessages.email"
                                type="email"
                                class="pb-3"
                                density="compact"
                                hide-details="auto"
                                label="メールアドレス*"
                                variant="outlined"
                            />

                            <VTextField
                                v-model="user.password"
                                :error="!!validationErrorMessages.password"
                                :error-messages="validationErrorMessages.password"
                                autocomplete="off"
                                class="pb-3"
                                density="compact"
                                hide-details="auto"
                                label="パスワード*"
                                variant="outlined"
                                type="password"
                            />
                            <VTextField
                                v-model="user.password_confirm"
                                :error="!!validationErrorMessages.password_confirm"
                                :error-messages="validationErrorMessages.password_confirm"
                                autocomplete="off"
                                density="compact"
                                hide-details="auto"
                                label="パスワード確認*"
                                variant="outlined"
                                type="password"
                            />
                        </VCol>
                    </VRow>
                </VCardText>
                <VDivider />
                <VCardActions class="pl-4">
                    <VBtn
                        variant="outlined"
                        color="primary"
                        type="submit"
                        :loading="isPostUserFetching"
                    >
                        登録
                    </VBtn>
                    <VBtn variant="outlined" @click="navigateTo({ name: 'users' })"> 戻る </VBtn>
                </VCardActions>
            </VForm>
        </VCard>
    </Page>
</template>
<script setup lang="ts">
import { User } from '@admin/models/user';
import { ValidationErrors } from '@admin/models/base';
import MESSAGES from '@admin/config/messages';

const { addAlert, clearAlert, AlertType } = useAlert();

const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    username: '',
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
});
const user = reactive<Omit<User, 'id' | 'created_at' | 'updated_at'>>({
    username: '',
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
});

const {
    data: postUserData,
    post: postUser,
    onFetchResponse: onPostUserResponse,
    onFetchError: onPostUserError,
    isFetching: isPostUserFetching,
} = useFetchApi()('users', {
    immediate: false,
});

onPostUserResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.createUser,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'users' });
});
onPostUserError(() => {
    assign(postUserData.value as ValidationErrors);
});

const createUser = () => {
    clearAlert();
    resetValidationError();
    postUser(user).execute();
};
</script>
