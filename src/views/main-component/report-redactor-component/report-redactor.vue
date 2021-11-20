<template>
  <div class="report-redactor-wrapper">
    <div class="week-key-error" v-if="!isWeekTokenProvided">
      <img class='key-icon' src="@/assets/key.png">
      <div>Не предоставлен ключ недели</div>
    </div>
    <div v-if="isWeekTokenProvided && form">
      <div class="main-selectors">
        <select-component
            class="project-selector"

            v-model="form.controls.project.value"
            label="Проект"

            :items="projects"
        >
        </select-component>
        <select-component
            class="project-selector"

            v-model="form.controls.subProject.value"
            label="Под проект"

            :items="subProjects"
        >
        </select-component>
        <div class="buttons-block">
          <icon-component
              class="jira-icon"
              name="jira"
          ></icon-component>
          <button
              class="save-button"
              @click="handleSave"

              :disabled="!form.controls.planData.isValid && !form.controls.reportData.isValid"
          >
            <span v-if="!(form.controls.reportData.isValid && !form.controls.planData.isValid) && !(form.controls.planData.isValid && !form.controls.reportData.isValid)">Сохранить</span>
            <span v-if="form.controls.reportData.isValid && !form.controls.planData.isValid">Заполнить план</span>
            <span v-if="form.controls.planData.isValid && !form.controls.reportData.isValid">Заполнить отчет</span>
          </button>
        </div>
      </div>
      <div class="nav">
        <div
            v-for="item in navSelectionItems" :key="item.key"

            :data-selected="selectedNav.key === item.key"
            @click="selectedNav = item"
        >
          {{item.title}}
        </div>
      </div>
      <report-form
          v-show="selectedNav.key === 'report'"

          v-model="form.controls.reportData.value"

          @validityChange="reportIsValid = $event"
      ></report-form>
      <plan-redactor
          v-show="selectedNav.key === 'plan'"

          v-model="form.controls.planData.value"

          @validityChange="planIsValid = $event"
      ></plan-redactor>
    </div>

  </div>
</template>

