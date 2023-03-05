<template>
    <Page :title="'Sample: composable useAlert'">
        <VCard>
            <VRow>
                <VCol cols="12" md="4">
                    <VCardText class="pb-0">
                        <VSelect
                            v-model="alertType"
                            label="Alert Type"
                            :items="alertTypeItems"
                            density="compact"
                        />
                        <VSelect
                            v-model="alertVariant"
                            label="Alert Display Variant"
                            :items="alertVariantItems"
                            density="compact"
                        />
                        <template v-if="alertVariant === AlertVariant.Text">
                            <VTextField
                                v-model="alertMessage"
                                label="Alert Message"
                                density="compact"
                            />
                        </template>
                        <template v-if="alertVariant === AlertVariant.TwoColumns">
                            <VTextField
                                v-model="alertMessageObj.left"
                                label="Alert Message (left)"
                                density="compact"
                            />
                            <VTextField
                                v-model="alertMessageObj.right"
                                label="Alert Message (right)"
                                density="compact"
                            />
                        </template>
                        <VCheckbox
                            v-model="alertKeepForNextRoute"
                            label="Keep for next route"
                            density="compact"
                        />
                        <h3>alertContainers:</h3>
                        <VSheet color="#dfdfdf">
                            <pre><code>{{ alertContainer }}</code></pre>
                        </VSheet>
                    </VCardText>
                    <VCardActions>
                        <VBtn color="primary" variant="outlined" @click="addAlert()">Add</VBtn>
                        <VBtn color="error" variant="outlined" @click="clearAlert()">Clear</VBtn>
                    </VCardActions>
                </VCol>
            </VRow>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
import map from 'lodash/map';
import { AlertType, AlertVariant, Alert } from '@admin/models/alert';

const { alertContainer, addAlert: addAlertBase, clearAlert } = useAlert();

const alertTypeItems = computed(() => map(AlertType, (type, _) => type));
const alertVariantItems = computed(() => map(AlertVariant, (type, _) => type));

const alertType = ref(AlertType.Info);
const alertVariant = ref(AlertVariant.Text);
const alertMessage = ref('Default message');
const alertMessageObj = ref({ left: 'No.1', right: 'Default message' });
const alertKeepForNextRoute = ref(false);

const addAlert = () => {
    addAlertBase({
        type: alertType.value,
        variant: alertVariant.value,
        message:
            alertVariant.value === AlertVariant.TwoColumns
                ? alertMessageObj.value
                : alertMessage.value,
        keepForNextRoute: alertKeepForNextRoute.value,
    } as Alert);
};
</script>
