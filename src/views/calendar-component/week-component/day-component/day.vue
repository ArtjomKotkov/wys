<template>
  <div
      class="day-wrapper"
      :data-is-additional="day.isAdditional ? true : false"
      :data-is-holiday="day.isHoliday"
      :data-is-weekend="day.isWeekend"
      :data-is-selected="selected"
      @click="selectDay()"
  >
    {{day.date}}

    <div class="status-marker" :style="{'background-color': markerColor}"></div>
  </div>
</template>

<style lang="scss">
  .day-wrapper {
    position: relative;

    height: 90px;
    width: 90px;

    background-color: var(--dark-gray);

    border-radius: 10px;

    color: white;
    font-size: 36px;
    line-height: 90px;
    text-align: center;

    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    cursor: pointer;

    &[data-is-additional=false]:hover {
      background-color: #403D3D !important;
      border: 1px solid #785FF7;
    }

    &[data-is-weekend=true] {
      background-color: #1C1C1C;
    }

    &[data-is-holiday=true] {
      background-color: #1CC779;
    }

    &[data-is-additional=true] {
      background-color: rgba(0,0,0,0) !important;
      color: var(--dark-gray) !important;
    }

    &[data-is-selected=true] {
      border: 2px solid #785FF7 !important;
    }
  }

  .status-marker {
    position: absolute;

    margin: 0;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    right: 6px;
    bottom: 6px;
  }

</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Inject, Prop} from "vue-property-decorator";
import {DayInfo} from "@/logic/calendar/types";
import {dayToString, isEqualDay, stringToDate} from "@/logic/calendar/utils";
import {EntitySelectorService} from "@/logic";
import {Entity} from "@/logic/services/entity-selector/types";


@Options({})
export default class DayComponent extends Vue {
  @Prop(Object) day!: DayInfo;

  private entity: Entity = {type: 'date', id: this.getId()};

  @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;


  selectDay(): void {
    if (this.day.isAdditional) {
      return;
    }
    this.entitySelectorService.select(this.entity);
    this.$router.push({path:`/day/${dayToString(this.day.fullDate)}`})
  }

  get selected(): boolean {
    return this.entitySelectorService.isSelected(this.entity);
  }

  getId(): string {
    return `${dayToString(this.day.fullDate)}`;
  }

  get markerColor(): string {
    if (this.day.isCurrent) {
      return '#785FF7';
    } else {
      return 'transparent';
    }
  }

}
</script>
