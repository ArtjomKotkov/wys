<template>
  <div
      class="week-wrapper"
      :data-is-selected="selected"

      @click.self="selectWeek"

      :style="{
        '--dynamic-color': weekWrapperColor
      }"
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

    background-color: var(--dynamic-color);
    border-radius: 15px;
    padding: 25px 5px 5px 5px;

    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    cursor: pointer;

    &[data-is-selected=true] {
      outline: 2px solid #785FF7;
    }

  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {WeekInfo} from "@/logic/calendar/types";
import DayComponent from "@/views/calendar-component/week-component/day-component/day.vue";
import {dayToString} from "@/logic/calendar/utils";
import {Prop, Inject, InjectReactive, Emit} from "vue-property-decorator";
import {Entity} from "@/logic/services/types";
import {EntitySelectorService} from "@/logic";
import {hslConfig, hslConfigToBackgroundOption} from "@/shared";


@Options({
  components: {
    DayComponent
  }
})
export default class WeekComponent extends Vue {
  @Prop(Object) week!: WeekInfo;
  @Prop(Number) index!: number;

  private entity: Entity = {type: 'week', id: this.getId(), index: this.index};

  @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;
  @InjectReactive('color') readonly color!: hslConfig;

  @Emit('Selected')
  selectWeek(): void {
    this.entitySelectorService.select(this.entity);
    this.$router.push({path: `/week/${dayToString(this.week[0].fullDate)}-${dayToString(this.week[6].fullDate)}`})
  }

  get selected(): boolean {
    return this.entitySelectorService.isSelected(this.entity);
  }

  getId(): string {
    return `${dayToString(this.week[0].fullDate)}-${dayToString(this.week[6].fullDate)}`;
  }

  get weekWrapperColor(): string {
    return this.selected ? hslConfigToBackgroundOption(this.color) : 'var(--light-gray)';
  }
}
</script>
