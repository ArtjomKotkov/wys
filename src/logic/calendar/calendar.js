import { dayIndexToCode, dayIsWeekend, getDaysInMonth } from "@/logic/calendar/utils";
class CalendarService {
    make(from, to) {
    }
    processMonths(from, to) {
    }
    getMonthsBetween(from, to) {
        const months = [];
        const iterableDate = new Date(from.getFullYear(), from.getMonth());
        while (iterableDate <= to) {
            const fromMonth = from.getMonth();
            const fromYear = from.getFullYear();
            const toMonth = to.getMonth();
            const toYear = to.getFullYear();
            const iterableMonth = iterableDate.getMonth();
            const iterableYear = iterableDate.getFullYear();
            if (iterableMonth === fromMonth && iterableYear === fromYear) {
                months.push({
                    from: from.getDate(),
                    to: getDaysInMonth(from.getFullYear(), from.getMonth()),
                    index: from.getMonth(),
                    year: from.getFullYear(),
                });
            }
            else if (iterableMonth === fromMonth && iterableYear === fromYear) {
                months.push({
                    from: 0,
                    to: to.getDate(),
                    index: to.getMonth(),
                    year: to.getFullYear(),
                });
            }
            else {
                months.push({
                    from: 0,
                    to: getDaysInMonth(iterableYear, iterableMonth),
                    index: iterableMonth,
                    year: iterableMonth,
                });
            }
        }
        if (from.getFullYear() === to.getFullYear()) {
            const fromMonth = from.getMonth();
            const toMonth = to.getMonth();
            for (let i = fromMonth; i++; i > toMonth) {
                if (i === fromMonth) {
                    months.push({
                        from: from.getDate(),
                        to: getDaysInMonth(from.getFullYear(), from.getMonth()),
                        index: i,
                        year: from.getFullYear(),
                    });
                }
                else if (i === fromMonth) {
                    months.push({
                        from: 0,
                        to: to.getDate(),
                        index: i,
                        year: from.getFullYear(),
                    });
                }
                else {
                    months.push();
                }
            }
        }
    }
    getDayInfo(date) {
        const dayIndex = date.getDay();
        return {
            date: date.getDate(),
            key: dayIndexToCode(dayIndex),
            index: dayIndex,
            isHoliday: false,
            isWeekend: dayIsWeekend(dayIndex),
        };
    }
}
//# sourceMappingURL=calendar.js.map