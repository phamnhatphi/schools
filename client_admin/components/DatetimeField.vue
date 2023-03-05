<template>
    <VTextField
        v-model="inputValue"
        :max="props.max"
        type="datetime-local"
        v-bind="$attrs"
        @blur="onBlur"
    />
</template>

<script setup lang="ts">
import { format, setSeconds, setMilliseconds } from 'date-fns';

type Props = {
    modelValue?: string;

    /**
     * Max inputable of value
     */
    max?: string;

    /**
     * The number of seconds want to set to the returned value from input
     */
    seconds?: number;
    milliseconds?: number;
};

const props = withDefaults(defineProps<Props>(), {
    max: '9999-12-31T23:59',
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
    get() {
        return props.modelValue
            ? format(new Date(props.modelValue), "yyyy-MM-dd'T'HH:mm")
            : props.modelValue;
    },
    set(val) {
        let formatted = val;
        if (formatted) {
            let date = new Date(formatted);
            date = setSeconds(date, props.seconds || 0);
            date = setMilliseconds(date, props.milliseconds || 0);
            formatted = formatDatetime(date, 'iso');
        }
        emit('update:modelValue', formatted);
    },
});

const onBlur = (evt: Event) => {
    // Clear input value if the inputted value format is incorrect,
    // to make the returned value via v-model and the displayed value in input be consistent.
    const currentVal = (evt.target as any).value;
    if (!currentVal) {
        // eslint-disable-next-line no-param-reassign
        (evt.target as any).value = '';
    }
};
</script>
