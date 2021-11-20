<template>
  <div class="main-component-wrapper">
    <img class="throbber" v-if="loading" src="@/assets/loading.gif">
    <router-view :class="{loading: loading}" v-on:loadingchange="loading = $event"></router-view>
  </div>
</template>

<style lang="scss">
.main-component-wrapper {
  position: relative;
  flex-grow: 1;
}

.loading {
  filter: blur(4px);
}

.throbber {
  z-index: 1000;
  position: absolute;
  width: 60px;
  height: 60px;
  left: calc(50% - 30px);
  top: calc(50% - 30px);
}
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';


@Options({})
export default class MainComponent extends Vue {
  loading = true;
}
</script>
