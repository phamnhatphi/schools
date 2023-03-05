export enum AlertType {
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Success = 'success',
}

export enum AlertVariant {
    Text = 'text',
    TwoColumns = 'two-columns',
}

export type Alert = {
    type: AlertType;
    /**
     * If true, this message will be shown on next route instead of current route (screen)
     */
    keepForNextRoute?: boolean;
} & ({
    variant?: AlertVariant.Text;
    message: string;
} | {
    variant: AlertVariant.TwoColumns;
    message: {left: string; right: string};
});

export type SetAlert = (alerts: Alert[]) => void;
