import {ReportModel, TokenApiResponse} from "@/logic/services/reports";


export class ReportHandler {
    baseUrl = '***';

    async token(token: string): Promise<TokenApiResponse> {
        const url = new URL(`${this.baseUrl}/report_token`);
        const params = {
            token: token
        }

        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString(), {mode:'no-cors'});
        const a = await response.json() as TokenApiResponse;
        console.log(a);
        return a;
    }

    async report(
        token: string,
        project_id: number,
        date: string,
    ): Promise<ReportModel> {
        const url = new URL(`${this.baseUrl}/report`);
        const params = {
            token,
            project_id: String(project_id),
            date,
        }

        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString(), {mode: 'no-cors'});

        return await response.json() as ReportModel;
    }

    async update(
        data: ReportModel
    ): Promise<void> {
        const url = new URL(`${this.baseUrl}/report`);

        await fetch(url.toString(), {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors',
        });
    }
}