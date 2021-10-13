<template>
  <div class="range-input-root-wrapper" v-click-outside="hide">
    <div class="time-range-selector" @click="showed = !showed">
      {{form.controls.hour.value}}ч {{form.controls.minute.value}}м
      <div class="toggle-showing" :data-showed="showed" :data-invalid="!form.isValid"></div>
    </div>
    <div class="time-range-popup" v-if="showed">
      <div class="time-range-input">
        <input-component
            class="number-input"

            v-model="form.controls.hour.value"
            type="number"
            style_="monolith"
            placeholder="часы"

            :min="0"
            :max="24"

            :align="'center'"

            :is-valid="form.controls.hour.isValid"
        ></input-component>
        <input-component
            class="number-input"

            v-model="form.controls.minute.value"
            type="number"
            style_="monolith"
            placeholder="минуты"

            :min="0"
            :max="60"

            :align="'center'"

            :is-valid="form.controls.minute.isValid"
        ></input-component>
      </div>
      <div class="default-time-ranges" v-if="defaultDateRanges">
        <div
          class="time-range"
          v-for="(dateRange, index) in defaultDateRanges"
          :key="index"
          @click="selectDefaultRange(dateRange)"
        >
          <span v-if="dateRange.hour !== '0'">{{dateRange.hour}}ч </span>
          <span v-if="dateRange.minute !== '0'">{{dateRange.minute}}м</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.range-input-root-wrapper {
  position: relative;

  & .time-range-selector {
    position: relative;
    
    width: 140px;
    height: 45px;

    cursor: pointer;
    text-align: center;
    line-height: 45px;

    color: white;

    background-color: var(--medium-gray);

    & .toggle-showing {
      margin: 0;
      position: absolute;
      right: 17.5px;
      top: 17.5px;

      height: 10px;
      width: 10px;

      background-color: transparent;
      outline: 2px solid var(--main-color);

      &[data-showed=false] {
        outline: none;
        background-color: var(--main-color);
      }

      &[data-invalid=true] {
        background-color: var(--invalid-red);
        outline: 2px solid var(--invalid-red);
      }
    }
  }

  & .time-range-popup {
    z-index: 999;
    position: absolute;
    top: -130px;
    left: -130px;
    background-color: var(--dark-gray);
    border-radius: 15px;
    outline: 2px solid #785FF7;

    min-width: 300px;
    height: 120px;

    display: flex;
    flex-direction: row;
    gap: 30px;

    padding: 0 30px;

    & .time-range-input {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      gap: 10px;

      input {
        width: 60px !important;
      }

    }

    & .default-time-ranges {
      flex-grow: 1;

      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: center;
      align-items: center;


      gap: 10px;

      & .time-range {
        font-size: 16px;
        line-height: 45px;

        text-align: center;

        width: 70px;
        height: 40px;

        background-color: #1C1C1C;
        border-radius: 15px;

        color: white;

        cursor: pointer;

        &:hover {
          color: var(--dark-gray);
          background-color: var(--main-color);
        }
      }

    }
  }
}
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Inject, Prop, Watch} from 'vue-property-decorator';
import {clickOutside, Form, InputControl, inRange, required} from "@/shared";
import {MainConfigService} from "@/logic/services/main-config/main-config-service";
import {timeRange} from "@/logic/services/main-config";
import InputComponent from "@/shared/form/input.vue";


@Options({
  components: {
    InputComponent,
  },
  directives: {
    clickOutside,
  }
})
export default class TimeRangeInput extends Vue {
  @Prop(String) modelValue!: timeRange;

  @Prop(String) label = '';
  @Prop(String) placeholder?: string;
  @Prop(Boolean) isValid = true;
  @Prop(String) align: 'center' | 'left' | 'right' = 'left';

  @Inject('mainConfigService') readonly mainConfigService!: MainConfigService;

  form = new Form({
    hour: new InputControl<number>(0, [required]),
    minute: new InputControl<number>(0, [required]),
  });

  defaultDateRanges?: timeRange[];

  showed = false;

  beforeCreate(): void {
    this.form.reset(this.modelValue);
  }

  mounted(): void {
    this.defaultDateRanges = this.mainConfigService.get().timeRange;
  }

  @Watch('form', {deep: true})
  onFormValueChanged(): void {
    this.tryFixFormValue()
  }

  tryFixFormValue(): void {
    if (this.form.controls.hour.value < 0) {
      this.form.controls.hour.value = 0;
      this.form.controls.hour.forceValidity();
    }
    if (this.form.controls.hour.value > 23) {
      this.form.controls.hour.value = 23;
      this.form.controls.hour.forceValidity();
    }

    if (this.form.controls.minute.value < 0) {
      this.form.controls.minute.value = 0;
      this.form.controls.minute.forceValidity();
    }
    if (this.form.controls.minute.value > 59) {
      this.form.controls.minute.value = 59;
      this.form.controls.minute.forceValidity();
    }
  }

  private hide(): void {
    if (this.showed) {
      this.showed = false;
    }
  }

  selectDefaultRange(dateRange: timeRange): void {
    this.form.reset(dateRange);
    this.hide();
  }
}
</script>
