import {mainConfig} from "@/logic/services/main-config/types";

export const defaultConfig: mainConfig = {
    hoursPerDay: 8,
    taskTypes: [
        {
          "name": "Без типа",
          "color": [0, 0],
          "removable": false,
        },
        {
            "name": "Задача",
            "color": [54, 80],
            "removable": false
        }, {
            "name": "Созвон",
            "color": [180, 80],
            "removable": false
        },
    ],
    timeRange: [
        {hour: "0", minute: "15"},
        {hour: "0", minute: "30"},
        {hour: "0", minute: "40"},
        {hour: "1", minute: "0"},
    ]
};