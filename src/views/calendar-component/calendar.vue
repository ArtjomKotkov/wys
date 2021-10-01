<template>
  <div class="calendar-wrapper" @click.self="entitySelectorService.resetSelection()">
    <year-month-selector v-model="selectedMonth"></year-month-selector>
    <div class="calendar">
      <week-component
          v-for="(week, index) in calendar"
          :key="getKeyByWeek(week)"

          :week="week"
          :index="index"

          @Selected="resetConfigInputs"
      ></week-component>
    </div>
    <div class="week-key-input" v-if="showWeekKeyInput">
      <input-component
          class="secret-key-input"
          v-model="value"
          type="password"
          label="Секретный ключ недели"
          style_="rounded"
          :placeholder="'Введите ключ'"
      ></input-component>
      <color-picker-component v-model="color" :lightness="70"></color-picker-component>
    </div>

  </div>
</template>

<style lang="scss">
  .calendar-wrapper {
    display: inline-block;
    width: 660px;
  }

  .calendar {
    margin-top: 20px;

    display: flex;
    flex-direction: row;
    justify-content: center;

    font-weight: 400;
    min-width: 560px;
  }

  .week-key-input {
    width: 85%;
    margin-left: 7.5%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & .secret-key-input {
      margin-right: 15px;
      flex-grow: 1;
    }

  }

</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {CalendarService} from "@/logic/calendar/calendar";
import {Calendar, WeekInfo} from "@/logic/calendar/types";
import WeekComponent from "@/views/calendar-component/week-component/week.vue";
import InputComponent from "@/shared/form/input.vue";
import {Provide, ProvideReactive} from "vue-property-decorator";
import HslColorPickerComponent from "@/shared/form/color-picker.vue";
import {EntitySelectorService} from "@/logic";
import {hslConfig} from "@/shared/form";
import YearMonthSelector from "./year-month-selector-component/year-month-selector.vue";


@Options({
  components: {
    WeekComponent,
    InputComponent,
    YearMonthSelector,
    ColorPickerComponent: HslColorPickerComponent,
  }
})
export default class CalendarComponent extends Vue {
    private calendarService = new CalendarService();

    defaultColorValue: hslConfig = [180, 80];
    value = '';
    selectedMonth: Date = new Date();

    @Provide('entitySelectorService') entitySelectorService = new EntitySelectorService();
    @ProvideReactive('color') color: hslConfig = this.defaultColorValue;

    get showWeekKeyInput(): boolean {
      return Boolean(this.$route.params.dateRange)
    }

    get calendar(): WeekInfo[] {
        let calendar = this.calendarService.makeFromDate(this.selectedMonth);
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

    private resetConfigInputs(): void {
      this.color = this.defaultColorValue;
    }

    getKeyByWeek(week: WeekInfo): string {
      return JSON.stringify(week)
    }
}
</script>
