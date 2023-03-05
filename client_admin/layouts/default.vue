<template>
    <VApp>
        <template v-if="canRenderScreen">
            <VAppBar density="compact" color="grey-lighten-2">
                <VAppBarNavIcon
                    v-if="!isDesktopSize && isAuthenticated"
                    @click.stop="drawer = !drawer"
                />
                <NuxtLink to="/" class="sitename" @click="drawer = false">{{ appName }}</NuxtLink>
                <div v-for="group in menu" :key="group.title">
                    <VMenu v-if="isDesktopSize && isAuthenticated">
                        <template #activator="{ props }">
                            <VBtn v-bind="props" append-icon="mdi-chevron-down">
                                {{ group.title }}
                            </VBtn>
                        </template>
                        <VList>
                            <VListItem
                                v-for="item in group.items"
                                :key="item.title"
                                :title="item.title"
                                :to="item.route"
                            />
                        </VList>
                    </VMenu>
                </div>
                <VSpacer />
                <VMenu v-if="isDesktopSize && isAuthenticated && loginInfo">
                    <template #activator="{ props }">
                        <VBtn v-bind="props" append-icon="mdi-chevron-down">
                            {{ loginInfo.display_name }}
                        </VBtn>
                    </template>
                    <VList>
                        <VListItem :title="'Logout'" @click="logout">
                            <template #prepend>
                                <VIcon class="mr-2" icon="mdi-logout" />
                            </template>
                        </VListItem>
                    </VList>
                </VMenu>
            </VAppBar>

            <VNavigationDrawer
                v-if="!isDesktopSize && isAuthenticated"
                v-model="drawer"
                temporary
                location="start"
            >
                <VList v-for="(group, key) in menu" :key="key">
                    <VListGroup :value="group.title">
                        <template #activator="{ props }">
                            <VListItem v-bind="props" :title="group.title" />
                        </template>
                        <VListItem
                            v-for="(item, i) in group.items"
                            :key="i"
                            :title="item.title"
                            :to="item.route"
                        />
                    </VListGroup>
                </VList>
                <VDivider />
                <VList>
                    <VListGroup>
                        <template #activator="{ props }">
                            <VListItem v-bind="props" :title="loginInfo?.display_name" />
                        </template>
                        <VListItem :title="'Logout'" prepend-icon="mdi-logout" @click="logout" />
                    </VListGroup>
                </VList>
            </VNavigationDrawer>
            <VMain>
                <VContainer>
                    <slot></slot>
                </VContainer>
            </VMain>

            <VFooter>{{ copyright }}</VFooter>
        </template>
        <VContainer v-else class="center-screen">
            <VCard>
                <VCardText>
                    <VProgressCircular
                        :size="50"
                        :width="7"
                        color="info"
                        indeterminate
                        class="mb-3"
                    /><br />
                    {{ MESSAGES.infos.responseWaiting }}
                </VCardText>
            </VCard>
        </VContainer>
    </VApp>
</template>

<script setup lang="ts">
import { getYear } from 'date-fns';
import { useBreakpoints, breakpointsVuetify } from '@vueuse/core';
import menu from '@admin/config/menu';
import MESSAGES from '@admin/config/messages';

const config = useRuntimeConfig();
const { appName, companyName, appVersion } = config.public;
const year = getYear(new Date());
const copyright = `${appName} Ver.${appVersion} © ${year} ${companyName}`;

const { canRenderScreen, loginInfo } = useLoginInfo();
const { isAuthenticated, logout } = useAuth();

const drawer = ref(false);
const breakpoints = useBreakpoints(breakpointsVuetify);
const isDesktopSize = breakpoints.greaterOrEqual('sm');

watch(isDesktopSize, () => {
    if (isDesktopSize.value) {
        drawer.value = false;
    }
});
</script>

<style scoped>
.sitename {
    font-weight: bold;
    margin-left: 10px;
    margin-right: 10px;
    text-decoration: none !important;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
}

.v-application,
.v-footer {
    background-color: #f5f8fa;
}

.center-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
}
</style>
