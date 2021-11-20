<template>
  <div class="root-wrapper">
    <div class="input" :data-style="style_" :data-is-valid="isValid">
      <span class="title" v-if="label">{{label}}</span>
      <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :type="!forceTextType ? type : 'text'"
          :data-type="type"
          :placeholder="placeholder"
          :min="min"
          :max="max"

          :style="{'text-align': align}"
      >
      <div>
        <div
            class="toggle-showing"
            v-if="type === 'password'"
            @click="forceTextType = !forceTextType"
            :data-togled="forceTextType"
        >
        </div>
      </div>
      <div class="line" v-if="style_ === 'monolith' && !hideLine"></div>
    </div>
  </div>
</template>

<style lang="scss">

  .root-wrapper {
    padding: 0px 0;
  }

  .input[data-style="monolith"] {
    height: 60px;
    background-color: var(--medium-gray);
    outline: none;
    border: none;

    display: flex;
    flex-direction: row;
    align-items: center;

    position: relative;

    .title {
      height: 20px;

      color: var(--light-gray);

      position: absolute;
      top: -21px;

      line-height: 20px;
      font-size: 16px;
      font-weight: 400;

      padding: 0 10px;
    }

    input {
      font-size: 16px;
      width: 100%;

      flex-grow: 1;
      outline: none;
      border: none;

      background-color: inherit;
      height: 100%;

      line-height: 60px;
      padding: 0 20px;
    }

  }

  .input[data-style="rounded"] {
    height: 60px;
    outline: 2px solid #785FF7;
    background-color: var(--dark-gray);

    position: relative;

    font-size: 30px;
    line-height: 60px;

    display: flex;
    flex-direction: row;
    align-items: center;

    border-radius: 15px;

    &:focus {
      outline: 2px solid #785FF7;
      text-align: center;
    }

    &[data-is-valid=false] {
      outline: 2px solid var(--invalid-red);
    }

    input {
      font-size: 30px;
      width: 100%;

      flex-grow: 1;
      outline: none;
      border: none;

      background-color: inherit;
      height: 100%;

      line-height: 60px;
      padding: 0 20px;
    }

    .title {
      height: 20px;
      background-color: var(--dark-gray);

      color: var(--light-gray);

      position: absolute;
      left: 20px;
      top: -10px;

      line-height: 20px;
      font-size: 16px;
      font-weight: 400;

      padding: 0 10px;
    }
  }

  input {
    color: white;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;

    &::placeholder {
      color: var(--light-gray);
      font-size: 18px;
      line-height: 60px;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }

  }

  input[data-type='password'] {
    text-align: center;
    color: #785FF7;
  }

  .line {
    position: absolute;

    bottom: 0;
    width: calc(100% - 40px);
    margin-left: 20px;
    height: 2px;
    background-color: #785FF7;;
  }

  .input[data-is-valid=false] {
    input {
      color: var(--invalid-red);
    }
    
    .line {
      background-color: var(--invalid-red);
    }

    .toggle-showing {
      background-color: var(--invalid-red);
    }

    &[data-togled=true] {
      background-color: transparent;
      outline: 2px solid var(--invalid-red);
    }
  }

  .toggle-showing {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #785FF7;
    margin-right: 25px;

    &[data-togled=true] {
      background-color: transparent;
      outline: 2px solid #785FF7;
    }

  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';


@Options({})
export default class InputComponent extends Vue {
  @Prop(String) modelValue!: string;
  @Prop(String) type!: 'text' | 'password' | 'number';
  @Prop(String) style_: 'rounded' | 'monolith' = 'rounded';
  @Prop(String) label = '';
  @Prop(String) placeholder?: string;
  @Prop(Boolean) isValid = true;
  @Prop(Number) min?: number;
  @Prop(Number) max?: number;
  @Prop(String) align: 'center' | 'left' | 'right' = 'left';
  @Prop(Boolean) hideLine = false;

  forceTextType = false;
}
</script>
