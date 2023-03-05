<template>
    <Page title="アカウント 詳細" require-auth>
        <VCard>
            <VCardText>
                <Loader :loading="isGetUserFetching">
                    <VSheet v-if="isInitSuccess" class="pb-3">
                        <VRow>
                            <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                表示名
                            </VCol>
                            <VCol class="wrap-text">
                                {{ user.display_name }}
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                ログインID
                            </VCol>
                            <VCol class="wrap-text">
                                {{ user.username }}
                            </VCol>
                        </VRow>
                        <VRow>
                            <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                メールアドレス
                            </VCol>
                            <VCol class="wrap-text">
                                {{ user.email }}
                            </VCol>
                        </VRow>
                    </VSheet>
                </Loader>
            </VCardText>
            <VDivider />
            <VCardActions class="pl-4">
                <VBtn
                    v-if="isInitSuccess"
                    variant="outlined"
                    @click="
                        navigateTo({
                            name: 'users-edit-id',
                            params: { id: route.params.id },
                        })
                    "
                >
                    編集
                </VBtn>
                <Dialog
                    v-model="isShowDeleteDialog"
                    :loading="isDeleteUserFetching"
                    close-label="キャンセル"
                    @confirmed="confirmedDeleteDialog()"
                >
                    <template #activator="{ props }">
                        <VBtn
                            v-if="isInitSuccess"
                            v-bind="props"
                            variant="outlined"
                            color="error"
                            @click="showDeleteConfirm()"
                        >
                            削除
                        </VBtn>
                    </template>
                    <p>本データを削除しますが、よろしいでしょうか？</p>
                </Dialog>
                <VBtn
                    variant="outlined"
                    @click="
                        navigateTo({
                            name: `users`,
                        })
                    "
                >
                    戻る
                </VBtn>
            </VCardActions>
        </VCard>
    </Page>
</template>
<script setup lang="ts">
import MESSAGES from '@admin/config/messages';
import { User } from '@admin/models/user';
import { RetrieveApiResponse } from '@admin/models/base';

const { addAlert, clearAlert, AlertType } = useAlert();
const route = useRoute();
const isShowDeleteDialog = ref(false);

const {
    delete: deleteUser,
    onFetchResponse: onDeleteUserResponse,
    onFetchError: onDeleteUserError,
    isFetching: isDeleteUserFetching,
} = useFetchApi()(`users/${route.params.id}`, {
    immediate: false,
});

const {
    data: getUserData,
    isFetching: isGetUserFetching,
    isFinished: isGetUserFinished,
} = useFetchApi()<RetrieveApiResponse<User>>(`users/${route.params.id}`, {
    immediate: true,
});

const user = computed<Omit<User, 'id' | 'created_at' | 'updated_at'>>(
    () => getUserData.value?.data || {
        username: '',
        display_name: '',
        email: '',
    },
);

const isInitSuccess = computed(() => isGetUserFinished.value && getUserData.value?.data);

onDeleteUserResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.deleteUser,
        keepForNextRoute: true,
    });

    navigateTo({ name: 'users' });
    isShowDeleteDialog.value = false;
});
onDeleteUserError(() => {
    addAlert({
        type: AlertType.Error,
        message: '',
    });
    isShowDeleteDialog.value = false;
});

const showDeleteConfirm = () => {
    clearAlert();
    isShowDeleteDialog.value = true;
};
const confirmedDeleteDialog = () => deleteUser().execute();
</script>
<style scoped>
@media only screen and (min-width: 600px) {
    .title {
        text-align: end;
        padding-bottom: 12px !important;
    }
}
</style>