<style lang="scss">

  .report-errors {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    & span {
      padding: 10px 0 0 0;
      color: var(--invalid-red);
    }
  }

  @media (max-width: 1610px) {
    .report-redactor-wrapper {
      overflow: visible !important;
    }
  }

  .week-key-error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    line-height: 100%;
    height: 100%;
    text-align: center;
    color: var(--light-gray);
    font-weight: bold;
    font-size: 32px;

    .key-icon {
      filter: invert(0.25);
      height: 250px;
      width: 250px;
    }
  }

  .save-button:disabled {
    background-color: var(--medium-gray);
    color: #525252;
    cursor: default;
  }

  .nav {
    display: flex;
    flex-direction: row;
    width: 100%;

    border-bottom: 2px solid var(--medium-gray);

    cursor: pointer;

    height: 45px;
    line-height: 45px;
    text-align: center;

    margin: 40px 0;

    div {
      width: 200px;
      color: var(--light-gray);

      &:hover[data-selected=false] {
        background-color: var(--medium-gray);
        color: white;
      }

      &[data-selected=true] {
        color: white;
        border-bottom: 2px solid white;
      }
    }
  }

  .report-redactor-wrapper {

    flex-grow: 1;

    background-color: var(--dark-gray);

    overflow: auto;
    height: 100%;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--light-gray);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--main-color);
    }

  }

  .report-redactor-wrapper {
    padding: 40px;
  }

  .main-selectors {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    align-items: center;

    gap: 50px;

    flex-wrap: wrap;

    .project-selector {
      flex-grow: 1;
    }

    .buttons-block {
      display: flex;
      flex-direction: row;

      align-items: center;
      gap: 50px;
    }
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import TextareaComponent from "@/shared/form/textarea.vue";
import TimeRangeComponent from "@/views/main-component/settings/time-range-input/time-range-component.vue";
import TimeRangeInput from "@/shared/form/time-range-input.vue";
import SelectComponent from "@/shared/form/selector.vue";
import {Form, InputControl, SelectItem} from "@/shared";
import IconComponent from "@/shared/icons/icon.vue";
import ReportForm from "@/views/main-component/report-redactor-component/report-form.vue";
import PlanRedactor from "@/views/main-component/report-redactor-component/plan-redactor.vue";
import {Inject, Watch} from "vue-property-decorator";
import {
  EntitySelectorService,
  isEqualDay,
  Plan,
  Report,
  ReportData,
  ReportService,
  stringToDate,
  TokenApiResponse
} from "@/logic";


@Options({
  components: {
    TextareaComponent,
    TimeRangeComponent,
    TimeRangeInput,
    SelectComponent,
    IconComponent,
    ReportForm,
    PlanRedactor,
  }
})
export default class ReportRedactorComponent extends Vue {
  @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;
  @Inject('reportService') readonly reportService!: ReportService;

  projects: SelectItem[] = [];
  subProjects: SelectItem[] = [];

  form!: Form;

  reportIsValid = false;
  planIsValid = false;

  selectedDate?: Date;
  isWeekTokenProvided = false;
  weekData?: TokenApiResponse;

  loading = false;

  navSelectionItems: SelectItem[] = [
    {key: 'report', title: 'Отчет'},
    {key: 'plan', title: 'План'}
  ];

  selectedNav = this.navSelectionItems[0];

  async created(): Promise<void> {
    await this.resetForm();
  }

  handleSave(): void {
    if (this.form?.controls.reportData.isValid && !this.form.controls.planData.isValid) {
      this.selectedNav = this.navSelectionItems[1];
    } else if (this.form?.controls.planData.isValid && !this.form.controls.reportData.isValid) {
      this.selectedNav = this.navSelectionItems[0];
    } else {
      this.save();
    }
  }

  save(): void {
    const currentSelectedDate = stringToDate(this.entitySelectorService.getCurrent()!.id);
    const formValues = this.form.values;

    this.reportService.save({
      date: currentSelectedDate,
      project: formValues.project.key,
      subProject: formValues.subProject.key,
      report: formValues.reportData,
      plan: formValues.planData,
    }, false);
  }

  @Watch('loading')
  onLoadingChange(): void {
    this.$emit('loadingchange', this.loading);
  }

  @Watch('entitySelectorService', {deep: true})
  async resetForm(): Promise<void> {
    this.loading = true;

    const date = stringToDate(this.entitySelectorService.getCurrent()!.id);

    this.isWeekTokenProvided = this.reportService.isWeekConfigProvidedForDate(date);

    if (!this.isWeekTokenProvided) {
      this.loading = false;
      return;
    }

    if (this.selectedDate && isEqualDay(date, this.selectedDate)) {
      return;
    }

    this.selectedDate = date;

    let externalReportData: Partial<ReportData> | undefined;

    if (this.selectedDate) {
      this.weekData = await this.reportService.getWeekData(this.selectedDate);

      if (this.weekData) {
        this.projects = this.weekData.projects.map(project => ({key: String(project.id), title: project.name}));
        this.subProjects = this.weekData.servers_jira.map(project => ({key: String(project.id), title: project.url_jira}));

        externalReportData = await this.reportService.getFromServer(Number(this.projects[0].key), this.selectedDate);
      }
    }

    this.selectedNav = this.navSelectionItems[0];

    if (!externalReportData) {
      this.loading = false;
      return;
    }

    // Форсим обновление формы если произошла перезагрузка стр.
    this.form = new Form({
      project: new InputControl<SelectItem>(this.projects[0]),
      subProject: new InputControl<SelectItem>(this.subProjects[0]),
      reportData: new InputControl<Report[]>(externalReportData.report ? externalReportData.report : [], [(_: any) => this.reportIsValid]),
      planData: new InputControl<Plan[]>(externalReportData.plan ? externalReportData.plan : [], [(_: any) => this.planIsValid]),
    });

    this.loading = false;
    this.$forceUpdate();
  }
}
</script>
