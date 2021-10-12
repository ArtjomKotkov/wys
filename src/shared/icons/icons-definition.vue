<template>
  <div class="icons-definer-root">

    <svg width="26" height="26" viewBox="0 0 26 26" class="stroke-editable-main-color">
      <symbol id="cross" width="26" height="26" viewBox="0 0 26 26">
        <path
            d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z"
            stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M9 9.5L16.7 17.3" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M16.7 9.5L9 17.3" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </symbol>
    </svg>

    <svg width="26" height="26" viewBox="0 0 26 26" class="stroke-editable-main-color">
      <symbol id="plus" width="26" height="26" viewBox="0 0 26 26">
        <g clip-path="url(#clip0)">
          <path
              d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z"
              stroke="#785FF7" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
          <path d="M7.5 13.4447L18.4602 13.5154" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10"
                stroke-linecap="round"/>
          <path d="M12.9447 8L13.0154 18.9602" stroke="#785FF7" stroke-width="2" stroke-miterlimit="10"
                stroke-linecap="round"/>
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="26" height="26" fill="white"/>
          </clipPath>
        </defs>
      </symbol>
    </svg>

    <svg viewBox="0 0 26 26" width="26" height="26" class="fill-editable-main-color">
      <symbol id="menu" width="26" height="26" viewBox="0 0 26 26">
          <path d="M2.16675 5.41663V7.58329H23.8334V5.41663H2.16675ZM2.16675 11.9166V14.0833H23.8334V11.9166H2.16675ZM2.16675 18.4166V20.5833H23.8334V18.4166H2.16675Z"/>
      </symbol>
    </svg>

    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <symbol id="jira" width="26" height="26" viewBox="0 0 26 26">
        <rect width="17.8695" height="4.70251" rx="2" class="fill-editable-main-color" transform="matrix(-0.708339 0.705872 0.708339 0.705872 22.6691 9.71606)"/>
        <rect width="18.3336" height="4.71117" rx="2" class="fill-editable-secondary-color" transform="matrix(0.708339 0.705872 -0.708339 0.705872 3.33716 9.73328)"/>
        <rect width="17.9024" height="4.71117" rx="2" class="fill-editable-secondary-color" transform="matrix(0.708339 -0.705872 0.708339 0.705872 0.00012207 12.9642)"/>
        <rect width="18.3335" height="4.70251" rx="2" class="fill-editable-main-color" transform="matrix(-0.708339 -0.705872 -0.708339 0.705872 26 12.941)"/>
      </symbol>
    </svg>

  </div>

</template>

<style lang="scss">
  .icons-definer-root {
    display: none;
  }

  .stroke-editable-main-color path {
    stroke: var(--main-color);
  }

  .fill-editable-main-color path,
  rect.fill-editable-main-color {
    fill: var(--main-color);
  }

  .fill-editable-secondary-color path,
  rect.fill-editable-secondary-color {
    fill: var(--secondary-color);
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';


@Options({})
export default class IconsDefinitionComponent extends Vue {

}
</script>