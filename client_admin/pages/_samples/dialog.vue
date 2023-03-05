<template>
    <Page title="Sample of component Dialog">
        <VCard>
            <VCardText>
                <VRow>
                    <VCol cols="12" sm="12">
                        <Dialog
                            v-model="dialog1"
                            :loading="loading1"
                            title="Confirm Dialog"
                            @confirmed="confirm1()"
                            @closed="close1()"
                        >
                            <template #activator="{ props }">
                                <VBtn color="primary" v-bind="props" class="mr-2">
                                    Open (Mode: Confirm)
                                </VBtn>
                            </template>
                            <p>Is it ok to execute this process?</p>
                            <VCheckbox
                                v-model="checkVal"
                                label="Sample of checkbox"
                                density="compact"
                                :hide-details="true"
                            />
                        </Dialog>
                    </VCol>
                    <VCol cols="12" sm="12">
                        <Dialog v-model="dialog2" variant="announcement" @closed="close2()">
                            <template #title>
                                <VIcon color="info">mdi-information-outline</VIcon>
                                Announcement Dialog
                            </template>
                            <template #activator="{ props }">
                                <VBtn color="primary" v-bind="props" class="mr-2">
                                    Open (Mode: Announcement)
                                </VBtn>
                            </template>
                            <p>This is an sample of announcement dialog</p>
                        </Dialog>
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
const dialog1 = ref(false);
const loading1 = ref(false);

const checkVal = ref(false);

const close1 = () => {
    console.log('Closed 1');
};

const confirm1 = () => {
    loading1.value = true;
    setTimeout(() => {
        console.log('checkval', checkVal.value);
        loading1.value = false;
        dialog1.value = false;
    }, 2000);
};

// ----------

const dialog2 = ref(false);

const close2 = () => {
    console.log('Closed 2');
};
</script>
