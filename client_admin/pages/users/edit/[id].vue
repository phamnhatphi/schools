<template>
    <Page title="アカウント 編集" require-auth>
        <VCard>
            <VForm @submit.prevent="updateUser()">
                <VCardText>
                    <VRow>
                        <VCol lg="6">
                            <Loader :loading="isGetUserFetching">
                                <VSheet v-if="isInitSuccess">
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
                                        class="pb-3"
                                        density="compact"
                                        hide-details="auto"
                                        label="メールアドレス*"
                                        variant="outlined"
                                        type="email"
                                    />
                                    <VTextField
                                        v-model="user.password"
                                        :error="!!validationErrorMessages.password"
                                        :error-messages="validationErrorMessages.password"
                                        autocomplete="off"
                                        class="pb-3"
                                        density="compact"
                                        hide-details="auto"
                                        label="パスワード"
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
                                        label="パスワード確認"
                                        variant="outlined"
                                        type="password"
                                    />
                                </VSheet>
                            </Loader>
                        </VCol>
                    </VRow>
                </VCardText>
                <VDivider />
                <VCardActions class="pl-4">
                    <VBtn
                        v-if="isInitSuccess"
                        variant="outlined"
                        color="primary"
                        type="submit"
                        :loading="isPutUserFetching"
                    >
                        更新
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        @click="
                            navigateTo({
                                name: 'users-view-id',
                                params: { id: route.params.id },
                            })
                        "
                    >
                        戻る
                    </VBtn>
                </VCardActions>
            </VForm>
        </VCard>
    </Page>
</template>
<script setup lang="ts">
import { RetrieveApiResponse, ValidationErrors } from '@admin/models/base';
import { User } from '@admin/models/user';
import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import omit from 'lodash/omit';
import MESSAGES from '@admin/config/messages';

const { addAlert, clearAlert, AlertType } = useAlert();
const route = useRoute();

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
const user = reactive<Omit<User, 'created_at' | 'updated_at'>>({
    id: 0,
    username: '',
    display_name: '',
    email: '',
    password: '',
    password_confirm: '',
});

const {
    data: putUserData,
    put: putUser,
    onFetchResponse: onPutUserResponse,
    onFetchError: onPutUserError,
    isFetching: isPutUserFetching,
} = useFetchApi()(`users/${route.params.id}`, {
    immediate: false,
});
const {
    data: getUserData,
    onFetchResponse: onGetUserResponse,
    isFetching: isGetUserFetching,
    isFinished: isGetUserFinished,
} = useFetchApi()<RetrieveApiResponse<User>>(`users/${route.params.id}`, {
    immediate: true,
});

const isInitSuccess = computed(() => isGetUserFinished.value && getUserData.value?.data);

onGetUserResponse(() => {
    mapKeys(user, (_, key) => {
        set(user, key, getUserData.value?.data[key as keyof User]);
    });
});

onPutUserResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.updateUser,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'users' });
});
onPutUserError(() => {
    assign(putUserData.value as ValidationErrors);
});

const updateUser = () => {
    clearAlert();
    resetValidationError();
    putUser(user.password ? user : omit(user, ['password', 'password_confirm'])).execute();
};
</script>
