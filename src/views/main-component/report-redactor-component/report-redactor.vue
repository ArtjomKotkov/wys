<template>
  <div class="report-redactor-wrapper">
  </div>
</template>

<style lang="scss">
  @media (max-width: 1366px) {
    .report-redactor-wrapper {
      overflow: visible !important;
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
    padding: 20px;
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import TextareaComponent from "@/shared/form/textarea.vue";
import TimeRangeComponent from "@/views/main-component/settings/time-range-input/time-range-component.vue";
import TimeRangeInput from "@/shared/form/time-range-input.vue";
import SelectComponent from "@/shared/form/selector.vue";
import {SelectItem} from "@/shared";


@Options({
  components: {
    TextareaComponent,
    TimeRangeComponent,
    TimeRangeInput,
    SelectComponent,
  }
})
export default class ReportRedactorComponent extends Vue {
}
</script>
