import {dateToReportDateString, dateToString, TimeRange, TokenApiResponse, WeekService} from "@/logic";
import {ReportDataEntityService} from "@/logic/services/storages";
import {Plan, Report, ReportData, ReportModel} from "@/logic/services/reports/types";
import {ReportHandler} from "@/logic/handler";


export class ReportService {

    handler = new ReportHandler();

    store = new ReportDataEntityService(
        'reports',
    );

    constructor(private weekService: WeekService) {
    }

    async getWeekData(date: Date): Promise<TokenApiResponse | undefined> {
        const token = this.getTokenByDate(date);
        if (!token) {
            return undefined;
        }
        return await this.handler.token(token);
    }

    async getFromServer(project_id: number, date: Date): Promise<Partial<ReportData> | undefined> {
        const token = this.getTokenByDate(date);
        if (!token) {
            return undefined;
        }
        const report_data = await this.handler.report(token, project_id, dateToReportDateString(date));

        const reportParsedData = this.parseReportString(report_data.report);
        const planParsedData = this.parsePlanString(report_data.plan);

        return {
            date: date,
            report: reportParsedData,
            plan: planParsedData,
        };
    }

    getFromStore(date: Date): ReportData | undefined {
        return this.store.get(date);
    }

    save(report: ReportData, sendToServer = false): boolean {
        this.store.save(report);

        if (sendToServer) {
            const token = this.getTokenByDate(report.date);
            if (!token) {
                return false;
            }

            const reportModel = this.formatReportModel(report, token)
            this.handler.update(reportModel);
        }

        return true;
    }

    isWeekConfigProvidedForDate(date: Date): boolean {
        return !!this.getTokenByDate(date);
    }

    private getTokenByDate(date: Date): string | undefined {
        const weekInfo = this.weekService.getByDate(date);
        return weekInfo?.secretKey;
    }

    private formatReportModel(
        report: ReportData,
        token: string,
    ): ReportModel {
        return {
            token,
            date: dateToString(report.date),
            project_id: report.project,
            report: this.formatReport(report.report),
            plan: this.formatPlan(report.plan),
        }
    }

    private formatReport(report: Report[]): string {
        const reportRows = report.map(
            row => `'${row.name}'${row.subName ? row.subName : ''} [${row.timeRange}]${row.description ? '\n'+row.description : ''}`
        )
        return reportRows.join('\n\n');
    }

    private formatPlan(report: Plan[]): string {
        const planRows = report.map(
            row => `'${row.name}'${row.subName ? '\n'+row.subName : ''}`
        )
        return planRows.join('\n\n');
    }

    private parsePlanString(report: string): Plan[] {
        const nameRe = /"(.*)"/;
        const subNameRe = /\((.*)\)/;

        return report.split('\n\n').map(row => {
            const name = row.match(nameRe);
            const subName = row.match(subNameRe);

            return {
                name: name && name[1] ? name[1] : 'Ошибка распознования',
                subName: subName && subName[1] ? subName[1] : undefined,
            }
        });
    }

    private parseReportString(report: string): Report[] {
        const nameRe = /"(.*)"/;
        const subNameRe = /\((.*)\)/;
        const timeRe = /(\[((\d*)h)?(\s?(\d*)m)?\])/;

        return report.split('\n\n').map(row => {
            const [mainData, description] = row.split('\n');
            const name = mainData.match(nameRe);
            const subName = mainData.match(subNameRe);
            const time = mainData.match(timeRe);

            return {
                taskType: subName ? 'Задача' : 'Без типа',
                name: name && name[1] ? name[1] : 'Ошибка распознования',
                subName: subName && subName[1] ? subName[1] : undefined,
                timeRange: {
                    hour: time && time[3] ? String(time[3]) : '0',
                    minute: time && time[5] ? String(time[5]) : '0',
                },
                description: description,
            }
        });
    }
}