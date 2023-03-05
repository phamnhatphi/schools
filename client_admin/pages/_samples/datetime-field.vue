<template>
    <Page title="Sample of component DatetimeField">
        <VCard>
            <VCardText>
                <DatetimeField
                    v-model="value"
                    density="compact"
                    variant="outlined"
                />
                <VSheet>{{ value }}</VSheet>
            </VCardText>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
const value = ref('');
</script>
