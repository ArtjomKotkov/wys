<template>
  <div
      class="week-wrapper"
      :data-is-selected="selected"

      @click.self="selectWeek()"
  >
    <div class="header"></div>
    <day-component
        :day="day"
        v-for="day in week"
        :key="day"
    ></day-component>
  </div>
</template>

<style lang="scss">
  .week-wrapper {
    display: flex;
    flex-direction: column;
    margin: 0 5px;
    gap: 5px;

    background-color: var(--light-gray);
    border-radius: 15px;
    padding: 25px 5px 5px 5px;

    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    cursor: pointer;

    &:hover {

    }

    &[data-is-selected=true] {
      outline: 2px solid #785FF7;
    }

  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {WeekInfo} from "@/logic/calendar/types";
import DayComponent from "@/views/calendar-component/week-component/day-component/day.vue";
import {dayToString, hslToRgb, isEqualDay, stringToDate} from "@/logic/calendar/utils";
import {Prop} from "vue-property-decorator";


@Options({
  components: {
    DayComponent
  }
})
export default class WeekComponent extends Vue {

  @Prop(Object) week!: WeekInfo;

  selectWeek(): void {
    this.$router.push({path: `/week/${dayToString(this.week[0].fullDate)}-${dayToString(this.week[6].fullDate)}`})
  }

  get selected(): boolean {
    const dateData = this.$route.params.dateRange as string;
    if (!dateData) {
      return false;
    }
    const [dateString1, dateString2] = dateData.split('-');

    const date1 = stringToDate(dateString1);
    const date2 = stringToDate(dateString2);

    return isEqualDay(this.week[0].fullDate, date1) && isEqualDay(this.week[6].fullDate, date2);
  }

  getRandomColor(lightness: number): string {
    const rgb = hslToRgb(~~(1000 * Math.random())/1000, 1, lightness/100);

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }

}
</script>
