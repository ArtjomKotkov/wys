import {JiraData, ReportModel, TokenApiResponse} from "@/logic/services/reports";


export class ReportHandler {
    baseUrl = 'http://127.0.0.1:5000';

    async token(token: string): Promise<TokenApiResponse> {
        const url = new URL(`${this.baseUrl}/token`);
        const params = {
            token: token
        }

        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString());
        return await response.json() as TokenApiResponse;
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

        const response = await fetch(url.toString());

        return await response.json() as ReportModel;
    }

    async jiraReport(
        token: string,
        server_jira: number,
        date: string,
    ): Promise<JiraData> {
        const url = new URL(`${this.baseUrl}/jira`);
        const params = {
            token,
            server_jira: String(server_jira),
            date,
        }

        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString());

        return await response.json() as JiraData;
    }

    async update(
        data: ReportModel
    ): Promise<void> {
        const url = new URL(`${this.baseUrl}/report`);

        await fetch(url.toString(), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}