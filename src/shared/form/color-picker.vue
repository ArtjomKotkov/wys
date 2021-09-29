<template>
  <div class="root-wrapper">
    <div class="color-picker" :style="{'background-color': `${makeHslByHueAndLightness(hue, lightness)}`}" @click="showed = !showed">
    </div>
    <div class="hsl-picker" v-if="showed">
      <slider-component
          class="hue-picker"

          :background-style="hueGradientStyle"
          :min="0"
          :max="360"
          :thumpStyleGetter="makeHslByHue"

          v-model="hue"
      ></slider-component>
      <slider-component
          class="light-picker"

          :background-style="lightnessColorGradientStyle"
          :min="0"
          :max="100"
          :thumpStyleGetter="makeHslByLightness"

          v-model="lightness"
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


@Options({
  components: {SliderComponent: ColorSliderComponent}
})
export default class HslColorPickerComponent extends Vue {
  @Prop() modelValue: number[] = [180, 50];

  hue = 180;
  lightness = 50;

  showed = false;

  @Watch('modelValue')
  updateHueAndLightness(): void {
    [this.hue, this.lightness] = this.modelValue;
  }

  @Watch('hue')
  @Watch('lightness')
  updateModelValue(): void {
    this.$emit('update:modelValue', [Number(this.hue), Number(this.lightness)])
  }

  get hueGradientStyle(): string {
    const hslGradients = [];
    for (let i = 0; i <= 360; i += 20) {
      hslGradients.push(`hsla(${i}, 100%, ${this.lightness}%, 1)`)
    }
    return `-webkit-linear-gradient(left, ${hslGradients.join(',')})`
  }

  get lightnessColorGradientStyle(): string {
    const hslGradients = [];
    for (let i = 0; i <= 100; i += 10) {
      hslGradients.push(`hsla(${this.hue}, 100%, ${i}%, 1)`)
    }
    return `-webkit-linear-gradient(left, ${hslGradients.join(',')})`
  }

  makeHslByHue(hue: number): string {
    return `hsla(${hue}, 100%, ${this.lightness}%, 1)`
  }

  makeHslByLightness(lightness: number): string {
    return `hsla(${this.hue}, 100%, ${lightness}%, 1)`
  }

  makeHslByHueAndLightness(hue: number, lightness: number): string {
    return `hsla(${hue}, 100%, ${lightness}%, 1)`
  }

}
</script>