<template>
    <VDialog
        v-model="dialog"
        :max-width="props.maxWidth"
        :persistent="realPersistent"
        :scrollable="props.scrollable"
        transition="v-dialog-transition"
    >
        <template #activator="activatorData">
            <slot name="activator" v-bind="activatorData"></slot>
        </template>
        <VCard>
            <VCardTitle class="title">
                <slot name="title">
                    <VIcon color="warning">mdi-alert</VIcon> {{ props.title }}
                </slot>
            </VCardTitle>
            <VDivider />
            <VCardText>
                <slot>Bạn có chắc chắn muốn thực hiện hoạt động này?</slot>
            </VCardText>
            <VDivider />
            <VCardActions class="justify-center">
                <slot name="action">
                    <VBtn
                        v-if="props.variant === 'confirm'"
                        color="primary"
                        variant="outlined"
                        :loading="loading"
                        @click="confirm()"
                    >
                        {{ props.okLabel }}
                    </VBtn>
                    <VBtn color="default" variant="outlined" :disabled="loading" @click="close()">
                        {{ props.closeLabel }}
                    </VBtn>
                </slot>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
type Props = {
    // VDialog's original props
    persistent?: boolean;
    scrollable?: boolean;
    maxWidth?: string;

    /**
     * Set the loading mode to dialog
     */
    loading?: boolean;

    /**
     * Deciding the variant of buttons which are shown in action area.
     *
     * * If variant is 'confirm', there are two buttons (OK, Close).
     * * If variant is 'announcement', there is only one button (Close).
     *
     * This props will be omited if the buttons are set manually via slot 'action'.
     */
    variant?: 'confirm' | 'announcement';

    closeLabel?: string;
    okLabel?: string;
    title?: string;

    modelValue: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    persistent: false,
    scrollable: false,
    maxWidth: '600px',
    loading: false,
    variant: 'confirm',
    closeLabel: 'Cancel',
    okLabel: 'OK',
    title: 'Confirm',
});

const emit = defineEmits(['confirmed', 'closed', 'update:modelValue']);

const dialog = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    },
});

const realPersistent = computed(() => props.persistent || props.loading);

const close = () => {
    dialog.value = false;
    emit('closed');
};

const confirm = () => {
    emit('confirmed');
};
</script>
