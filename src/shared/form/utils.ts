import {hslConfig} from "@/shared/form/types";


export const hslConfigToBackgroundOption = (config: hslConfig): string => {
    const [hue, lightness] = config;

    return `hsla(${hue}, 100%, ${lightness}%, 1)`;
}