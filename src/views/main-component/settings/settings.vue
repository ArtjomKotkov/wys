<template>
  <div class="settings-wrapper">
    <div class="form-buttons">
      <button
          v-if="this.form.dirty"
          :disabled="!form.isValid"

          @click="save"
      >Сохранить</button>
    </div>
    <div class="columns-wrapper">
      <div class="settings-column">
        <input-component
            class="hours-per-day"
            v-model="form.controls.hoursPerDay.value"
            type="text"
            label="Рабочих часов в день"
            style_="rounded"
            :placeholder="'Введите цифру'"

            :is-valid="form.controls.hoursPerDay.isValid"
        ></input-component>
      </div>
      <div class="settings-column">
        <time-range-component
            v-model="form.controls.timeRange.value"

            @reset="form.controls.timeRange.forceUntouched()"
        ></time-range-component>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  button {
    width: 200px;
    margin: 5px;
    height: 40px;
    outline: none;
    border: none;

    cursor: pointer;
    border-radius: 15px;

    background-color: var(--secondary-color);
    color: var(--dark-gray);

    &:hover {
      background-color: var(--main-color);
    }

  }

  @media (max-width: 1610px) {
    .settings-wrapper {
      overflow: visible !important;
    }

    .settings-column {
      flex-basis: 45% !important;
    }
  }

  .settings-wrapper {
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

  .form-buttons {
    min-height: 40px;
    padding: 40px 40px 0 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .columns-wrapper {
    display: flex;
    flex-direction: row;

    justify-content: space-between;

    padding: 40px 40px;

    overflow-y: auto;

    flex-grow: 1;
    flex-wrap: wrap;
    gap: 40px;
  }

  .settings-column {
    display: flex;
    flex-direction: column;
    gap: 30px;
    flex-basis: 30%;
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import InputComponent from "@/shared/form/input.vue";
import {Form, InputControl} from "@/shared";
import TimeRangeComponent from "@/views/main-component/settings/time-range-input/time-range-component.vue";
import {Inject, Watch} from "vue-property-decorator";
import {mainConfig, MainConfigService} from "@/logic";


@Options({
  components: {
    InputComponent,
    TimeRangeComponent,
  }
})
export default class SettingsComponent extends Vue {
  @Inject('mainConfigService') readonly mainConfigService!: MainConfigService;

  loading = false;

  @Watch('loading')
  onLoadingChange(): void {
    this.$emit('loadingchange', this.loading);
  }

  form = new Form({
    hoursPerDay: new InputControl<number>(8, [this.hoursPerDayValidator]),
    timeRange: new InputControl<number[]>([]),
  });

  created(): void {
    this.loading = true;
    const defaultValue = this.mainConfigService.get();

    if (defaultValue) {
      this.form.reset(defaultValue);
    }
    this.loading = false;
  }

  save(): void {
    const value = this.form.values as mainConfig;
    value.hoursPerDay = Number(value.hoursPerDay);

    this.mainConfigService.set(value);
    this.form.reset(value);
  }

  hoursPerDayValidator(value: string): boolean {
    return 1 <= Number(value) && Number(value) <= 24;
  }

}
</script>
