<template>
  <div class="news-wrapper">
    <span>WYS 1.0</span>
  </div>
</template>

<style lang="scss">
  .news-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    span  {
      font-size: 32px;
      color: var(--light-gray-text);
      font-weight: bold;
    }
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';


@Options({})
export default class NewsComponent extends Vue {
  created(): void {
    this.$emit('loadingchange', false);
  }
}
</script>
