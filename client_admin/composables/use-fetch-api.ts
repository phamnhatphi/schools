import { AfterFetchContext, createFetch } from '@vueuse/core';
import lodashGet from 'lodash/get';
import MESSAGES from '@admin/config/messages';

export type Options = {
    requireAuth?: boolean;
    disableHandler?: {
        unauthorizedError?: boolean;
        unknownError?: boolean;
    };
};

export type UseFetchContext = {
    data: any;
    response: Response | null;
    error: any;
};

export type OnFetchErrorHandler = (ctx: UseFetchContext) => void;

/**
 * Auto parse response data to JSON object.
 * There will a JSON parsing error if we use .json() method when execute fetching
 * but the response does not contain a valid JSON string.
 * So it's better not to call `.json()` explicitly when execute fetching,
 * and parsing response data to JSON object here instead.
 **/
const tryParsingDataToJson = (ctx: UseFetchContext|AfterFetchContext) => {
    if (ctx.response && ctx.response.headers.get('content-type') === 'application/json') {
        if (typeof ctx.data !== 'object') {
            try {
                ctx.data = JSON.parse(ctx.data);
            } catch {
                // Crush error if data is not a valid JSON string
            }
        }
    }
};

const useHandleUnauthorizedError = () => {
    const route = useRoute();
    const { addAlert, AlertType } = useAlert();
    const { logout } = useAuth();

    const handler: OnFetchErrorHandler = (ctx: UseFetchContext) => {
        if (ctx.response?.status === 401) {
            addAlert({
                type: AlertType.Error,
                message: MESSAGES.errors.unauthorizedResponse,
            });
            logout();
            navigateTo({ name: 'login', query: { goto: route.fullPath } });
        }
    };

    return handler;
};

const useHandleUnknownError = () => {
    const { addAlert, AlertType } = useAlert();

    const handler: OnFetchErrorHandler = (ctx: UseFetchContext) => {
        const excludedErrorStatuses = [401, 422];
        const httpStatus = lodashGet(ctx.response, 'status');
        const isError =
            !ctx.response || (httpStatus && !excludedErrorStatuses.includes(httpStatus));

        let message = MESSAGES.errors.unknownResponse;
        if (httpStatus) {
            message += `(ステータスコード：${httpStatus})`;
        }

        if (ctx.data && ctx.data.detail) {
            message = `${ctx.data.detail}`;
        }

        if (isError) {
            addAlert({
                type: AlertType.Error,
                message,
            });
        }
    };

    return handler;
};

/**
 * Handle the api fetching.
 * This composition also handles the api token intercepting and other common process.
 *
 * @docs https://vueuse.org/core/usefetch/
 * @returns useFetch instance
 */
const useFetchApi = (options: Options = {}) => {
    const { requireAuth = true, disableHandler = {} } = options;

    const { loginToken, isAuthenticated } = useAuth();
    const config = useRuntimeConfig();

    const handleUnauthorizedError = useHandleUnauthorizedError();
    const handleUnknownError = useHandleUnknownError();
    return createFetch({
        baseUrl: config.public.apiBaseUrl,
        options: {
            beforeFetch({ options: opts }) {
                if (requireAuth && isAuthenticated.value) {
                    // eslint-disable-next-line no-param-reassign
                    opts.headers = {
                        ...opts.headers,
                        Authorization: `Bearer ${loginToken.value}`,
                    };
                }

                return { options: opts };
            },
            afterFetch(ctx) {
                tryParsingDataToJson(ctx);
                return ctx;
            },
            onFetchError(ctx) {
                /**
                 * Print out error to console for debugging purpose.
                 * NOTE: please do not remove this even if in production mode.
                 **/
                console.error(ctx);

                tryParsingDataToJson(ctx);

                if (!lodashGet(disableHandler, 'unauthorizedError')) {
                    handleUnauthorizedError(ctx);
                }

                if (!lodashGet(disableHandler, 'unknownError')) {
                    handleUnknownError(ctx);
                }

                return ctx;
            },
        },
    });
};

export default useFetchApi;
