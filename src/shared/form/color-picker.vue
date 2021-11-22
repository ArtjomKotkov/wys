<template>
  <input type="color" v-model="colorValue">
</template>

<style lang="scss">
  input[type=color] {

  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import Input from "@/shared/form/input.vue";


@Options({
  components: {Input}
})
export default class HslColorPickerComponent extends Vue {
  @Prop(String) modelValue = '#FFFFFF';

  colorValue?: string;

  created(): void {
    this.colorValue = this.modelValue;
  }

  @Watch('colorValue')
  onInternalChange(): void {
    this.$emit('update:modelValue', this.colorValue);
  }

  @Watch('modelValue')
  onExternalChange(): void {
    if (this.modelValue !== this.colorValue) {
      this.colorValue = this.modelValue;
    }
  }
}
</script>