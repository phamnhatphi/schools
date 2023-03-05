<template>
    <Page title="顧客情報 編集" require-auth>
        <VCard>
            <VForm @submit.prevent="updateCustomer()">
                <VCardText>
                    <VRow>
                        <VCol lg="6">
                            <Loader :loading="isGetCustomerFetching">
                                <VSheet v-if="isInitSuccess">
                                    <VTextField
                                        v-model="customerData.name"
                                        :error="!!validationErrorMessages.name"
                                        :error-messages="validationErrorMessages.name"
                                        density="compact"
                                        hide-details="auto"
                                        label="顧客名*"
                                        variant="outlined"
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
                        :loading="isPutCustomerFetching"
                    >
                        更新
                    </VBtn>
                    <VBtn
                        variant="outlined"
                        @click="
                            navigateTo({
                                name: 'customers-view-id',
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
import { Customer } from '@admin/models/customer';
import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import MESSAGES from '@admin/config/messages';

const { addAlert, clearAlert, AlertType } = useAlert();
const route = useRoute();

const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    name: '',
});
const customerData = reactive<Omit<Customer, 'id' | 'access_key_1' | 'access_key_2'>>({
    name: '',
});

const {
    data: putCustomerData,
    put: putCustomer,
    onFetchResponse: onPutCustomerResponse,
    onFetchError: onPutCustomerError,
    isFetching: isPutCustomerFetching,
} = useFetchApi()(`customers/${route.params.id}`, {
    immediate: false,
});
const {
    data: getCustomerData,
    onFetchResponse: onGetCustomerResponse,
    isFetching: isGetCustomerFetching,
    isFinished: isGetCustomerFinished,
} = useFetchApi()<RetrieveApiResponse<Customer>>(`customers/${route.params.id}`, {
    immediate: true,
});

const isInitSuccess = computed(() => isGetCustomerFinished.value && getCustomerData.value?.data);

onGetCustomerResponse(() => {
    mapKeys(customerData, (_, key) => {
        set(customerData, key, getCustomerData.value?.data[key as keyof Customer]);
    });
});

onPutCustomerResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.updateCustomer,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'customers' });
});
onPutCustomerError(() => {
    assign(putCustomerData.value as ValidationErrors);
});

const updateCustomer = () => {
    clearAlert();
    resetValidationError();
    putCustomer(customerData).execute();
};
</script>
