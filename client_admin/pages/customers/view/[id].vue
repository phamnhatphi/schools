<template>
    <Page title="顧客情報 詳細" require-auth>
        <VCard>
            <VCardText>
                <VRow>
                    <VCol>
                        <Loader :loading="isGetCustomerFetching">
                            <VSheet v-if="isInitSuccess" class="pb-3">
                                <VRow>
                                    <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                        顧客名
                                    </VCol>
                                    <VCol class="wrap-text">
                                        {{ customer.name }}
                                    </VCol>
                                </VRow>
                                <VRow>
                                    <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                        APIアクセスキー1
                                    </VCol>
                                    <VCol>
                                        <ContentSwitcher
                                            v-model="show_key_1"
                                            :text="customer.access_key_1"
                                            persistent
                                        >
                                            <template #switcherOn="{ text }">
                                                <p>{{ text }}</p>
                                            </template>
                                            <template #switcherOff="{ text }">
                                                <p>{{ Array(text?.length).fill('•').join('') }}</p>
                                            </template>
                                        </ContentSwitcher>
                                        <VBtn
                                            variant="outlined"
                                            density="comfortable"
                                            color="default"
                                            style="width: 8em;"
                                            :prepend-icon="show_key_1 ? 'mdi-eye-off' : 'mdi-eye'"
                                            class="mt-1 mr-1"
                                            @click="show_key_1=!show_key_1"
                                        >
                                            {{ show_key_1 ? '非表示' : '表示' }}
                                        </VBtn>
                                        <VBtn
                                            variant="outlined"
                                            density="comfortable"
                                            color="primary"
                                            prepend-icon="mdi-reload"
                                            class="mt-1"
                                            :loading="
                                                isResetAccessKeyFetching &&
                                                    resetAccessKeyNumber.number === 1
                                            "
                                            @click="resetAccessKeyConfirm(1)"
                                        >
                                            再発行
                                        </VBtn>
                                    </VCol>
                                </VRow>
                                <VRow>
                                    <VCol class="title pb-0 font-weight-bold" cols="12" sm="3">
                                        APIアクセスキー2
                                    </VCol>
                                    <VCol>
                                        <ContentSwitcher
                                            v-model="show_key_2"
                                            :text="customer.access_key_2"
                                            persistent
                                        >
                                            <template #switcherOn="{ text }">
                                                <p>{{ text }}</p>
                                            </template>
                                            <template #switcherOff="{ text }">
                                                <p>{{ Array(text?.length).fill('•').join('') }}</p>
                                            </template>
                                        </ContentSwitcher>
                                        <VBtn
                                            variant="outlined"
                                            density="comfortable"
                                            color="default"
                                            :prepend-icon="show_key_2 ? 'mdi-eye-off' : 'mdi-eye'"
                                            style="width: 8em;"
                                            class="mt-1 mr-1"
                                            @click="show_key_2=!show_key_2"
                                        >
                                            {{ show_key_2 ? '非表示' : '表示' }}
                                        </VBtn>
                                        <VBtn
                                            variant="outlined"
                                            density="comfortable"
                                            color="primary"
                                            prepend-icon="mdi-reload"
                                            class="mt-1"
                                            :loading="
                                                isResetAccessKeyFetching &&
                                                    resetAccessKeyNumber.number === 2
                                            "
                                            @click="resetAccessKeyConfirm(2)"
                                        >
                                            再発行
                                        </VBtn>
                                    </VCol>
                                </VRow>
                                <Dialog
                                    v-model="isShowResetAccessTokenDialog"
                                    :loading="isDeleteCustomerFetching"
                                    close-label="キャンセル"
                                    @confirmed="confirmedResetAccessKeyDialog()"
                                >
                                    <p>
                                        APIアクセスキー{{ resetAccessKeyNumber.number }}
                                        を再発行しますが、よろしいでしょうか？
                                    </p>
                                </Dialog>
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
                    @click="
                        navigateTo({
                            name: 'customers-edit-id',
                            params: { id: route.params.id },
                        })
                    "
                >
                    編集
                </VBtn>
                <Dialog
                    v-model="isShowDeleteDialog"
                    :loading="isDeleteCustomerFetching"
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
                            name: `customers`,
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
import { Customer } from '@admin/models/customer';
import { RetrieveApiResponse } from '@admin/models/base';

const { addAlert, clearAlert, AlertType } = useAlert();
const route = useRoute();
const resetAccessKeyNumber = ref({
    number: 0,
});
const show_key_1 = ref(false);
const show_key_2 = ref(false);
const isShowDeleteDialog = ref(false);
const isShowResetAccessTokenDialog = ref(false);
const { url: resetAccessKeyUrl } = useUrl({
    path: `/customers/${route.params.id}/reset-access-token/:number`,
    pathVariables: resetAccessKeyNumber.value,
});
const {
    onFetchResponse: onResetAccessKeyResponse,
    onFetchError: onResetAccessKeyError,
    get: fetchResetAccessKey,
    isFetching: isResetAccessKeyFetching,
} = useFetchApi()(resetAccessKeyUrl, { immediate: false });
const {
    delete: deleteCustomer,
    onFetchResponse: onDeleteCustomerResponse,
    onFetchError: onDeleteCustomerError,
    isFetching: isDeleteCustomerFetching,
} = useFetchApi()(`customers/${route.params.id}`, {
    immediate: false,
});
const {
    data: getCustomerData,
    isFetching: isGetCustomerFetching,
    isFinished: isGetCustomerFinished,
    get: getCustomer,
} = useFetchApi()<RetrieveApiResponse<Customer>>(`customers/${route.params.id}`, {
    immediate: true,
});
const customer = computed<Omit<Customer, 'id'>>(
    () => getCustomerData.value?.data || {
        name: '',
        access_key_1: '',
        access_key_2: '',
    },
);
const isInitSuccess = computed(() => isGetCustomerFinished.value && getCustomerData.value?.data);
onDeleteCustomerResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.deleteCustomer,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'customers' });
    isShowDeleteDialog.value = false;
});
onDeleteCustomerError(() => {
    isShowDeleteDialog.value = false;
});
const showDeleteConfirm = () => {
    clearAlert();
    isShowDeleteDialog.value = true;
};
const confirmedDeleteDialog = () => deleteCustomer().execute();
const resetAccessKeyConfirm = (num: number) => {
    resetAccessKeyNumber.value.number = num;
    clearAlert();
    isShowResetAccessTokenDialog.value = true;
};
const confirmedResetAccessKeyDialog = () => fetchResetAccessKey().execute();
onResetAccessKeyResponse(() => {
    const msg = `APIアクセスキー${resetAccessKeyNumber.value.number}${MESSAGES.successes.resetAccessKey}`;
    addAlert({
        type: AlertType.Success,
        message: msg,
    });
    isShowResetAccessTokenDialog.value = false;
    resetAccessKeyNumber.value.number = 0;
    getCustomer().execute();
});
onResetAccessKeyError(() => {
    isShowResetAccessTokenDialog.value = false;
});
</script>
<style scoped>
@media only screen and (min-width: 600px) {
    .title {
        text-align: end;
        padding-bottom: 12px !important;
    }
}
</style>
