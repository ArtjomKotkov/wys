<template>
  <div class="calendar-wrapper" @click.self="resetSelection">
    <year-month-selector v-model="selectedDate"></year-month-selector>
    <div class="calendar">
      <week-component
          v-for="(week, index) in calendar"
          :key="getKeyByWeek(week)"

          :week="week"
          :index="index"

          @onSelected="resetConfigInputs($event)"
      ></week-component>
    </div>
    <div class="week-key-input" v-if="showWeekKeyInput">
      <input-component
          class="secret-key-input"
          v-model="form.controls.secretKey.value"
          type="password"
          label="Секретный ключ недели"
          style_="rounded"
          :placeholder="'Введите ключ'"

          :is-valid="form.controls.secretKey.isValid"
      ></input-component>
      <color-picker-component v-model="form.controls.color.value" :lightness="70"></color-picker-component>
    </div>
    <div class="week-actions" v-if="form.dirty">
      <button class="cancel-button" @click="resetConfigInputs">Отменить</button>
      <button class="save-button" @click="saveSelectedWeek">Сохранить</button>
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

  .week-actions {
    width: 85%;
    margin-left: 7.5%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    button {
      width: 100%;
      margin: 5px;
      height: 30px;
      outline: none;
      border: none;

      cursor: pointer;
      border-radius: 15px;

      &.cancel-button {
        background-color: var(--light-gray);
        color: var(--dark-gray);
      }

      &.save-button {
        background-color: var(--main-color);
        color: var(--dark-gray);
      }
    }
  }

</style>

<script lang="ts">
import WeekComponent from "@/views/calendar-component/week-component/week.vue";
import InputComponent from "@/shared/form/input.vue";
import HslColorPickerComponent from "@/shared/form/color-picker.vue";

import {Options, Vue} from 'vue-class-component';
import {CalendarService} from "@/logic/calendar/calendar";
import {Calendar, WeekInfo} from "@/logic/calendar/types";
import {Inject, Provide, ProvideReactive, Watch} from "vue-property-decorator";
import {EntitySelectorService, stringToDate, WeekService} from "@/logic";
import {Form, hslConfig, InputControl, required} from "@/shared/form";
import YearMonthSelector from "./year-month-selector-component/year-month-selector.vue";
import {WeekEntity} from "@/logic/services/entity-selector/types";


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

    defaultColorValue: hslConfig = [256, 65];
    selectedDate: Date = new Date();

    form = new Form({
      secretKey: new InputControl<string>('', [required]),
      color: new InputControl<hslConfig>([256, 65]),
    });

    @Provide('entitySelectorService') entitySelectorService = new EntitySelectorService();
    @ProvideReactive('color') color: hslConfig = this.defaultColorValue;

    @Inject('weekConfigService') readonly weekConfigService!: WeekService;


    @Watch('form.value', { immediate: true, deep: true })
    formChanged(): void {
      this.color = this.form.controls.color.value;
    }

    @Watch('$route')
    changeCalendar(): void {
      /*
       * Следим за выбранной неделей / днем в календаре и выставляем нужное по необходимости.
       */
      const dateRange = this.$route.params.dateRange;

      if (dateRange) {
        const [from, to] = String(dateRange).split('-').map(value => stringToDate(value));
        const direction = this.$route.query.direction;
        this.selectedDate = direction === 'left' ? from : to;
      }

      const date = this.$route.params.date;

      if (date) {
        this.selectedDate = stringToDate(String(date));
      }
    }

    saveSelectedWeek(): void {
      const entity = this.entitySelectorService.getCurrent() as WeekEntity;

      if (!this.form.isValid) {
        return;
      }

      this.weekConfigService.set({
        color: this.form.controls.color.value,
        secretKey: this.form.controls.secretKey.value,
        from: entity.from,
        to: entity.to,
      });
      this.resetConfigInputs();
    }

    get showWeekKeyInput(): boolean {
      return Boolean(this.$route.params.dateRange)
    }

    get calendar(): WeekInfo[] {
        let calendar = this.calendarService.makeFromDate(this.selectedDate);
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
      const entity = this.entitySelectorService.getCurrent() as WeekEntity;
      const config = this.weekConfigService.get(entity.from, entity.to);

      this.form.reset({
        color: config ? config.color : this.defaultColorValue,
        secretKey: config ? config.secretKey : '',
      });
    }

    getKeyByWeek(week: WeekInfo): string {
      return JSON.stringify(week)
    }

    resetSelection(): void {
        this.entitySelectorService.resetSelection();
        this.$router.push({path: '/'});
    }
}
</script>
