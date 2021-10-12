<template>
  <div class="icons-definer-root">
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <symbol id="cross" width="26" height="26" viewBox="0 0 26 26" >
        <path d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M9 9.5L16.7 17.3" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M16.7 9.5L9 17.3" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </symbol>
    </svg>
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <symbol id="plus" width="26" height="26" viewBox="0 0 26 26" >
            <g clip-path="url(#clip0)">
              <path d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M7.5 13.4447L18.4602 13.5154" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M12.9447 8L13.0154 18.9602" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="26" height="26" fill="white"/>
              </clipPath>
            </defs>
        </symbol>
      </svg>


    </svg>

  </div>

</template>

<style lang="scss">
  .icons-definer-root {
    display: none;
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';


@Options({})
export default class IconsDefinitionComponent extends Vue {

}
</script>