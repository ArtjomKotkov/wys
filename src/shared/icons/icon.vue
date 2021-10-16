<template>
  <div class="icon-wrapper">
    <svg class="svg-icon" aria-hidden="true" focusable="false">
      <use :xlink:href="'#'+name"/>
    </svg>
  </div>
</template>

<style lang="scss">
  .svg-icon {
    display: inline-block;
    height: 26px;
    width: 26px;

    fill: none;
  }

  .icon-wrapper {
    cursor: pointer;

    height: 45px;
    width: 45px;
    background-color: var(--medium-gray);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 45px;
    min-width: 45px;

    max-height: 45px;
    max-width: 45px;
  }

  .icon-wrapper:hover {
    background-color: var(--light-gray);
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from "vue-property-decorator";
import IconsDefinition from "@/shared/icons/icons-definition.vue";


@Options({
  components: {IconsDefinition}
})
export default class IconComponent extends Vue {
  @Prop(String) name!: string;

}
</script>