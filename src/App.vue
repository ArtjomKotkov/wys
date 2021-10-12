<template>
  <div class="app-wrapper">
    <calendar-component></calendar-component>
    <main-component></main-component>

    <icons-definition-component></icons-definition-component>
  </div>
</template>

<style lang="scss">
#app {
  --dark-gray: #191715;
  --light-gray: #2B2828;
  --medium-gray: #1C1C1C;

  --main-color: #785FF7;
  --secondary-color: #42348C;
  --third-color: #7263BD;

  --invalid-red: #F75F68;

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

  @media (max-width: 1366px) {
    .app-wrapper {
      overflow: auto;
    }
  }
}
</style>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {Provide} from "vue-property-decorator";
import {WeekService} from "@/logic";
import MainComponent from "@/views/main-component/main.vue";
import CalendarComponent from "@/views/calendar-component/calendar.vue";
import IconsDefinitionComponent from "@/shared/icons/icons-definition.vue";


@Options({
  components: {
    CalendarComponent,
    MainComponent,
    IconsDefinitionComponent
  }
})
export default class App extends Vue {
  @Provide('weekConfigService') weekConfigService: WeekService = new WeekService();
}


</script>