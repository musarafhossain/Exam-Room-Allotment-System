import dayjs from 'dayjs';

export const formatDate = (date?: number | string | null) => {
    if (!date) return '-';
    return dayjs(date).format('DD-MMM-YYYY, hh:mm A');
};