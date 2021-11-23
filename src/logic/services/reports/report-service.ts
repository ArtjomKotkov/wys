import {dateToReportDateString, dateToString, JiraData, TimeRange, TokenApiResponse, WeekService} from "@/logic";
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

    async getWeekDataByToken(token: string): Promise<TokenApiResponse | undefined> {
        return await this.handler.token(token);
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

    async getFromJira(server_jira: number, date: Date): Promise<Partial<ReportData> | undefined> {
        const token = this.getTokenByDate(date);
        if (!token) {
            return undefined;
        }
        const report_data = await this.handler.jiraReport(token, server_jira, dateToReportDateString(date));

        const reportParsedData = this.parseReportString(report_data.text_worklogs);
        const planParsedData = this.parsePlanString(report_data.text_plan);

        return {
            date: date,
            report: reportParsedData,
            plan: planParsedData,
        };
    }

    async save(report: ReportData): Promise<boolean> {
        this.store.save(report);

        const token = this.getTokenByDate(report.date);
        if (!token) {
            return false;
        }

        const reportModel = this.formatReportModel(report, token)

        await this.handler.update(reportModel);

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
            date: dateToReportDateString(report.date),
            project_id: Number(report.project),
            report: this.formatReport(report.report),
            plan: this.formatPlan(report.plan),
        }
    }

    private formatReport(report: Report[]): string {
        const reportRows = report.reverse().map(
            row => {
                const subName = row.subName ? `(${row.subName})` : '';
                const hour = this.getFormatedTime('h', row.timeRange.hour);
                const minute = this.getFormatedTime('m', row.timeRange.minute, !!hour);
                const timeRange = `[${hour}${minute}]`;
                const description = row.description ? '\n'+row.description : '';

                return `"${row.name}"${subName} ${timeRange}${description}`;
            }
        )
        return reportRows.join('\n\n');
    }

    getFormatedTime(type: 'm' | 'h', value: string, extraSpace = false): string {
        if (Number(value) === 0) {
            return '';
        }
        const extraSpaceString = extraSpace ? ' ' : '';

        return extraSpaceString + value + type;
    }

    private formatPlan(report: Plan[]): string {
        const planRows = report.reverse().map(
            row => {
                const subName = row.subName ? `(${row.subName})` : '';

                return `"${row.name}"${subName}`;
            }
        )
        return planRows.join('\n\n');
    }

    private parsePlanString(plan: string): Plan[] {
        const nameRe = /"(.*)"/;
        const subNameRe = /\((.*)\)/;

        if (plan === '') {
            return [];
        }

        return plan.split('\n\n').map(row => {
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

        if (report === '') {
            return [];
        }

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