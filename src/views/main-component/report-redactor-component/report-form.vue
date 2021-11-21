<template>
  <div class="report-form-wrapper">
    <icon-component
        class="plus-icon"

        name="plus"
        @click="add()"
    ></icon-component>
    <div class="forms">
      <div class="form-block" v-for="(form, index) in forms" :key="index">
        <div class="name-block form-block-item">
          <input-component
              class="name-input"
              v-model="form.controls.name.value"

              type="text"
              style_="monolith"
              placeholder="Название"

              :is-valid="form.controls.name.isValid"
          ></input-component>
          <input-component
              class="task-link name-input form-block-item"

              v-model="form.controls.subName.value"

              type="text"
              style_="monolith"
              placeholder="Ссылка на задачу"

              :is-valid="form.controls.subName.isValid"
              :hide-line="true"
          ></input-component>
        </div>
        <time-range-input class="form-block-item" v-model="form.controls.timeRange.value"></time-range-input>
        <textarea-component
            class="report-description-area form-block-item"
            v-model="form.controls.description.value"

            style_="monolith"
            placeholder="Описание"
        ></textarea-component>
        <icon-component
            class="cross-icon-report-form form-block-item"

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
    @media (max-width: 1610px) {
      & {
        flex-direction: column !important;
        align-items: center;

        & .form-block-item {
          width: 100%;

          .time-range-selector {
            margin-left: auto;
          }
        }
      }

      .report-description-area .textarea {
        width: 100% !important;
      }

      .cross-icon-report-form {
        margin: 0 auto;
      }
    }

    display: flex;
    flex-direction: row;

    justify-content: space-between;

    border-top: 1px solid var(--light-gray);

    padding-top: 15px;

    gap: 15px;

    & .name-block {
      flex-grow: 1;

      & .name-input .input {
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
import TextareaComponent from "@/shared/form/textarea.vue";
import TimeRangeComponent from "@/views/main-component/settings/time-range-input/time-range-component.vue";
import TimeRangeInput from "@/shared/form/time-range-input.vue";
import SelectComponent from "@/shared/form/selector.vue";
import {Form, InputControl, required, SelectItem} from "@/shared";
import {Inject, Prop, Watch} from "vue-property-decorator";
import {MainConfigService, Report, TimeRange} from "@/logic";
import IconComponent from "@/shared/icons/icon.vue";
import InputComponent from "@/shared/form/input.vue";
import _ from "lodash";
import Textarea from "@/shared/form/textarea.vue";


@Options({
  components: {
    Textarea,
    TextareaComponent,
    TimeRangeComponent,
    TimeRangeInput,
    SelectComponent,
    IconComponent,
    InputComponent,
  }
})
export default class ReportForm extends Vue {
  @Prop() modelValue?: Report[];

  @Inject('mainConfigService') readonly mainConfigService!: MainConfigService;

  forms: Form[] = [];

  blankTaskType: SelectItem = {key: 'blank', title: 'Без типа'};
  defaultTimeRange: TimeRange = {hour: '0', minute: '0'};

  taskTypes: SelectItem[] = [this.blankTaskType];

  mounted(): void {
    this.taskTypes = this.taskTypes.concat(this.mainConfigService.get().taskTypes.map(item => ({
      key: item.name, title: item.name, color: item.color
    })));
    this.modelValue?.forEach(reportData => this.add(
        this.taskTypes.find(taskType => taskType.key === reportData.taskType),
        reportData.name,
        reportData.subName,
        reportData.timeRange,
        reportData.description,
        false,
    ));
  }

  add(
      taskType = this.blankTaskType,
      name = '',
      subName = '',
      timeRange = this.defaultTimeRange,
      description = '',
      emitEvent = true,
  ): void {
    const form = new Form({
      taskType: new InputControl<SelectItem>(taskType),
      name: new InputControl<string>(name, [required]),
      subName: new InputControl<string>(subName),
      timeRange: new InputControl<TimeRange>(timeRange),
      description: new InputControl<string>(description),
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
    this.$emit('update:modelValue', this.getFormatedReportData());
  }

  @Watch('modelValue')
  onModelValueChanged(): void {
    this.forms = [];
    this.modelValue?.forEach(reportData => this.add(
        this.taskTypes.find(taskType => taskType.key === reportData.taskType),
        reportData.name,
        reportData.subName,
        reportData.timeRange,
        reportData.description,
        false,
    ));
  }

  private getFormatedReportData(): Report[] {
    return this.forms.map(form => {
      const data = form.values;
      return {
        taskType: data.taskType.key,
        name: data.name,
        subName: data.subName,
        timeRange: data.timeRange,
        description: data.description,
      }
    });
  }
}
</script>
