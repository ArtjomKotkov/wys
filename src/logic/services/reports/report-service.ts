import {dateToString, TokenApiResponse, WeekService} from "@/logic";
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

    getFromServer(date: Date): ReportData | undefined {
        return this.store.get(date);
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

}