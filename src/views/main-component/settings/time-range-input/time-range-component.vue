<template>
  <div class="task-type-component">
      <div class="task-type-title">Предустановленные временные интервалы</div>
      <div v-for="(form, index) in forms" :key="index" class="type-selectors">
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
        <icon-component @click="remove(index)" name="cross"></icon-component>
      </div>
      <icon-component @click="add()" v-if="forms.length < limit" name="plus"></icon-component>
  </div>
</template>

<style lang="scss">
  .number-input {

    & input {
      width: 70px !important;
    }
  }

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
import {Form, InputControl, required} from "@/shared";
import InputComponent from "@/shared/form/input.vue";
import IconComponent from "@/shared/icons/icon.vue";
import IconsDefinitionComponent from "@/shared/icons/icons-definition.vue";
import {Emit, Prop, Watch} from "vue-property-decorator";


@Options({
  components: {
    InputComponent,
    IconsDefinitionComponent,
    IconComponent,
  }
})
export default class TimeRangeComponent extends Vue {
  @Prop() modelValue!: Record<string, any>[];

  forms: Form[] = [];
  limit = 4;

  @Watch('forms', {deep: true})
  onFormsUpdate(): void {
    this.$emit('update:modelValue', this.value);
  }

  created(): void {
    this.modelValue.forEach(value => this.add(value.hour, value.minute));

    this.resetForm();
  }

  add(hour = 0, minute = 0): void {
    const form = new Form({
      hour: new InputControl<number>(hour, [required]),
      minute: new InputControl<number>(minute, [required]),
    });

    this.forms.push(form);
  }

  remove(index: number): void {
    this.forms.splice(index, 1);
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
