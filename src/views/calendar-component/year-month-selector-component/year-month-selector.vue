<template>
  <div class="year-month-selector-wrapper">
    <div class="main-selector">
      <div class="month sub" @click="selectPrevious">
        {{previousMonthName}}
      </div>
      <div class="month current">
        {{currentMonthName}}
      </div>
      <div class="month sub" @click="selectNext">
        {{nextMonthName}}
      </div>
    </div>
    <div class="sub-block">
      <div></div>
      <div>
        <div class="current-date-button" @click="selectCurrent">
          CURRENT
        </div>
      </div>
      <div>
        <input v-model.lazy='selectedYear' class="year-select" type="number" min="100">
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .main-selector {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    width: 560px;

    margin: 0 auto;
    user-select: none;
  }

  .month {
    cursor: pointer;
    font-weight: 400;
  }

  .current {
    width: 200px;
    height: 60px;
    border-radius: 15px;
    background-color: var(--main-color);

    font-size: 30px;
    color: var(--dark-gray);
    text-align: center;
    line-height: 60px;
  }

  .sub {
    width: 150px;
    height: 40px;
    border-radius: 15px;
    background-color: var(--secondary-color);

    font-size: 24px;
    color: var(--dark-gray);
    text-align: center;
    line-height: 40px;

    &:hover {
      background-color: var(--third-color);
    }
  }

  .current-date-button {
    margin: 0 auto;
    width: 80px;

    padding: 5px 10px;

    color: var(--light-gray);
    text-align: center;
    cursor: pointer;

    &:hover {
      color: var(--main-color);
    }
  }

  .year-select {
    -moz-appearance: textfield;
    -webkit-appearance: textfield;
    appearance: textfield;

    text-align: right;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      display: none;
    }

    font-size: 20px;

    width: 100%;

    background-color: transparent;
    outline: none;
    border: 0;

    color: var(--light-gray);

    &:focus {
      color: var(--main-color);
    }
  }

  .sub-block {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 560px;
    margin: 10px auto 0 auto;

    & div {
      width: 33.3%;
    }

  }

</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator';
import {addMonth, monthNames, monthKeys, setFirstDay, setYear} from "@/logic";


@Options({})
export default class YearMonthSelector extends Vue {
  @Prop() modelValue: Date = new Date();

  created(): void {
    this.selectedYear = this.modelValue.getFullYear();
  }

  private selectedYear = 0;

  @Watch('selectedYear')
  updateYear(): void {
    if (this.modelValue.getFullYear() === this.selectedYear) {
      return;
    }
    if (this.selectedYear < 100) {
      this.selectedYear = 100;
    }
    this.$emit('update:modelValue', setYear(this.modelValue, this.selectedYear));
  }


  selectPrevious(): void {
    this.$emit('update:modelValue', setFirstDay(addMonth(this.modelValue, -1)));
  }

  selectNext(): void {
    this.$emit('update:modelValue', setFirstDay(addMonth(this.modelValue, 1)));
  }

  selectCurrent(): void {
    this.$emit('update:modelValue', setFirstDay(new Date()));
  }

  get previousMonthName(): string {
    const currentMonthName = this.modelValue.getMonth();
    return currentMonthName > 0 ? monthKeys[currentMonthName-1].toUpperCase() : monthKeys[11].toUpperCase();
  }

  get currentMonthName(): string {
    return monthNames[this.modelValue.getMonth()].toUpperCase();
  }

  get nextMonthName(): string {
    const currentMonthName = this.modelValue.getMonth();
    return currentMonthName < 11 ? monthKeys[currentMonthName+1].toUpperCase() : monthKeys[0].toUpperCase();
  }

}
</script>
