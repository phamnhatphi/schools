import { format } from 'date-fns';

const USUAL_FORMATS: Record<string, string> = {
    iso: "yyyy-MM-dd'T'HH:mm:ss.SSSXX",
    datetime: 'yyyy-MM-dd HH:mm',
    date: 'yyyy-MM-dd',
};

/**
 * Format datetime
 * @param datetime a datetime string or Date object
 * @param display_format the string present the format or one of the keyword of usual formats
 * @param default_display the return value if formatting fail
 * @returns
 */
const formatDatetime = (
    datetime: string | Date,
    display_format = 'datetime',
    default_display = '',
) => {
    try {
        let my_format = USUAL_FORMATS[display_format.toLowerCase()];
        if (!my_format) {
            my_format = display_format;
        }

        const myDatetime = (typeof datetime === 'string') ? new Date(datetime) : datetime;
        return format(myDatetime, my_format);
    } catch {
        return default_display;
    }
};

export default formatDatetime;
