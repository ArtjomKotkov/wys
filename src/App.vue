<template>
  <div>
    <calendar-component></calendar-component>
    <main-component></main-component>
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

  font-family: 'Roboto', sans-serif;

  background-color: var(--dark-gray);

  height: 100%;
  width: 100%;
  padding: 40px;
}
</style>

<script>
import CalendarComponent from "@/views/calendar-component/calendar";
import MainComponent from "@/views/main-component/main";

export default {
  name: "App",
  components: {
    CalendarComponent,
    MainComponent,
  },
};
</script>