export type MonthKey = 'jan' | 'feb' | 'march' | 'april'| 'may' | 'june' | 'july' | 'aug' | 'sept' | 'oct' | 'nov' | 'dec';
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Calendar {
    [key: number]: {
        [monthKey: number]: WeekInfo[]
    }
}

export type WeekInfo = DayInfo[]

export interface DayInfo {
    date: number;
    key: DayKey;
    index: number;
    isHoliday: boolean;
    isWeekend: boolean;
    fullDate: Date;
    isCurrent: boolean;
    week?: number;
    isAdditional?: boolean;
}

export interface devMonthInfo {
    from: number;
    to: number;
    index: number;
    year: number;
}