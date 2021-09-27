<template>
  <div>
    <div class="input" v-if="type === 'password' || type === 'text'" :data-style="style_">
      <span class="title" v-if="label">{{label}}</span>
      <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :type="!forceTextType ? type : 'text'"
          :data-type="type"
      >
      <div
          class="toggle-showing"
          v-if="type === 'password'"
          @click="forceTextType = !forceTextType"
      >
      </div>
      <div class="line" v-if="style_ === 'monolith'"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .input[data-style="monolith"] {
    margin-top: 21px;
    height: 60px;
    width: 400px;
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
    width: 400px;
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
  }

  input[data-type='password'] {
    text-align: center;
    color: #785FF7;
  }

  .line {
    position: absolute;

    bottom: 0;
    width: 100%;
    margin-left: 20px;
    height: 2px;
    background-color: #785FF7;;
  }

  .toggle-showing {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #785FF7;
    margin-right: 10px;
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';


@Options({})
export default class InputComponent extends Vue {
  @Prop(String) modelValue!: string;
  @Prop(String) type!: 'text' | 'password';
  @Prop(String) style_: 'rounded' | 'monolith' = 'rounded';
  @Prop(String) label = '';

  forceTextType = false;
}
</script>
