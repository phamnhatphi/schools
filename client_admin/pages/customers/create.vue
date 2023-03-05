<template>
    <Page title="顧客情報 登録" require-auth>
        <VCard>
            <VForm @submit.prevent="createCustomer()">
                <VCardText>
                    <VRow>
                        <VCol lg="6">
                            <VTextField
                                v-model="customerData.name"
                                :error="!!validationErrorMessages.name"
                                :error-messages="validationErrorMessages.name"
                                density="compact"
                                hide-details="auto"
                                label="顧客名*"
                                variant="outlined"
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
                        :loading="isPostCustomerFetching"
                    >
                        登録
                    </VBtn>
                    <VBtn variant="outlined" @click="navigateTo({ name: 'customers' })"> 戻る </VBtn>
                </VCardActions>
            </VForm>
        </VCard>
    </Page>
</template>
<script setup lang="ts">
import { Customer } from '@admin/models/customer';
import { ValidationErrors } from '@admin/models/base';
import MESSAGES from '@admin/config/messages';

const { addAlert, clearAlert, AlertType } = useAlert();

const {
    validationErrorMessages,
    reset: resetValidationError,
    assign,
} = useValidationError({
    name: '',
});
const customerData = ref<Omit<Customer, 'id' | 'access_key_1' | 'access_key_2'>>({
    name: '',
});

const {
    data: postCustomerData,
    post: postCustomer,
    onFetchResponse: onPostCustomerResponse,
    onFetchError: onPostCustomerError,
    isFetching: isPostCustomerFetching,
} = useFetchApi()('customers', {
    immediate: false,
});

onPostCustomerResponse(() => {
    addAlert({
        type: AlertType.Success,
        message: MESSAGES.successes.createCustomer,
        keepForNextRoute: true,
    });
    navigateTo({ name: 'customers' });
});
onPostCustomerError(() => {
    assign(postCustomerData.value as ValidationErrors);
});

const createCustomer = () => {
    clearAlert();
    resetValidationError();
    postCustomer(customerData.value).execute();
};
</script>
