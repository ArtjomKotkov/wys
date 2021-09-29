<template>
  <div class="slider-wrapper">
      <input
          type="range"
          :min="min"
          :max="max"

          :style="{
            '--input-background': backgroundStyle,
            '--thumb-background': thumbStyleValue,
          }"

          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
      >
  </div>
</template>

<style lang="scss">

  .slider-wrapper {
    height: 20px;
    width: 400px;
    padding: 20px;
  }

  input[type=range] {
    -webkit-appearance: none;
    width: 400px;
    border-radius: 10px;
  }

  input[type=range]::-webkit-slider-runnable-track {
    background: var(--input-background);
    height: 20px;
    border: none;
    border-radius: 10px;
  }

  @mixin common-thumb-styles {
    -webkit-appearance: none;
    background: var(--thumb-background);
    height: 36px;
    width: 16px;
    margin-top: -8px;
    border-radius: 5px;
    border: 1px solid var(--light-gray);
  }

  input[type=range]::-webkit-slider-thumb {
    @include common-thumb-styles;
  }

  input[type=range]::-moz-range-thumb {
    @include common-thumb-styles;
  }


</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import Input from "@/shared/form/input.vue";


@Options({
  components: {Input}
})
export default class ColorSliderComponent extends Vue {
  @Prop() modelValue!: number;

  @Prop(Number) defaultValue = 0.5;
  @Prop(Number) min = 0;
  @Prop(Number) max = 1;
  @Prop() thumpStyleGetter!: CallableFunction;
  @Prop() backgroundStyle = '#FFFFFF'

  get thumbStyleValue(): string {
    return this.thumpStyleGetter(this.modelValue);
  }
}
</script>
