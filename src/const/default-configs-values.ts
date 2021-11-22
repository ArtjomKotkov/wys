import {mainConfig} from "@/logic/services/main-config/types";

export const defaultConfig: mainConfig = {
    hoursPerDay: 8,
    timeRange: [
        {hour: "0", minute: "15"},
        {hour: "0", minute: "30"},
        {hour: "0", minute: "40"},
        {hour: "1", minute: "0"},
    ]
};