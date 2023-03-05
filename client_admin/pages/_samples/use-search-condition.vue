<template>
    <Page title="Sample: composable useSearchCondition">
        <VCard>
            <VRow>
                <VCol cols="12" md="4">
                    <VCardText class="pb-0">
                        <VTextField
                            v-model="reactiveFilters.testString"
                            label="Test String"
                            density="compact"
                        />
                        <VTextField
                            v-model="reactiveFilters.testNumber"
                            label="Test Number"
                            density="compact"
                        />
                        <VCheckbox
                            v-model="reactiveFilters.testBoolean"
                            label="Test Boolean"
                            density="compact"
                            :value="true"
                        />
                        <VItemGroup>
                            <div class="text-caption">Test Array</div>
                            <VItem>
                                <VRow>
                                    <VCol cols="6" md="3">
                                        <VCheckbox
                                            v-model="reactiveFilters.testArray"
                                            label="value=1"
                                            density="compact"
                                            :value="1"
                                        />
                                    </VCol>
                                    <VCol cols="6" md="3">
                                        <VCheckbox
                                            v-model="reactiveFilters.testArray"
                                            label="value=2"
                                            density="compact"
                                            :value="2"
                                        />
                                    </VCol>
                                </VRow>
                            </VItem>
                        </VItemGroup>
                        <div class="text-caption">reactiveFilters</div>
                        <VSheet color="#dfdfdf">
                            <pre><code>{{ reactiveFilters }}</code></pre>
                        </VSheet>
                        <div class="text-caption">isFiltersMerged</div>
                        <VSheet color="#dfdfdf">
                            <pre><code>{{ isFiltersMerged }}</code></pre>
                        </VSheet>
                    </VCardText>
                    <VCardActions>
                        <VBtn color="primary" variant="outlined" @click="submit">Submit</VBtn>
                        <VBtn color="defaut" variant="outlined" @click="goto">Change url</VBtn>
                        <VBtn color="error" variant="outlined" @click="resetFilters">Reset</VBtn>
                    </VCardActions>
                </VCol>
            </VRow>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
const { reactiveFilters, isFiltersMerged, updateRoute, resetFilters } = useSearchCondition({
    testString: '',
    testNumber: 0,
    testBoolean: true,
    testArray: [] as number[],
}, {
    parsers: {
        testArray: parseNumber,
    },
});

const toogle = ref(false);
const route = useRoute();

watch(isFiltersMerged, (val) => {
    if (val) {
        // eslint-disable-next-line no-alert
        alert('Route changed manually');
    }
}, { immediate: true });

const goto = () => {
    const query = toogle.value
        ? {
            testString: 'aaa',
            testBoolean: true,
            testArray: [1, 2],
        }
        : {
            testString: 'bbb',
            testBoolean: false,
            testArray: [],
        };

    toogle.value = !toogle.value;
    navigateTo({ name: route.name as any, query: query as any });
};

const submit = () => {
    updateRoute();
};
</script>
