<template>
    <div v-if="canRenderScreen">
        <h1 v-if="!props.hideTitle">{{ props.title }}</h1>
        <template v-for="(alerts, type) in alertContainer" :key="type">
            <VAlert
                v-model="alertModels[type].value"
                :type="type"
                :title="alertTitles[type]"
                closable
                class="mb-2"
                density="compact"
            >
                <template v-for="alert in alerts.value" :key="alert.message">
                    <div
                        v-if="!alert.keepForNextRoute"
                        class="d-flex flex-md-row flex-column v-alert-message"
                    >
                        <template v-if="alert.variant === AlertVariant.TwoColumns">
                            <div class="font-weight-bold" :style="{ minWidth: '80px' }">
                                {{ alert.message.left }}
                            </div>
                            <div>{{ alert.message.right }}</div>
                        </template>
                        <template v-else>
                            <div>{{ alert.message }}</div>
                        </template>
                    </div>
                </template>
            </VAlert>
        </template>
        <slot v-bind="props"></slot>
    </div>
</template>

<script setup lang="ts">
import { AlertVariant } from '@admin/models/alert';

type Props = {
    /**
     * The title of screen.
     */
    title: string;

    /**
     * If `true`, the title will not be rendered.
     */
    hideTitle?: boolean;

    /**
     * When `true`, the user need to login before accessing this screen
     */
    requireAuth?: boolean;

    /**
     * When `true`, the access to this page that has alread logged-in
     * will redirect to admin home page
     */
    preventIfAuth?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    hideTitle: false,
    preventIfAuth: false,
    requireAuth: false,
});

const { alertContainer, alertModels, clearAlert, touchNextRouteAlerts } = useAlert();
const { isAuthenticated } = useAuth();
const route = useRoute();

const canRenderScreen = computed(() => !props.requireAuth || isAuthenticated.value);

onBeforeMount(() => {
    if (props.requireAuth) {
        if (!isAuthenticated.value) {
            navigateTo({
                name: 'login',
                query: {
                    goto: route.fullPath,
                },
            });
        }
    } else if (props.preventIfAuth) {
        if (isAuthenticated.value) {
            navigateTo({ name: 'index' });
        }
    }
});

onMounted(() => {
    clearAlert({ excludeNextRouteAlerts: true });
    touchNextRouteAlerts();

    // Delay the title setting to make sure that
    // the title change correctly in web browser history back
    setTimeout(() => useHead({
        title: props.title,
    }), 10);
});
</script>
