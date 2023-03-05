<template>
    <Page title="Sample of component DateField">
        <VCard>
            <VCardText>
                <VLabel>Without time addition</VLabel>
                <DateField
                    v-model="value1"
                    density="compact"
                    variant="outlined"
                />
                <VSheet>{{ value1 }}</VSheet>
            </VCardText>
            <VCardText>
                <VLabel>With time addition</VLabel>
                <DateField
                    v-model="value2"
                    density="compact"
                    variant="outlined"
                    :hours="23"
                    :minutes="59"
                    :seconds="59"
                    :milliseconds="999"
                />
                <VSheet>{{ value2 }}</VSheet>
            </VCardText>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
const value1 = ref();
const value2 = ref();
</script>
