import {LocalStorageService} from "@/logic/services/storages/local-storage-service";


export class MainConfigService {
    store: LocalStorageService = new LocalStorageService('main-config');

    get(): Record<string, any> {
        return this.store.get() as Record<string, any>;
    }

    set(value: Record<string, any>): void {
        return this.store.set(value);
    }

    clear(): void {
        this.clear();
    }
}