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
      <div class="settings-column-1">
        <input-component
            class="hours-per-day"
            v-model="form.controls.hoursPerDay.value"
            type="text"
            label="Рабочих часов в день"
            style_="rounded"
            :placeholder="'Введите цифру'"

            :is-valid="form.controls.hoursPerDay.isValid"
        ></input-component>
        <task-type-component
            v-model="form.controls.taskTypes.value"

            @reset="form.controls.taskTypes.forceUntouched()"
        ></task-type-component>
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

  @media (max-width: 1366px) {
    .settings-wrapper {
      overflow: visible !important;
    }
  }

  .settings-wrapper {
    flex-grow: 1;

    background-color: var(--dark-gray);

    overflow: auto;
    height: 100%;
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

    padding: 40px 40px;

    overflow-y: auto;

    flex-grow: 1;
    flex-wrap: wrap;
  }

  .settings-column-1 {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import TaskTypeComponent from "@/views/main-component/settings/task-type-input/task-type-component.vue";
import InputComponent from "@/shared/form/input.vue";
import {Form, InputControl} from "@/shared";
import {MainConfigService} from "@/logic/services/main-config/main-config-service";


@Options({
  components: {
    TaskTypeComponent,
    InputComponent,
  }
})
export default class SettingsComponent extends Vue {

  mainConfigService = new MainConfigService();

  created(): void {
    const defaultValue = this.mainConfigService.get();

    if (defaultValue) {
      this.form.reset(defaultValue);
    }
  }

  form = new Form({
    hoursPerDay: new InputControl<number>(8, [this.hoursPerDayValidator]),
    taskTypes: new InputControl<Record<string, any>[]>([]),
  });

  save(): void {
    const value = this.form.values;
    value.hoursPerDay = Number(value.hoursPerDay);

    this.mainConfigService.set(value);
    this.form.reset(value);
  }

  hoursPerDayValidator(value: string): boolean {
    return 1 <= Number(value) && Number(value) <= 24;
  }

}
</script>
