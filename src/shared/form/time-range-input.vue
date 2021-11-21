<template>
  <div class="range-input-root-wrapper" v-click-outside="hide">
    <div class="range-input-main-body">
      <div class="input-block" @click="$refs.hour.focus()">
        <input ref="hour" type="number" v-model="form.controls.hour.value"><span>ч</span>
      </div>
      <div class="input-block" @click="$refs.minute.focus()">
        <input ref="minute" type="number" v-model="form.controls.minute.value"><span>м</span>
      </div>
      <div class="selector-icon" @click="opened = !opened">
        <div class="selector-shape" :data-opened="opened"></div>
      </div>
    </div>
    <div class="under-line"></div>
    <div class="options-selector" v-if="opened">
      <div
          class="option"
          v-for="item in items"
          :key="item.key"
          @click="select(item)"
      >
        <span>{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .range-input-root-wrapper {
    position: relative;
    background-color: var(--medium-gray);
    height: 45px;
    max-width: 145px;

    font-size: 13px;
  }

  .range-input-main-body {
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;

    .input-block {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      flex-grow: 1;

      input {
        border: none;
        outline: none;
        background-color: transparent;
        text-align: right;
        padding-right: 5px;
        width: 100%;
      }
    }
  }

  .selector-icon {
    min-width: 45px;
    width: 45px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    & .selector-shape {
      width: 10px;
      height: 10px;
      border-radius: 10px;

      background-color: transparent;
      outline: 2px solid var(--main-color);

      &[data-opened=true] {
        background-color: var(--main-color);
        outline: none;
      }

    }
  }

  .under-line {
    position: absolute;
    bottom: 0;

    height: 1px;
    width: calc(100% - 40px);
    margin: 0 20px;
    background-color: var(--main-color);
  }

  .options-selector {
    position: absolute;
    top: 45px;
    width: 100%;
    background-color: var(--medium-gray);

    z-index: 9999;

    .option {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      cursor: pointer;

      color: white;
      line-height: 45px;

      &:hover {
        background-color: var(--light-gray);
      }

      & .color-icon {
        min-width: 15px;
        margin-left: 40px;

        .color-shape {
          width: 15px;
          height: 15px;

          border-radius: 7.5px;
        }
      }

      span {
        text-align: center;
        flex-grow: 1;
      }
    }
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Inject, Prop, Watch} from 'vue-property-decorator';
import {clickOutside, Form, InputControl, inRange, required, SelectItem} from "@/shared";
import {MainConfigService} from "@/logic/services/main-config/main-config-service";
import {TimeRange} from "@/logic/services/main-config";
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
  @Prop() modelValue!: TimeRange;

  @Prop(String) label = '';
  @Prop(String) placeholder?: string;
  @Prop(Boolean) isValid = true;
  @Prop(String) align: 'center' | 'left' | 'right' = 'left';

  @Inject('mainConfigService') readonly mainConfigService!: MainConfigService;

  form = new Form({
    hour: new InputControl<number>(0, [required]),
    minute: new InputControl<number>(0, [required]),
  });

  items?: SelectItem[];

  opened = false;

  beforeCreate(): void {
    this.form.reset(this.modelValue);
  }

  mounted(): void {
    this.items = this.mainConfigService.get().timeRange.map((timeRange, index) => ({
      title: `${timeRange.hour}ч ${timeRange.minute}м`,
      key: String(index),
      payload: timeRange,
    }));
  }

  @Watch('modelValue', {deep: true})
  onModelValueChanged(): void {
    if (this.form.values.hour === this.modelValue.hour && this.form.values.minute === this.modelValue.minute) {
      return;
    }
    this.form.reset({
      hour: this.modelValue.hour,
      minute: this.modelValue.minute,
    });
  }

  @Watch('form', {deep: true})
  onFormValueChanged(): void {
    this.tryFixFormValue();
    this.$emit('update:modelValue', {
      hour: this.form.controls.hour.value,
      minute: this.form.controls.minute.value,
    });
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
    if (this.opened) {
      this.opened = false;
    }
  }

  selectDefaultRange(dateRange: TimeRange): void {
    this.form.reset(dateRange);
    this.hide();
  }



  select(item: SelectItem): void {
    this.form.reset({
      hour: item.payload.hour,
      minute: item.payload.minute,
    });
    this.hide();
  }
}
</script>
