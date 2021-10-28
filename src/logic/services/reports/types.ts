import {TimeRange} from "@/logic";

export interface Report {
    taskType: string;
    name: string;
    subName?: string;
    timeRange: TimeRange;
    description: string;
}

export interface Plan {
    name: string;
    subName?: string;
}

export interface ReportData {
    date: Date;
    project: string;
    subProject: string;
    report: Report[];
    plan: Plan[];
}

export interface TokenApiResponse {
    dates: string[];
    projects: Project[];
    servers_jira: ServerJira[];
}

export interface Project {
    id: number;
    name: string;
    table_mode: boolean;
    deleted: boolean;
    last_updated: string;
}

export interface ServerJira {
    id: number;
    url_jira: string;
    status: boolean;
}

export interface ReportModel {
    token?: string;
    date?: string;
    project_id?: string;
    report: string;
    plan: string;
}