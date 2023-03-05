<template>
    <slot v-if="loading" name="loader" v-bind="props">
        <VProgressCircular v-if="props.type==='circular'" :color="props.color" indeterminate />
        <VProgressLinear v-else :color="props.color" indeterminate />
    </slot>
    <slot v-else v-bind="props"></slot>
</template>

<script setup lang="ts">
type Props = {
    /**
     * When true, the loader will be rendered.
     * Otherwise the component in default slot will be rendered.
     */
    loading: boolean;

    /**
     * The type of loader.
     * Default: 'linear'
     */
    type?: 'linear' | 'circular';

    /**
     * The color of loader.
     * Default: 'primary'
     */
    color?: string;
};

const props = withDefaults(defineProps<Props>(), {
    type: 'linear',
    color: 'primary',
});
</script>
