import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';
import { camelCase } from 'change-case';
import { AlertType, Alert, SetAlert } from '@admin/models/alert';

export const alertTitles = {
    [AlertType.Info]: 'Info',
    [AlertType.Warning]: 'Warning',
    [AlertType.Error]: 'Error',
    [AlertType.Success]: 'Success',
};

const filterShowableAlerts = (alerts: Alert[]) => alerts.filter((alert) => !alert.keepForNextRoute);
const filterUnshowableAlerts = (alerts: Alert[]) => alerts.filter(
    (alert) => alert.keepForNextRoute,
);

const useAlert = () => {
    const alertStore = useAlertStore();

    const { y: scrollY } = useScroll(window, { behavior: 'smooth' });

    const alertContainer = {
        [AlertType.Info]: computed(() => alertStore.info),
        [AlertType.Warning]: computed(() => alertStore.warning),
        [AlertType.Error]: computed(() => alertStore.error),
        [AlertType.Success]: computed(() => alertStore.success),
    };

    const alertModels = {
        [AlertType.Info]: computed({
            get() {
                return filterShowableAlerts(alertStore.info).length > 0;
            },
            set(_) {
                alertStore.setInfo([]);
            },
        }),

        [AlertType.Warning]: computed({
            get() {
                return filterShowableAlerts(alertStore.warning).length > 0;
            },
            set(_) {
                alertStore.setWarning([]);
            },
        }),

        [AlertType.Error]: computed({
            get() {
                return filterShowableAlerts(alertStore.error).length > 0;
            },
            set(_) {
                alertStore.setError([]);
            },
        }),

        [AlertType.Success]: computed({
            get() {
                return filterShowableAlerts(alertStore.success).length > 0;
            },
            set(_) {
                alertStore.setSuccess([]);
            },
        }),
    };

    /**
     * [Private] Call alertStore's set{...} method dynamically
     * @param action
     * @param alerts
     */
    const setAlert = (type: AlertType, alerts: Alert[]) => {
        const action = camelCase(`set_${type}`);
        (alertStore[action as keyof typeof alertStore] as SetAlert)(alerts);
    };

    const addAlert = (alert: Alert, scrollTop = true) => {
        const { type } = alert;
        const newAlerts = [...alertStore[type], cloneDeep(alert)];
        setAlert(type, newAlerts);

        if (scrollY.value > 0 && alert.keepForNextRoute === false && scrollTop === true) {
            scrollY.value = 0;
        }
    };

    const clearAlert = ({
        type = undefined,
        excludeNextRouteAlerts = false,
    }: { type?: AlertType; excludeNextRouteAlerts?: boolean } = {}) => {
        let types: AlertType[];
        if (type) {
            types = [type];
        } else {
            types = Object.values(AlertType);
        }

        types.forEach((t) => {
            if (excludeNextRouteAlerts) {
                const newAlerts = filterUnshowableAlerts(alertStore[t]);
                setAlert(t, newAlerts);
            } else {
                setAlert(t, []);
            }
        });
    };

    /**
     * Turn off `keepForNextRoute` of all alerts
     * in order to show them in next route.
     */
    const touchNextRouteAlerts = () => {
        map(AlertType, (t, _) => {
            const newAlerts = map(alertStore[t], (val) => ({
                ...val,
                keepForNextRoute: false,
            }));

            setAlert(t, newAlerts);
        });
    };

    return {
        addAlert,
        clearAlert,
        touchNextRouteAlerts,
        alertContainer,
        alertTitles,
        alertModels,
        AlertType,
    };
};

export default useAlert;
