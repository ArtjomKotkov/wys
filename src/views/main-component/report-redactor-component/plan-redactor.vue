<template>
  <div class="report-form-wrapper">
    <icon-component
        class="plus-icon"

        name="plus"
        @click="add()"
    ></icon-component>
    <div class="forms">
      <div class="form-block" v-for="(form, index) in forms" :key="index">
        <input-component
            class="name-input form-block-item"
            v-model="form.controls.name.value"

            type="text"
            style_="monolith"
            placeholder="Название"

            :is-valid="form.controls.name.isValid"
        ></input-component>
        <input-component
            class="name-input form-block-item"

            v-model="form.controls.subName.value"

            type="text"
            style_="monolith"
            placeholder="Ссылка на задачу"

            :is-valid="form.controls.subName.isValid"
            :hide-line="true"
        ></input-component>
        <icon-component
            class="form-block-item"

            name="cross"
            @click="remove(index)"
        ></icon-component>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.forms {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-block {

  display: flex;
  flex-direction: row;

  justify-content: space-between;

  border-top: 1px solid var(--light-gray);

  padding-top: 15px;

  gap: 15px;

  & .name-input {
    flex-grow: 1;

    .input {
      height: 45px;
    }
  }
}

.plus-icon  {
  margin: 15px auto;
}
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

import _ from 'lodash';

import TextareaComponent from "@/shared/form/textarea.vue";
import TimeRangeComponent from "@/views/main-component/settings/time-range-input/time-range-component.vue";
import TimeRangeInput from "@/shared/form/time-range-input.vue";
import SelectComponent from "@/shared/form/selector.vue";
import {Form, InputControl, required, } from "@/shared";
import {Inject, Prop, Watch} from "vue-property-decorator";
import {MainConfigService, Plan} from "@/logic";
import IconComponent from "@/shared/icons/icon.vue";
import InputComponent from "@/shared/form/input.vue";


@Options({
  components: {
    TextareaComponent,
    TimeRangeComponent,
    TimeRangeInput,
    SelectComponent,
    IconComponent,
    InputComponent,
  }
})
export default class PlanRedactor extends Vue {
  @Prop() modelValue?: Plan[];

  @Inject('mainConfigService') readonly mainConfigService!: MainConfigService;

  forms: Form[] = [];

  mounted(): void {
    this.modelValue?.forEach(reportData => this.add(
        reportData.name,
        reportData.subName,
        false,
    ));
  }

  add(
      name = '',
      subName = '',
      emitEvent = true,
  ): void {
    const form = new Form({
      name: new InputControl<string>(name, [required]),
      subName: new InputControl<string>(subName),
    });
    this.forms.unshift(form);
    if (emitEvent) {
      this.updateModelValue();
    }
  }

  remove(index: number): void {
    this.forms.splice(index, 1);
    this.updateModelValue();
  }

  @Watch('forms', {deep: true})
  updateModelValue(): void {
    this.$emit('validityChange', _.every(this.forms.map(form => form.isValid), Boolean) && this.forms.length > 0);
    this.$emit('update:modelValue', this.getFormatedPlanData());
  }

  @Watch('modelValue', {deep: true})
  onModelValueChanged(): void {
    this.forms = [];
    this.modelValue?.forEach(reportData => this.add(
        reportData.name,
        reportData.subName,
        false,
    ));
  }

  private getFormatedPlanData(): Plan[] {
    return this.forms.map(form => {
      const data = form.values;
      return {
        name: data.name,
        subName: data.subName,
      }
    });
  }
}
</script>
