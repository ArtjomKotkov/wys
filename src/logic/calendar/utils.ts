import {DayKey} from "@/logic/calendar/types";


export const dayIndexToCode = (dayIndex: number) : DayKey => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', ];
    return days[dayIndex] as DayKey;
}

export const dayIsWeekend = (dayIndex: number) : boolean => [0, 6].includes(dayIndex);

export const getDaysInMonth = (year: number, month: number) : number => new Date(year, month, 0).getDate();

export const addMonth = (current: Date, months: number) : Date => {
    const dateCopy = new Date(current.getTime());
    return new Date(dateCopy.setMonth(dateCopy.getMonth()+months));
}

export const addDay = (current: Date, days: number) : Date => {
    const dateCopy = new Date(current.getTime());
    return new Date(dateCopy.setDate(dateCopy.getDate()+days));
}

export const setFirstDay = (current: Date) : Date => {
    const dateCopy = new Date(current.getTime());
    return new Date(dateCopy.setDate(1));
}

export const setLastDay = (current: Date) : Date => {
    const dateCopy = new Date(current.getTime());
    return new Date(dateCopy.setDate(getDaysInMonth(dateCopy.getFullYear(), dateCopy.getMonth()+1)));
}

export const setYear = (current: Date, year: number) : Date => {
    const dateCopy = new Date(current.getTime());
    return new Date(dateCopy.setFullYear(year));
}

export const dateToString = (day: Date) : string => `${day.getDate()}.${day.getMonth()+1}.${day.getFullYear()}`;

export const dateRangeToStringRange = (from: Date, to: Date): string => `${dateToString(from)}-${dateToString(to)}`;

export const dateToReportDateString = (day: Date) : string => `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;

export const reportDateStringToDate = (day: string) : Date => {
    const [year, month, date] = day.split('-').map(item => Number(item));
    return new Date(year, month-1, date);
};

export const stringRangeToDateRange = (rangeString: string): Date[] => {
    const [dateStringFrom, dateStringTo] = rangeString.split('-');
    return [stringToDate(dateStringFrom), stringToDate(dateStringTo)];
};

export const stringToDate = (day: string): Date => {
    const [year, month, date] = day.split('.').reverse().map(item => Number(item));
    return new Date(year, month-1, date);
};

export const isEqualDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate()
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear();
};

export const calculatePreviousMonth = (date: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth();

    return new Date(month === 0 ? year -1 : year, month === 0 ? 11 : month -1 );
}

export const calculateNextMonth = (date: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth();

    return new Date(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
}
