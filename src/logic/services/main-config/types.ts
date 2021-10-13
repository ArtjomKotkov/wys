import {hslConfig} from "@/shared";

export interface mainConfig {
    hoursPerDay: number;
    taskTypes: taskType[];
    timeRange: timeRange[];
};

export interface taskType {
    name: string;
    color: hslConfig;
    removable: boolean;
}

export interface timeRange {
    hour: string;
    minute: string;
}