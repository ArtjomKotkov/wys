<template>
  <div class="root-wrapper">
    <div class="color-picker" :style="{
        'background-color': `${makeHslByHueAndLightness(form.controls.hue.value, form.controls.lightness.value)}`
      }"
      @click="showed = !showed">
    </div>
    <div class="hsl-picker" v-if="showed">
      <slider-component
          class="hue-picker"

          :background-style="hueGradientStyle"
          :min="0"
          :max="360"
          :thumpStyleGetter="makeHslByHue"

          v-model="form.controls.hue.value"
      ></slider-component>
      <slider-component
          class="light-picker"

          :background-style="lightnessColorGradientStyle"
          :min="0"
          :max="100"
          :thumpStyleGetter="makeHslByLightness"

          v-model="form.controls.lightness.value"
      ></slider-component>
    </div>

  </div>
</template>

<style lang="scss">
  .root-wrapper {
    position: relative;

    & .color-picker {
      height: 60px;
      width: 60px;
      border-radius: 15px;
      cursor: pointer;
    }

    & .hsl-picker {
      position: absolute;
      left: -190px;
      top: -125px;
      background-color: var(--dark-gray);
      border-radius: 15px;
      outline: 2px solid #785FF7;
    }
  }


</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import ColorSliderComponent from "@/shared/form/shared/slider.vue";
import {Form, InputControl} from "@/shared";


@Options({
  components: {SliderComponent: ColorSliderComponent}
})
export default class HslColorPickerComponent extends Vue {
  @Prop() modelValue!: number[];

  form = new Form({
    hue: new InputControl<number>(180),
    lightness: new InputControl<number>(50),
  })

  beforeCreate(): void {
    this.form.controls.hue.reset(this.modelValue[0]);
    this.form.controls.lightness.reset(this.modelValue[1]);
  }

  showed = false;

  @Watch('modelValue')
  updateHueAndLightness(): void {
    this.form.controls.hue.reset(this.modelValue[0]);
    this.form.controls.lightness.reset(this.modelValue[1]);
  }

  @Watch('form.value', { immediate: true, deep: true })
  updateModelValue(): void {
    if (this.form.controls.hue.value === this.modelValue[0] && this.form.controls.lightness.value === this.modelValue[1]) {
      return;
    }
    this.$emit('update:modelValue', [Number(this.form.controls.hue.value), Number(this.form.controls.lightness.value)])
  }

  get hueGradientStyle(): string {
    const hslGradients = [];
    for (let i = 0; i <= 360; i += 20) {
      hslGradients.push(`hsla(${i}, 100%, ${this.form.controls.lightness.value}%, 1)`)
    }
    return `-webkit-linear-gradient(left, ${hslGradients.join(',')})`
  }

  get lightnessColorGradientStyle(): string {
    const hslGradients = [];
    for (let i = 0; i <= 100; i += 10) {
      hslGradients.push(`hsla(${this.form.controls.hue.value}, 100%, ${i}%, 1)`)
    }
    return `-webkit-linear-gradient(left, ${hslGradients.join(',')})`
  }

  makeHslByHue(hue: number): string {
    return `hsla(${hue}, 100%, ${this.form.controls.lightness.value}%, 1)`
  }

  makeHslByLightness(lightness: number): string {
    return `hsla(${this.form.controls.hue.value}, 100%, ${lightness}%, 1)`
  }

  makeHslByHueAndLightness(hue: number, lightness: number): string {
    return `hsla(${hue}, 100%, ${lightness}%, 1)`
  }

}
</script>