import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';

const RESET_KEY = 'disable_restore_page_url';

export default defineNuxtRouteMiddleware((to, from) => {
    if (!to.name) {
        return true;
    }
    const pageUrlStore = usePageUrlStore();
    const fullToPath = pageUrlStore.pageUrls[to.name];

    const shouldRestore = (!to.query[RESET_KEY] || !parseBool(to.query[RESET_KEY], false)) &&
        isEmpty(omit(to.query, [RESET_KEY]));

    if (shouldRestore) {
        if (fullToPath && from.name !== to.name && to.fullPath !== fullToPath) {
            return navigateTo(fullToPath);
        }
    }

    if (to.query[RESET_KEY]) {
        pageUrlStore.setPageUrl(to.name, null);
        const newQuery = omit(to.query, [RESET_KEY]);
        const newTo = { ...to, query: newQuery };
        return navigateTo(newTo);
    }

    pageUrlStore.setPageUrl(to.name, to.fullPath);
    return true;
});
