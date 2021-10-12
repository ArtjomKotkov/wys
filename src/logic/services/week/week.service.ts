import {LocalStorageKeyValueService} from "@/logic/services/storages";
import {WeekConfig} from "@/logic/services/week/types";
import {dateToString, stringToDate} from "@/logic";
import {AbstractKeyValueStorage} from "@/logic/services/storages/abstract-storage.service";


export class WeekService {

    store: AbstractKeyValueStorage<Record<string, any>> = new LocalStorageKeyValueService('week-configs');

    set(week: WeekConfig): void {
        const key = this.makeKey(week.from, week.to);

        this.store.set(key, {
            color: week.color,
            secretKey: week.secretKey,
            from: dateToString(week.from),
            to: dateToString(week.to),
        });
    }

    get(from: Date, to: Date): WeekConfig | undefined {
        const key = this.makeKey(from, to);
        const value = this.store.get(key);

        return value ? {
            color: value.color,
            secretKey: value.secretKey,
            from: stringToDate(value.from),
            to: stringToDate(value.to),
        } : undefined;
    }

    remove(from: Date, to: Date): void {
        const key = this.makeKey(from, to);
        this.store.delete(key);
    }

    makeKey(from: Date, to: Date): string {
        return `${dateToString(from)}-${dateToString(to)}`
    }

}