export const dayIndexToCode = (dayIndex) => {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days[dayIndex - 1];
};
export const dayIsWeekend = (dayIndex) => [6, 7].includes(dayIndex);
export const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
export const addMonth = (current, months) => new Date(current.setMonth(current.getMonth() + months));
//# sourceMappingURL=utils.js.map