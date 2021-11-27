<template>
  <div class="calendar-wrapper" @click.self="resetSelection">
    <div class="menu-icon">
      <router-link :to="{ name: 'settings'}">
        <icon-component
            name="menu"
        ></icon-component>
      </router-link>
    </div>
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
    <div v-if="errors.length">
      <div class="calendar-error">
        <span v-for="error in errors" :key="error">{{error}}</span>
      </div>
    </div>
    <div class="week-key-input">
      <input-component
          v-if="showWeekKeyInput"

          class="secret-key-input"
          v-model="form.controls.secretKey.value"
          type="password"
          label="Секретный ключ недели"
          style_="rounded"
          :placeholder="'Введите ключ'"

          :is-valid="form.controls.secretKey.isValid"
      ></input-component>
      <input v-if="showWeekKeyInput" type="color" v-model="form.controls.color.value">
    </div>
    <div class="week-actions" v-if="form.dirty">
      <button class="cancel-button" @click="resetConfigInputs">Отменить</button>
      <button class="save-button" @click="saveSelectedWeek">Сохранить</button>
    </div>

  </div>
</template>

<style lang="scss">

  .jira-sync-icon {
    min-width: 45px;
  }

  @media (max-width: 1610px) {
    .calendar-wrapper {
      width: 100%;
    }
  }

  .calendar-error {
    span {
      color: var(--invalid-red);
    }
  }

  .calendar-wrapper {
    min-height: 100vh;
    position: relative;

    z-index: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 0 40px;

    height: 100%;

    -webkit-box-shadow: 10px 0px 90px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 10px 0px 90px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 10px 0px 90px 0px rgba(0, 0, 0, 0.3);

    gap: 20px;
  }

  .menu-icon {
    position: absolute;
    right: 20px;
    top: 20px;
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
    min-height: 60px;

    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    & .secret-key-input {
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

  input[type='color'] {
    -webkit-appearance: none;
    background-color: transparent;
    cursor: pointer;

    height: 60px;
    width: 60px;
    border-radius: 15px;

    outline: none;
    border: none;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    background-color: transparent;
    padding: 0;
    border: none;
    outline: none;
  }
  input[type="color"]::-webkit-color-swatch {

    border: none;
    outline: none;
    border-radius: 15px;
    background-color: transparent;
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
import {
  EntitySelectorService,
  isEqualDay,
  reportDateStringToDate,
  ReportService,
  stringToDate,
  WeekService
} from "@/logic";
import {Form, hslConfig, InputControl, required} from "@/shared/form";
import YearMonthSelector from "./year-month-selector-component/year-month-selector.vue";
import {WeekEntity} from "@/logic/services/entity-selector/types";
import IconComponent from "@/shared/icons/icon.vue";


@Options({
  components: {
    WeekComponent,
    InputComponent,
    YearMonthSelector,
    ColorPickerComponent: HslColorPickerComponent,
    IconComponent,
  }
})
export default class CalendarComponent extends Vue {
    private calendarService = new CalendarService();

    defaultColor = '#785FF7';

    selectedDate: Date = new Date();

    form = new Form({
      secretKey: new InputControl<string>('', [required]),
      color: new InputControl<string>(this.defaultColor),
    });

    errors: string[] = [];

    @ProvideReactive('color') color = this.defaultColor;

    @Inject('weekConfigService') readonly weekConfigService!: WeekService;
    @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;
    @Inject('reportService') readonly reportService!: ReportService;

    @Watch('form', { immediate: true, deep: true })
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
      this.errors = [];
    }

    async saveSelectedWeek(): Promise<void> {
      const entity = this.entitySelectorService.getCurrent() as WeekEntity;

      if (!this.form.isValid) {
        return;
      }

      if (! (await this.isTokenCorespondedToWeek(this.form.controls.secretKey.value, entity))) {
        this.errors = [
            'Токен не соответствует выбранной неделе!'
        ];
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

    async isTokenCorespondedToWeek(token: string, week: WeekEntity): Promise<boolean> {
      const weekData = await this.reportService.getWeekDataByToken(token);

      if (weekData && 'error' in weekData || !weekData) {
        return false;
      }

      const from = reportDateStringToDate(weekData.dates[0]);
      const to = reportDateStringToDate(weekData.dates[weekData.dates.length-1]);

      return isEqualDay(week.from, from) && isEqualDay(week.to, to);
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
        color: config ? config.color : this.defaultColor,
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
