import {hslConfig} from "@/shared";

export interface mainConfig {
    hoursPerDay: number;
    taskTypes: taskType[];
    timeRange: TimeRange[];
}

export interface taskType {
    name: string;
    color: hslConfig;
    removable: boolean;
}

export interface TimeRange {
    hour: string;
    minute: string;
}