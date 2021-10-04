import {Calendar, DayInfo, devMonthInfo, WeekInfo} from "./types";
import {
    addMonth, calculateNextMonth, calculatePreviousMonth,
    dayIndexToCode,
    dayIsWeekend,
    getDaysInMonth,
    isEqualDay,
    setFirstDay,
    setLastDay
} from "@/logic/calendar/utils";

import _ from 'lodash';
import Holidays from 'date-holidays';


export class CalendarService {

    holidays = new Holidays('RU');

    makeFromDate(date: Date): Calendar {
        return this.makeCalendar(
            setFirstDay(calculatePreviousMonth(date)),
            setLastDay(calculateNextMonth(date)),
        );
    }

    private makeCalendar(from: Date, to: Date): Calendar {
        const months = this.getMonthsBetween(from, to);
        const groupedByYears: Record<number, devMonthInfo[]> = _.groupBy(months, 'year');

        const calendar: Calendar = {};

        for (const year of Object.keys(groupedByYears)) {
            calendar[year] = this.processYear(groupedByYears[year])
        }

        return calendar;
    }

    private processYear(months: devMonthInfo[]): Record<number, WeekInfo[]> {
         const year: Record<number, WeekInfo[]> = {};
         for (const month of months) {
             year[month.index] = this.processMonth(month);
         }
         return year;
    }

    private processMonth(month: devMonthInfo): WeekInfo[] {
        const days = this.getDaysInfo(month);
        const weeksMap = _.groupBy(days, 'week')
        return Object.values(weeksMap);
    }

    private getMonthsBetween(from: Date, to: Date): devMonthInfo[] {
        const months: devMonthInfo[] = [];
        let iterableDate = new Date(from.getFullYear(), from.getMonth())

        while(iterableDate <= to) {
            const fromMonth = from.getMonth();
            const fromYear = from.getFullYear();

            const toMonth = to.getMonth();
            const toYear = to.getFullYear();

            const iterableMonth = iterableDate.getMonth();
            const iterableYear = iterableDate.getFullYear();

            if (iterableMonth === fromMonth && iterableYear === fromYear) {
                months.push({
                    from: from.getDate(),
                    to: getDaysInMonth(from.getFullYear(), from.getMonth()+1),
                    index: from.getMonth(),
                    year: from.getFullYear(),
                });
            } else if (iterableMonth === toMonth && iterableYear === toYear) {
                months.push({
                    from: 1,
                    to: to.getDate(),
                    index: to.getMonth(),
                    year: to.getFullYear(),
                });
            } else {
                months.push({
                    from: 1,
                    to: getDaysInMonth(iterableYear, iterableMonth+1),
                    index: iterableMonth,
                    year: iterableYear,
                });
            }
            iterableDate = addMonth(iterableDate, 1);
        }

        return months;
    }

    private getDaysInfo(month: devMonthInfo): DayInfo[] {
        const days: DayInfo[] = [];
        let weekIndex = 0;
        const currentDate = new Date();

        for (let i = month.from; i <= month.to; i++) {
            const iterableDate = new Date(month.year, month.index, i);
            const dayIndex = iterableDate.getDay();

            if (dayIndex == 1) {
                weekIndex++;
            }

            days.push({
                date: i,
                key:  dayIndexToCode(dayIndex),
                index: dayIndex,
                isHoliday: Boolean(this.holidays.isHoliday(iterableDate)),
                isWeekend: dayIsWeekend(dayIndex),
                week: weekIndex,
                fullDate: iterableDate,
                isCurrent: isEqualDay(currentDate, iterableDate),
            })
        }

        return days;
    }

}