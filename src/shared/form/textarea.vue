<template>
  <div class="textarea-wrapper">
    <div class="textarea" :data-style="style_" :data-is-valid="isValid">
      <span class="title" v-if="label">{{label}}</span>
      <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
      >
      </textarea>
      <div class="line" v-if="style_ === 'monolith'"></div>
    </div>
  </div>
</template>

<style lang="scss">

.textarea-wrapper {
  padding: 0 0;
}

.textarea[data-style="monolith"] {
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

  textarea {
    font-size: 16px;
    width: 100%;

    flex-grow: 1;
    outline: none;
    border: none;

    background-color: inherit;
    height: 100%;

    line-height: 24px;
    padding: 20px;

    overflow: hidden;

    min-height: 24px;

    &::placeholder {
      color: var(--light-gray);
      font-size: 18px;
      line-height: 24px;
    }
  }

}

.textarea[data-style="rounded"] {
  outline: 2px solid #785FF7;
  background-color: var(--dark-gray);

  position: relative;

  font-size: 30px;
  line-height: 60px;

  display: flex;
  flex-direction: row;
  align-items: center;

  border-radius: 15px;

  padding: 5px;

  &:focus {
    outline: 2px solid #785FF7;
    text-align: center;
  }

  &[data-is-valid=false] {
    outline: 2px solid var(--invalid-red);
  }

  textarea {
    font-size: 30px;
    width: 100%;

    flex-grow: 1;
    outline: none;
    border: none;

    background-color: inherit;
    height: 100%;

    line-height: 60px;
    padding: 0 20px;

    overflow: hidden;

    &::placeholder {
      color: var(--light-gray);
      font-size: 18px;
      line-height: 60px;
    }
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

textarea {
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
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
  textarea {
    color: var(--invalid-red);
  }

  .line {
    background-color: var(--invalid-red);
  }

  .toggle-showing {
    background-color: var(--invalid-red);
  }
}
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop} from 'vue-property-decorator';


@Options({})
export default class TextareaComponent extends Vue {
  @Prop(String) modelValue!: string;
  @Prop(String) style_: 'rounded' | 'monolith' = 'rounded';
  @Prop(String) label = '';
  @Prop(String) placeholder?: string;
  @Prop(Boolean) isValid = true;
}
</script>
