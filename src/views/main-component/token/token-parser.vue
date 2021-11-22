<template>
  <div>
    <div v-if="failed">
      Невалидный токен или невозможно загрузить информацию в данный момент.
    </div>
    <div class="token-parser-wrapper" v-if="!failed">
      <div>Токен: {{token}}</div>
      <div>Временной интервал: с {{dateToStr(firstDate)}} по {{dateToStr(lastDate)}}</div>
      <div class="color-block">
        <div>Цвет:</div>
        <input type="color" v-model="color">
      </div>

      <button @click="save">Сохранить</button>
    </div>
  </div>
</template>

<style lang="scss">
  .token-parser-wrapper {
    margin: 50px 0;

    div {
      display: inline-block;
    }

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: 10px;

    font-size: 24px;
    color: var(--light-gray-text);

    & .color-block {
      display: flex;
      flex-direction: row;

      justify-content: center;
      align-items: center;

      gap: 30px;
    }
  }
</style>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {Inject, Watch} from "vue-property-decorator";
import {dateToString, EntitySelectorService, reportDateStringToDate, ReportService, WeekService} from "@/logic";


@Options({})
export default class TokenParserComponent extends Vue {
  loading = false;

  failed = false;

  token?: string | string[];
  firstDate?: Date;
  lastDate?: Date;

  color = '#785FF7';

  @Inject('weekConfigService') readonly weekConfigService!: WeekService;
  @Inject('reportService') readonly reportService!: ReportService;
  @Inject('entitySelectorService') readonly entitySelectorService!: EntitySelectorService;

  created(): void {
    this.$router.isReady().then(_ => this.routeUpdate());
  }

  @Watch('loading')
  onLoadingChange(): void {
    this.$emit('loadingchange', this.loading);
  }

  @Watch('$route')
  async routeUpdate(): Promise<void> {
    this.loading = true;
    this.token = this.$route.params.token;

    if (!this.token || Array.isArray(this.token)) {
      this.loading = false;
      return;
    }

    const weekData = await this.reportService.getWeekDataByToken(this.token);
    if (!weekData) {
      this.failed = true;
      this.loading = false;
      return;
    }

    this.firstDate = reportDateStringToDate(weekData.dates[0]);
    this.lastDate = reportDateStringToDate(weekData.dates[weekData.dates.length-1]);

    this.loading = false
  }

  dateToStr(date?: Date): string {
    return date ? dateToString(date) : '';
  }

  save(): void {
    if (!this.token || !this.lastDate || !this.firstDate) {
      return;
    }
    this.weekConfigService.set({
      secretKey: this.token as string,
      from: this.firstDate,
      to: this.lastDate,
      color: this.color,
    });
    this.$router.push({name: 'report-redactor', params: {date: dateToString(this.firstDate)}});
  }
}
</script>
