<template>
  <div class="app-wrapper">
    <calendar-component></calendar-component>
    <main-component></main-component>

    <icons-definition-component></icons-definition-component>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}

#app {
  --dark-gray: #191715;
  --light-gray: #2B2828;
  --medium-gray: #1C1C1C;

  --light-gray-text: #eaeaea;

  --main-color: #785FF7;
  --secondary-color: #42348C;
  --third-color: #7263BD;

  --invalid-red: #F75F68;
  --invalid-red-dark: #d03841;

  font-family: 'Roboto', sans-serif;

  background-color: var(--dark-gray);
  height: 100%;

  .app-wrapper {
    height: 100%;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    overflow: hidden;
  }

  @media (max-width: 1610px) {
    .app-wrapper {
      overflow: auto;

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
  }
}
</style>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Provide} from "vue-property-decorator";
import {
  EntitySelectorService,
  ReportService,
  WeekService,
} from "@/logic";
import MainComponent from "@/views/main-component/main.vue";
import CalendarComponent from "@/views/calendar-component/calendar.vue";
import IconsDefinitionComponent from "@/shared/icons/icons-definition.vue";
import {MainConfigService} from "@/logic/services/main-config/main-config-service";


@Options({
  components: {
    CalendarComponent,
    MainComponent,
    IconsDefinitionComponent
  }
})
export default class App extends Vue {
  @Provide('weekConfigService') weekConfigService: WeekService = new WeekService();
  @Provide('mainConfigService') mainConfigService: MainConfigService = new MainConfigService();
  @Provide('entitySelectorService') entitySelectorService = new EntitySelectorService();
  @Provide('reportService') reportService = new ReportService(this.weekConfigService);
}


</script>