export type RouteRecordName = string | symbol;

const usePageUrlStore = defineStore('pageUrls', () => {
    const pageUrls = ref<{[k: RouteRecordName]: string|null}>({});

    const setPageUrl = (name: RouteRecordName, url: string|null) => {
        pageUrls.value = {
            ...pageUrls.value,
            [name]: url,
        };
    };

    const clear = () => {
        pageUrls.value = {};
    };

    return {
        pageUrls,
        setPageUrl,
        clear,
    };
});

export default usePageUrlStore;
