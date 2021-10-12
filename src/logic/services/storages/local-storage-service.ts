import {AbstractStorage} from "./abstract-storage.service";

export class LocalStorageService implements AbstractStorage<Record<string, any>> {

    constructor(private keyGroup: string) {
    }

    set(value: Record<string, any>): void {
        localStorage.setItem(this.keyGroup, JSON.stringify(value));
    }

    get(): Record<string, any> | undefined {
        const value = localStorage.getItem(this.keyGroup);
        return value ? JSON.parse(value) : undefined;
    }

    delete(): void {
        localStorage.removeItem(this.keyGroup)
    }
}