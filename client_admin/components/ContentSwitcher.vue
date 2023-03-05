<template>
    <span
        v-if="!props.persistent"
        v-click-outside="onClickOutside"
        @click.prevent="switcher = true"
    >
        <!-- Switcher true (on)-->
        <slot v-if="switcher" name="switcherOn" v-bind="props">
            <VTextField
                v-if="props.text !== undefined"
                :value="props.text"
                density="compact"
                hide-details
                variant="outlined"
                autofocus
                @focus="$event.target.select()"
            />
        </slot>

        <!-- Switcher false-->
        <slot v-else name="switcherOff" v-bind="props">•••••••••</slot>
    </span>
    <template v-else>
        <slot v-if="switcher" name="switcherOn" v-bind="props">
            <VTextField
                v-if="props.text !== undefined"
                :value="props.text"
                density="compact"
                hide-details
                variant="outlined"
                autofocus
                @focus="$event.target.select()"
            />
        </slot>

        <!-- Switcher false-->
        <slot v-else name="switcherOff" v-bind="props">•••••••••</slot>
    </template>
</template>

<script setup lang="ts">
type Props = {
    text?: string;
    modelValue?: boolean;

    /**
     * If false, swicher is able to be turned on by click itself and turned off by click outside
     * Default: false
     */
    persistent?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    persistent: false,
    modelValue: undefined,
});

const emit = defineEmits(['update:modelValue']);
const innerSwitcher = ref(props.modelValue !== undefined ? props.modelValue : false);

const switcher = computed({
    get() {
        return props.modelValue !== undefined ? props.modelValue : innerSwitcher.value;
    },
    set(val) {
        innerSwitcher.value = val;
        emit('update:modelValue', val);
    },
});

const onClickOutside = () => {
    if (!props.persistent) {
        switcher.value = false;
    }
};
</script>
