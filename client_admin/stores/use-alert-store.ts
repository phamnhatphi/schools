import { Alert, SetAlert } from '@admin/models/alert';

const useAlertStore = defineStore('alert', () => {
    const info = ref<Alert[]>([]);
    const warning = ref<Alert[]>([]);
    const error = ref<Alert[]>([]);
    const success = ref<Alert[]>([]);

    const setInfo: SetAlert = (alerts: Alert[]) => {
        info.value = alerts;
    };

    const setWarning: SetAlert = (alerts: Alert[]) => {
        warning.value = alerts;
    };

    const setError: SetAlert = (alerts: Alert[]) => {
        error.value = alerts;
    };

    const setSuccess: SetAlert = (alerts: Alert[]) => {
        success.value = alerts;
    };

    return {
        info,
        warning,
        error,
        success,
        setInfo,
        setWarning,
        setError,
        setSuccess,
    };
});

export default useAlertStore;
