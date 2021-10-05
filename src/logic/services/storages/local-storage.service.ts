import {AbstractKeyValueStorage} from "./abstract-storage.service";

export class LocalStorageService implements AbstractKeyValueStorage<Record<string, any>> {

    constructor(private keyGroup: string) {
    }

    set(key: string, value: Record<string, any>): void {
        const storedData = this.getGroup();
        if (storedData) {
            storedData[key] = value;
            this.storeGroup(storedData);
        } else {
            this.storeGroup({
                [key]: value
            });
        }
    }

    get(key: string): Record<string, any> | undefined {
        const storedData = this.getGroup();
        if (!storedData) {
            return undefined;
        }
        return storedData[key];
    }

    delete(key: string): void {
        const storedData = this.getGroup();
        if (storedData) {
            delete storedData[key];
            this.storeGroup(storedData);
        }
    }


    private getGroup(): any {
        const groupData = localStorage.getItem(this.keyGroup);
        if (!groupData) {
            return undefined
        }
        return JSON.parse(groupData);
    }

    private storeGroup(group: any): void {
        const groupData = JSON.stringify(group);
        localStorage.setItem(this.keyGroup, groupData);
    }
}