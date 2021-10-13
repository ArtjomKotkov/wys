import {LocalStorageService} from "@/logic/services/storages/local-storage-service";
import {defaultConfig} from "@/const";
import {mainConfig} from "@/logic/services/main-config/types";


export class MainConfigService {
    store: LocalStorageService = new LocalStorageService('main-config');

    constructor() {
       if (!this.get()) {
           this.set(defaultConfig);
       }
    }


    get(): mainConfig {
        return this.store.get() as mainConfig;
    }

    set(value: mainConfig): void {
        return this.store.set(value);
    }

    clear(): void {
        this.clear();
    }
}