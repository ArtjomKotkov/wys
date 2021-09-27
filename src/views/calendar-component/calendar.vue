<template>
  <div class="calendar-wrapper">
    <div class="calendar">
      <div class="week" v-for="week in calendar" :key="week">
        <week-component :week="week"></week-component>
      </div>
    </div>

    <div class="week-key-input" v-if="showWeekKeyInput">
      <input-component v-model="value" type="password" label="Секретный ключ недели" style_="monolith"></input-component>
      <input-component v-model="value" type="text" label="Секретный ключ недели" style_="monolith"></input-component>
      <input-component v-model="value" type="text" label="Секретный ключ недели" style_="rounded"></input-component>

      <input type="color">
      <button>Применить</button>
    </div>

  </div>
</template>

<style>
  .calendar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .calendar {
    display: flex;
    flex-direction: row;

    font-weight: 400;
  }

</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {CalendarService} from "@/logic/calendar/calendar";
import {Calendar, WeekInfo} from "@/logic/calendar/types";
import WeekComponent from "@/views/calendar-component/week-component/week.vue";
import InputComponent from "@/shared/form/input.vue";
import {Watch} from "vue-property-decorator";


@Options({
  components: {
    WeekComponent,
    InputComponent,
  }
})
export default class CalendarComponent extends Vue {

    private calendarService = new CalendarService();

    value = 'test'

    get showWeekKeyInput(): boolean {
      return Boolean(this.$route.params.dateRange)
    }


    get calendar(): WeekInfo[] {
        let calendar = this.calendarService.make();
        const monthsInfo = this.extractMonths(calendar);
        return this.concatMonths(monthsInfo)
    }

    private concatMonths(date: WeekInfo[][]): WeekInfo[] {
      const previousMonthData = date[0];
      const currentMonthData = date[1];
      const nextMonthData = date[2];

      const currentMonthFirstWeekIndex = currentMonthData[0][0].index;

      if (currentMonthFirstWeekIndex !== 1) {
        currentMonthData[0] = previousMonthData[previousMonthData.length-1]
            .map(day => {
              day.isAdditional = true;
              return day;
            })
            .concat(currentMonthData[0]);
      }

      const currentMonthLastWeekIndex = currentMonthData[currentMonthData.length-1][currentMonthData[currentMonthData.length-1].length-1].index;

      if (currentMonthLastWeekIndex !== 0) {
        currentMonthData[currentMonthData.length-1] = currentMonthData[currentMonthData.length-1].concat(
            nextMonthData[0]
                .map(day => {
                  day.isAdditional = true;
                  return day;
                })
            )
      }

      return date[1];
    }

    private extractMonths(data: Calendar): WeekInfo[][] {
      const months: WeekInfo[][] = [];
      for (const yearValue of Object.values(data)) {
        for (const monthValue of Object.values(yearValue)) {
            months.push(monthValue as WeekInfo[]);
        }
      }
      return months;
    }
}
</script>
