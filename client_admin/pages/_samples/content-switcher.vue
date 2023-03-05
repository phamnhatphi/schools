<template>
    <Page title="Sample of component ContentSwitcher">
        <VCard>
            <VCardText>
                <VLabel>1. persistent = false, slot with defaut content</VLabel>
                <div>
                    <ContentSwitcher text="This is plain text" style="cursor: pointer" />
                </div>
            </VCardText>
            <VCardText>
                <VLabel>2. persistent = true, slot with custom content</VLabel>
                <div>
                    <ContentSwitcher v-model="switcher2" persistent :text="text2">
                        <template #switcherOn="{ text }">
                            <div>{{ text }}</div>
                        </template>
                        <template #switcherOff="{ text }">
                            <div
                                style="
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                "
                            >
                                {{ text }}
                            </div>
                        </template>
                    </ContentSwitcher>
                </div>
                <VBtn @click="switcher2 = !switcher2">{{ switcher2 ? 'Hide' : 'Show' }}</VBtn>
            </VCardText>
        </VCard>
    </Page>
</template>

<script setup lang="ts">
const switcher2 = ref(false);
const text2 = ref(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
);
</script>
