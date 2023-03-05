<template>
    <Page title="顧客情報 一覧" require-auth>
        <VRow>
            <VCol cols="12" sm="9">
                <VCard>
                    <VForm @submit.prevent="loadItems">
                        <VCardText>
                            <VRow>
                                <VCol lg="6">
                                    <VTextField
                                        v-model="reactiveFilters.keyword"
                                        hide-details="auto"
                                        label="キーワード"
                                        variant="outlined"
                                        density="compact"
                                    />
                                </VCol>
                            </VRow>
                        </VCardText>
                        <VDivider />
                        <VCardActions class="pl-4">
                            <VBtn
                                :loading="isGetCustomersFetching"
                                variant="outlined"
                                color="primary"
                                type="submit"
                            >
                                検索
                            </VBtn>
                            <VBtn
                                :loading="isGetCustomersFetching"
                                hide-details="auto"
                                variant="outlined"
                                @click="reset"
                            >
                                リセット
                            </VBtn>
                        </VCardActions>
                    </VForm>
                </VCard>
            </VCol>
            <VCol>
                <VCard>
                    <VCardActions>
                        <VBtn
                            variant="outlined"
                            block
                            @click="navigateTo({ name: 'customers-create' })"
                        >
                            登録
                        </VBtn>
                    </VCardActions>
                </VCard>
            </VCol>
        </VRow>
        <VRow>
            <VCol>
                <VCard>
                    <VDataTableServer
                        v-if="isDisplayDataTable"
                        v-model:sort-by="sortBy"
                        :headers="headers"
                        :items-length="totalItems"
                        :items="customers"
                        :loading="isGetCustomersFetching"
                        class="elevation-1 data-table"
                        item-title="ID"
                        item-value="ID"
                        hide-default-footer
                        @update:sort-by="loadItems"
                    >
                        <template #top>
                            <VRow class="pa-2 pl-4 pt-5">
                                <VCol class="d-flex align-center pt-0" cols="auto">
                                    <VSelect
                                        v-model="reactiveFilters.limit"
                                        :items="paginationConfig.items_per_page_options"
                                        variant="outlined"
                                        single-line
                                        density="compact"
                                        :hide-details="true"
                                        @update:model-value="loadItems"
                                    />
                                    <p class="pa-2">件表示 全{{ totalItems }}件</p>
                                </VCol>
                            </VRow>
                            <VDivider />
                        </template>
                        <template #bottom>
                            <div v-if="isDisplayPagination">
                                <VDivider />
                                <VRow justify="end" class="pa-2 pt-5">
                                    <VCol cols="auto" class="pt-0">
                                        <VPagination
                                            v-model="reactiveFilters.page"
                                            :length="pageCount"
                                            :total-visible="5"
                                            class="text-center pt-2"
                                            density="comfortable"
                                            @update:model-value="loadItems"
                                        />
                                    </VCol>
                                </VRow>
                            </div>
                            <p v-if="isEmptyResult" class="text-center pa-5">
                                {{ paginationConfig.messages.empty }}
                            </p>
                        </template>
                        <template #[`item.access_key_1`]="{ item }">
                            <ContentSwitcher
                                :text="item.value.access_key_1"
                                style="cursor: pointer"
                            >
                                <template #switcherOff>
                                    <span>{{ Array(9).fill('•').join('') }}</span>
                                    <VIcon size="small" class="mt-auto mb-auto ps-1">
                                        mdi-eye
                                    </VIcon>
                                </template>
                            </ContentSwitcher>
                        </template>
                        <template #[`item.access_key_2`]="{ item }">
                            <ContentSwitcher
                                :text="item.value.access_key_2"
                                style="cursor: pointer"
                            >
                                <template #switcherOff>
                                    <span>{{ Array(9).fill('•').join('') }}</span>
                                    <VIcon size="small" class="mt-auto mb-auto ps-1">
                                        mdi-eye
                                    </VIcon>
                                </template>
                            </ContentSwitcher>
                        </template>
                        <template #[`item.edit_button`]="{ item }">
                            <VBtn
                                variant="outlined"
                                @click="
                                    navigateTo({
                                        name: 'customers-view-id',
                                        params: { id: item.value.id },
                                    })
                                "
                            >
                                詳細
                            </VBtn>
                        </template>
                    </VDataTableServer>
                </VCard>
            </VCol>
        </VRow>
    </Page>
