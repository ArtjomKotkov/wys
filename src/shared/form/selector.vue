<template>
  <div class="selector-wrapper" v-click-outside="hide">
    <div class="main-input" @click="opened = !opened">
      <div class="color-icon">
        <div class="color-shape" :style="{'background-color': makeColor(modelValue?.color)}"></div>
      </div>
      <div class="main-value">{{modelValue.title}}</div>
      <div class="selector-icon">
        <div class="selector-shape" :data-opened="opened"></div>
      </div>
    </div>
    <div class="under-line"></div>
    <div class="options-selector" v-if="opened">
      <div
          class="option"
          v-for="item in items"
          :key="item.key"
          @click="select(item)"

          :data-selected="modelValue.key === item.key"
      >
        <div class="color-icon">
          <div class="color-shape" :style="{'background-color': makeColor(item?.color)}"></div>
        </div>
        <span>{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .selector-wrapper {
    position: relative;
    margin: 0;
    padding: 0;

    height: 45px;

    min-width: 250px;

    background-color: var(--medium-gray);

    color: white;
    line-height: 45px;
    font-size: 16px;

    & .under-line {
      position: absolute;
      bottom: 0;

      height: 1px;
      width: calc(100% - 40px);
      margin: 0 20px;
      background-color: var(--main-color);
    }

    & .main-input {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      cursor: pointer;

      & .color-icon {
        min-width: 15px;
        margin-left: 40px;

        .color-shape {
          width: 15px;
          height: 15px;

          border-radius: 7.5px;
        }
      }

      & .main-value {
        flex-grow: 1;

        padding-left: 20px;
      }

      & .selector-icon {
        margin-right: 40px;
        min-width: 10px;

        & .selector-shape {
          width: 10px;
          height: 10px;
          border-radius: 10px;

          background-color: transparent;
          outline: 2px solid var(--main-color);

          &[data-opened=true] {
            background-color: var(--main-color);
            outline: none;
          }

        }
      }

    }

    .options-selector {
      position: absolute;
      top: 45px;
      width: 100%;
      background-color: var(--medium-gray);

      z-index: 9999;

      .option {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        cursor: pointer;

        &:hover {
          background-color: var(--light-gray);
        }

        & .color-icon {
          min-width: 15px;
          margin-left: 40px;

          .color-shape {
            width: 15px;
            height: 15px;

            border-radius: 7.5px;
          }
        }

        span {
          padding-left: 20px;
          flex-grow: 1;
        }
      }

    }

  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';
import {clickOutside, hslConfig, hslConfigToBackgroundOption, SelectItem} from "@/shared";


@Options({
  directives: {
    clickOutside,
  }
})
export default class SelectComponent extends Vue {
  @Prop() modelValue!: SelectItem;
  @Prop(String) label = '';
  @Prop() items: SelectItem[] = [];

  opened = false;

  select(item: SelectItem): void {
    this.$emit('update:modelValue', item);
    this.hide();
  }

  makeColor(hslConfig?: hslConfig): string {
    return hslConfig ? hslConfigToBackgroundOption(hslConfig) : 'transparent';
  }

  private hide(): void {
    if (this.opened) {
      this.opened = false;
    }
  }
}
</script>
