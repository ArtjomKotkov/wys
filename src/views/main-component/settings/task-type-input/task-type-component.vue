<template>
  <div class="task-type-component">
      <div class="task-type-title">Типы записей в отчете</div>
      <div v-for="(form, index) in forms" :key="index" class="type-selectors">
        <input-component
            v-model="form.controls.name.value"
            type="text"
            style_="rounded"
            :placeholder="'Тип задачи'"

            :is-valid="form.controls.name.isValid"
        ></input-component>
        <color-picker-component v-model="form.controls.color.value" :lightness="70"></color-picker-component>
        <icon-component @click="remove(index)" name="cross" v-if="form.controls.removable.value"></icon-component>
      </div>
      <icon-component @click="add()" name="plus"></icon-component>
  </div>
</template>

<style lang="scss">
  .task-type-component {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    gap: 20px;

    flex-basis: 33%;
  }

  .type-selectors {
    display: flex;
    flex-direction: row;

    width: 100%;

    justify-content: flex-start;
    align-items: center;
    gap: 15px;
  }

  .task-type-title {
    width: 100%;
    color: var(--light-gray);
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Form, hslConfig, InputControl, required} from "@/shared";
import InputComponent from "@/shared/form/input.vue";
import HslColorPickerComponent from "@/shared/form/color-picker.vue";
import IconComponent from "@/shared/icons/icon.vue";
import IconsDefinitionComponent from "@/shared/icons/icons-definition.vue";
import {Emit, Prop, Watch} from "vue-property-decorator";
import {defaultTaskTypes} from "@/const";


@Options({
  components: {
    InputComponent,
    ColorPickerComponent: HslColorPickerComponent,
    IconsDefinitionComponent,
    IconComponent,
  }
})
export default class TaskTypeComponent extends Vue {
  @Prop() modelValue!: Record<string, any>[];

  forms: Form[] = [];

  @Watch('forms', {deep: true})
  onFormsUpdate(): void {
    this.$emit('update:modelValue', this.value);
  }

  created(): void {
    if (!this.modelValue.length) {
      defaultTaskTypes.forEach(task => this.add(task.name, task.color, task.removable));
    }
    this.modelValue.forEach(item => this.add(item.name, item.color, item.removable));
    this.resetForm();
  }

  add(name = '', color: hslConfig = [180, 50], removable = true): void {
    const form = new Form({
      name: new InputControl<string>(name, [required, this.uniqueValidator]),
      color: new InputControl<hslConfig>(color),
      removable: new InputControl<boolean>(removable),
    });

    this.forms.push(form);
  }

  remove(index: number): void {
    this.forms.splice(index, 1);
  }

  uniqueValidator(value: string): boolean {
    return Object.values(this.forms).map(form => form.values).filter(values => values.name === value).length === 1;
  }

  @Emit('reset')
  resetForm(): void {
    this.forms.forEach(form => {
      form.forceValidity();
      form.forceUntouched();
    });
  }

  get value(): Record<string, any>[] {
    return this.forms.map(form => form.values);
  }

}
</script>