</template>
<script setup lang="ts">
import paginationConfig from '@admin/config/pagination';
import { User } from '@admin/models/user';
import { ListApiResponse } from '@admin/models/base';

definePageMeta({
    middleware: 'restore-page-url',
});

const { clearAlert } = useAlert();

const needClearAlert = ref(false);
const isDisplayDataTable = ref(true);
const customers = ref<User[]>([]);
const pageCount = computed(() => Math.ceil(totalItems.value / reactiveFilters.limit));
const isDisplayPagination = computed(() => isGetCustomersFinished && customers.value.length !== 0);
const isEmptyResult = computed(() => isGetCustomersFinished && customers.value.length === 0);

const { reactiveFilters, isFiltersMerged, resetFilters, updateRoute } = useSearchCondition({
    limit: paginationConfig.default_value.limit,
    page: paginationConfig.default_value.page,
    sort_column: '',
    sort_direction: '',
    keyword: '',
});
watch(isFiltersMerged, (val) => {
    if (val) {
        loadItems();
    }
});
const sortBy = computed({
    get() {
        return [
            {
                key: reactiveFilters.sort_column,
                order: reactiveFilters.sort_direction,
            },
        ];
    },
    set(newValue) {
        if (newValue.length !== 0) {
            reactiveFilters.sort_column = newValue[0].key;
            reactiveFilters.sort_direction = newValue[0].order;
        } else {
            reactiveFilters.sort_column = 'id';
            reactiveFilters.sort_direction = 'asc';
        }
    },
});
const totalItems = ref(0);
const headers = [
    { title: 'ID', align: 'end', key: 'id', width: '100px' },
    { title: '顧客名', key: 'name', width: '50%' },
    { title: 'APIアクセスキー1', key: 'access_key_1', sortable: false },
    { title: 'APIアクセスキー2', key: 'access_key_2', sortable: false },
    { title: '', key: 'edit_button', align: 'end', sortable: false },
];

const loadItems = () => {
    if (needClearAlert.value) {
        clearAlert();
    } else {
        needClearAlert.value = true;
    }
    fetchGetCustomers().execute();
};

const { url: getCustomersUrl } = useUrl({
    path: '/customers',
    queryParams: reactiveFilters,
});

const {
    data: getCustomersData,
    onFetchResponse: onGetCustomersResponse,
    onFetchError: onGetCustomersError,
    statusCode: getCustomerstatusCode,
    get: fetchGetCustomers,
    isFinished: isGetCustomersFinished,
    isFetching: isGetCustomersFetching,
} = useFetchApi()<ListApiResponse<User>>(getCustomersUrl, { immediate: false });

onGetCustomersResponse(() => {
    if (getCustomersData.value) {
        customers.value = getCustomersData.value.data;

        reactiveFilters.limit = getCustomersData.value.pagination.limit;
        totalItems.value = getCustomersData.value.pagination.total;
        reactiveFilters.page = getCustomersData.value.pagination.page;

        sortBy.value = [
            {
                key: getCustomersData.value.pagination.sort_column,
                order: getCustomersData.value.pagination.sort_direction,
            },
        ];
    }

    updateRoute();
});
const reset = () => {
    resetFilters();
    loadItems();
};
onGetCustomersError(() => {
    customers.value = [];
    if (getCustomerstatusCode.value === 500) {
        isDisplayDataTable.value = false;
    }
});
</script>
