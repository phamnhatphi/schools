import cloneDeep from 'lodash/cloneDeep';

type LocationQueryValueRaw = string | number | boolean | null | undefined;
type LocationQueryRaw = Record<string | number, LocationQueryValueRaw | LocationQueryValueRaw[]>;

type Options = {
    immediate?: boolean;
    parsers?: Record<string | number, Function>;
};

/**
 * Combine the updating of route's query params and
 * filter conditions of search page.
 *
 * This packes the logic for auto-updating search conditions
 * if query params change and vice versa.
 */
const useSearchCondition = <T extends object>(defaultFilters: T, options: Options = {}) => {
    const { immediate = true, parsers = {} } = options;
    const filters = ref(cloneDeep(defaultFilters));

    const isUpdateRouteFired = ref(false);

    /**
     * Determine the changing of route's query has been merged to filters or not.
     *
     * If the route changed by the update of filters via the function updateRoute,
     * we don't need to merge the query to filters again.
     * Otherwise, if the route changed independently with the update of filters
     * (a normal navigation or etc), we need to merge the query to filters,
     * and composable-using side can know this via this ref variable.
     */
    const isFiltersMerged = ref<boolean | null>(null);

    const reactiveFilters = reactiveComputed(() => filters.value) as T;

    const route = useRoute();

    /**
     * Update current route's query by the filters
     *
     * @param options
     */
    const updateRoute = useDebounceFn(async ({ replace = true } = {}) => {
        isUpdateRouteFired.value = true;
        await navigateTo(
            {
                name: route.name as any,
                query: filters.value as any,
                params: route.params,
                hash: route.hash,
            },
            { replace },
        );

        // Wating until the watcher of route updating (if there is) completed,
        // and then reset this flag.
        isUpdateRouteFired.value = false;
    }, 200);

    /**
     * Reset the filters and update the current route
     */
    const resetFilters = () => {
        filters.value = cloneDeep(defaultFilters);
        updateRoute();
    };

    watch(
        route,
        (newRoute) => {
            isFiltersMerged.value = null;

            if (!isUpdateRouteFired.value) {
                const { query } = newRoute;
                const newFilters = mergeToFilters(
                    defaultFilters as LocationQueryRaw,
                    query,
                    parsers,
                );
                filters.value = newFilters as any;

                // Delay the changing of this variable,
                // to make sure that the watcher (if there is) can watch this.
                setTimeout(() => { isFiltersMerged.value = true; });
            } else {
                setTimeout(() => { isFiltersMerged.value = false; });
            }

            isUpdateRouteFired.value = false;
        },
        { immediate },
    );

    return { filters, reactiveFilters, isFiltersMerged, updateRoute, resetFilters };
};

const mergeToFilters = (
    to: LocationQueryRaw,
    from: LocationQueryRaw,
    parsers: Options['parsers'] = {},
) => {
    const newFilters: LocationQueryRaw = {};

    Object.keys(to).forEach((key) => {
        let val = to[key];
        const parser = parsers[key] || undefined;

        if (from[key]) {
            if (typeof val === 'boolean') {
                val = parseBool(from[key], val);
                if (parser) {
                    val = parser(val);
                }
            } else if (typeof val === 'number') {
                val = parseNumber(from[key], val);
                if (parser) {
                    val = parser(val);
                }
            } else if (typeof val === 'string' && typeof from[key] === 'string') {
                val = from[key];
                if (parser) {
                    val = parser(val);
                }
            } else if (Array.isArray(val)) {
                const fromVal = Array.isArray(from[key])
                    ? from[key]
                    : [from[key] as LocationQueryValueRaw];

                if (Array.isArray(fromVal)) {
                    let arrayParser: Function = parser;

                    if (!arrayParser && val[0] && typeof val[0] === 'number') {
                        arrayParser = parseNumber;
                    }

                    if (arrayParser) {
                        val = (fromVal as LocationQueryValueRaw[]).map(
                            (eachFromVal) => arrayParser(eachFromVal),
                        );
                    } else {
                        val = fromVal;
                    }
                }
            }
        }

        newFilters[key] = val;
    });

    return newFilters;
};

export default useSearchCondition;
