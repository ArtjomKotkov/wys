import {AbstractEntityStorage} from "@/logic/services/storages/abstract-storage.service";
import {ReportData} from "@/logic/services/reports/types";
import {isEqualDay} from "@/logic";


export class ReportDataEntityService implements AbstractEntityStorage<ReportData> {

    constructor(
        private keyGroup: string,
        private identificatorFunction: CallableFunction = (item: ReportData, value: any) => isEqualDay(new Date(item.date), value),
    ) {
    }

    save(value: ReportData): void {
        let allData = this.getAll();
        const valueInStore = this.get(value.date);
        if (this.get(value.date)) {
            allData = allData.filter(item => valueInStore?.date !== item.date);
        }
        allData.push(value);
        localStorage.setItem(this.keyGroup, JSON.stringify(allData));
    }

    get(identificator: any): ReportData | undefined {
        return this.getEntity(identificator);
    }

    delete(identificator: any): void {
        let allData = this.getAll();
        const entity = this.getEntity(identificator);
        if (entity) {
            const index = allData.indexOf(entity);
            allData = allData.splice(index, 1);
            localStorage.setItem(this.keyGroup, JSON.stringify(allData));
        }
    }

    getAll(): ReportData[] {
        const value = localStorage.getItem(this.keyGroup);
        return value ? JSON.parse(value) as ReportData[] : [];
    }

    private getEntity(identificator: any): ReportData | undefined {
        const allData = this.getAll();
        return allData.find(item => this.identificatorFunction(item, identificator));
    }

}