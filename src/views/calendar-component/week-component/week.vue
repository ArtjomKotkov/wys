<template>
  <div
      class="week-wrapper"
      :data-is-selected="selected"

      @click.self="selectWeek"

      :style="{
        '--dynamic-color': backgroundColor
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
import {dateToString} from "@/logic/calendar/utils";
import {Prop, Inject, InjectReactive, Emit, Watch} from "vue-property-decorator";
import {WeekEntity} from "@/logic/services/entity-selector/types";
import {EntitySelectorService, WeekConfig, WeekService} from "@/logic";
import {hslConfig, hslConfigToBackgroundOption} from "@/shared";


@Options({
  components: {
    DayComponent
  }
})
export default class WeekComponent extends Vue {
  @Prop(Object) week!: WeekInfo;
  @Prop(Number) index!: number;

  private entity: WeekEntity = {type: 'week', id: this.getId(), index: this.index, from: this.week[0].fullDate, to: this.week[6].fullDate};

  @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;
  @Inject('weekConfigService') readonly weekConfigService!: WeekService;

  @InjectReactive('color') readonly color!: hslConfig;

  config?: WeekConfig;
  defaultColor!: string;

  created(): void {
    this.config = this.weekConfigService.get(this.entity.from, this.entity.to);
    this.defaultColor = this.config ? hslConfigToBackgroundOption(this.config.color) : 'var(--light-gray)';

    this.$router.isReady().then(_ => this.routeUpdate());
  }

  @Watch('$route')
  routeUpdate(): void {
    if (this.$route.params.dateRange == this.getId() ?? !this.entitySelectorService.isSelected(this.entity)) {
      this.selectWeek();
    }
  }

  @Emit('onSelected')
  selectWeek(): void {
    this.entitySelectorService.select(this.entity)
    this.$router.push({path: `/week/${dateToString(this.week[0].fullDate)}-${dateToString(this.week[6].fullDate)}`, query: {direction: this.index === 0 ? 'right' : 'left'}})
  }

  get selected(): boolean {
    return this.entitySelectorService.isSelected(this.entity);
  }

  getId(): string {
    return `${dateToString(this.week[0].fullDate)}-${dateToString(this.week[6].fullDate)}`;
  }

  get backgroundColor(): string {
    return this.selected ? hslConfigToBackgroundOption(this.color) : this.defaultColor;
  }

}
</script>
